#!/usr/bin/env python3
"""Renders templates/index.template.html + data/content.json into dist/.
Run on every push via GitHub Actions. No login, no CMS: edit data/content.json
and hours.json-style fields, push, and the site rebuilds itself.
"""
import json
import re
import shutil
import subprocess
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data" / "content.json").read_text())
SITE_URL = sys.argv[1] if len(sys.argv) > 1 else "https://ahroonsanthosh.github.io/chapelgate"

DATA["site"] = {"url": SITE_URL.rstrip("/")}
DATA["business"]["address"]["mapsQueryEncoded"] = urllib.parse.quote(
    DATA["business"]["address"]["mapsQuery"]
)

PARTIALS = {
    "logoInline": (ROOT / "assets/logo/chapel-gate-cafe-logo.svg").read_text(),
    "badgeInline": (ROOT / "assets/logo/badge-mark.svg").read_text(),
}


def get_path(ctx, path):
    cur = ctx
    for part in path.split("."):
        if isinstance(cur, list):
            cur = cur[int(part)]
        elif isinstance(cur, dict):
            cur = cur.get(part)
        else:
            return None
        if cur is None:
            return None
    return cur


TOKEN_RE = re.compile(
    r"{{#each ([\w\.]+)}}(.*?){{/each}}"
    r"|{{#if ([\w\.]+)}}(.*?){{/if}}"
    r"|{{>(\w+)}}"
    r"|{{([\w\.@]+)}}",
    re.DOTALL,
)


def render(template, ctx):
    def repl(m):
        each_path, each_body, if_path, if_body, partial, var = m.groups()
        if each_path is not None:
            items = get_path(ctx, each_path) or []
            out = []
            for i, item in enumerate(items):
                local = dict(ctx)
                local["this"] = item
                local["@index"] = i
                out.append(render(each_body, local))
            return "".join(out)
        if if_path is not None:
            val = get_path(ctx, if_path)
            if "{{else}}" in if_body:
                truthy_body, falsy_body = if_body.split("{{else}}", 1)
            else:
                truthy_body, falsy_body = if_body, ""
            return render(truthy_body, ctx) if val else render(falsy_body, ctx)
        if partial is not None:
            return PARTIALS.get(partial, "")
        if var is not None:
            if var == "@index":
                return str(ctx.get("@index", ""))
            if var.startswith("this"):
                sub = var[4:].lstrip(".")
                val = ctx.get("this") if not sub else get_path(ctx.get("this"), sub)
            else:
                val = get_path(ctx, var)
            return "" if val is None else str(val)
        return ""

    prev = None
    out = template
    # allow nested constructs to resolve (each containing if, etc.)
    while prev != out:
        prev = out
        out = TOKEN_RE.sub(repl, out, count=0)
    return out


def npx_available():
    try:
        subprocess.run(["npx", "--version"], capture_output=True, check=True, timeout=15)
        return True
    except Exception:
        return False


def build_css(dist):
    combined = "\n".join(
        (ROOT / "css" / name).read_text()
        for name in ["fonts.css", "tokens.css", "styles.css"]
    )
    (dist / "css").mkdir(parents=True, exist_ok=True)
    raw_path = dist / "css" / "_combined.css"
    raw_path.write_text(combined)
    out_path = dist / "css" / "site.css"

    if npx_available():
        try:
            subprocess.run(
                ["npx", "--yes", "-p", "clean-css-cli", "--", "cleancss", "-o", str(out_path), str(raw_path)],
                check=True, capture_output=True, timeout=60,
            )
        except Exception as e:
            print(f"cleancss failed ({e}); shipping unminified CSS")
            shutil.copy(raw_path, out_path)
    else:
        print("npx unavailable; shipping unminified CSS")
        shutil.copy(raw_path, out_path)
    raw_path.unlink()
    print(f"CSS: {len(combined)} -> {out_path.stat().st_size} bytes")

    deferred_raw = ROOT / "css" / "fonts-deferred.css"
    deferred_out = dist / "css" / "fonts-deferred.css"
    if npx_available():
        try:
            subprocess.run(
                ["npx", "--yes", "-p", "clean-css-cli", "--", "cleancss", "-o", str(deferred_out), str(deferred_raw)],
                check=True, capture_output=True, timeout=60,
            )
        except Exception as e:
            print(f"cleancss (deferred) failed ({e}); shipping unminified")
            shutil.copy(deferred_raw, deferred_out)
    else:
        shutil.copy(deferred_raw, deferred_out)


def build_js(dist):
    (dist / "js" / "vendor").mkdir(parents=True, exist_ok=True)
    for vendor_file in (ROOT / "js" / "vendor").glob("*.js"):
        shutil.copy(vendor_file, dist / "js" / "vendor" / vendor_file.name)

    src_path = ROOT / "js" / "main.js"
    out_path = dist / "js" / "main.js"
    if npx_available():
        try:
            subprocess.run(
                ["npx", "--yes", "terser", str(src_path), "-o", str(out_path), "--compress", "--mangle"],
                check=True, capture_output=True, timeout=60,
            )
        except Exception as e:
            print(f"terser failed ({e}); shipping unminified JS")
            shutil.copy(src_path, out_path)
    else:
        print("npx unavailable; shipping unminified JS")
        shutil.copy(src_path, out_path)
    print(f"JS: {src_path.stat().st_size} -> {out_path.stat().st_size} bytes")


def main():
    dist = ROOT / "dist"
    if dist.exists():
        shutil.rmtree(dist)
    dist.mkdir(parents=True)

    tpl = (ROOT / "templates" / "index.template.html").read_text()
    html = render(tpl, DATA)
    (dist / "index.html").write_text(html)

    build_css(dist)
    build_js(dist)

    if (ROOT / "assets").exists():
        shutil.copytree(ROOT / "assets", dist / "assets")

    (dist / ".nojekyll").write_text("")

    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{SITE_URL.rstrip('/')}/</loc></url>
</urlset>
"""
    (dist / "sitemap.xml").write_text(sitemap)

    robots = f"User-agent: *\nAllow: /\nSitemap: {SITE_URL.rstrip('/')}/sitemap.xml\n"
    (dist / "robots.txt").write_text(robots)

    print(f"Built dist/ ({len(html)} bytes index.html)")


if __name__ == "__main__":
    main()
