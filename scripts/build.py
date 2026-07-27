#!/usr/bin/env python3
"""Render templates/index.html.j2 + content/site.json into a static index.html.
Usage: python3 scripts/build.py [--out DIST_DIR] [--site-url URL]
This is the only "build step" the site has: no bundler, no framework.
Edit content/site.json (hours, menu, prices, testimonials) and re-run.
"""
import argparse
import datetime
import re
import shutil
from pathlib import Path

import json
from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).resolve().parent.parent


def read_brand_svg(name):
    text = (ROOT / "assets" / "brand" / name).read_text()
    viewbox = re.search(r'viewBox="([^"]+)"', text).group(1)
    transform = re.search(r'<g[^>]*transform="([^"]+)"', text)
    path = re.search(r'<path d="([^"]+)"/>', text).group(1)
    return viewbox, (transform.group(1) if transform else ""), path


def wordmark_group_markup():
    text = (ROOT / "assets" / "brand" / "wordmark.svg").read_text()
    inner = re.search(r"<g fill=\"currentColor\">(.*)</g>\s*</svg>", text, re.S).group(1)
    return inner.strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=str(ROOT))
    parser.add_argument("--site-url", default="https://ahroonsanthosh.github.io/balance/")
    args = parser.parse_args()

    data = json.loads((ROOT / "content" / "site.json").read_text())
    heart_vb, heart_transform, heart_path = read_brand_svg("heart-mark.svg")

    env = Environment(loader=FileSystemLoader(str(ROOT / "templates")), autoescape=False)
    template = env.get_template("index.html.j2")

    html = template.render(
        b=data["business"],
        hours=data["hours"],
        differentiator=data["differentiator"],
        menu=data["menu"],
        testimonials=data["testimonials"],
        gallery=data["gallery"],
        features=data["business"]["features"],
        heart_viewbox=heart_vb,
        heart_transform=heart_transform,
        heart_path=heart_path,
        wordmark_group=wordmark_group_markup(),
        site_url=args.site_url,
        year=datetime.date.today().year,
    )

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(html)
    print(f"wrote {out_dir / 'index.html'} ({len(html)} bytes)")

    if out_dir.resolve() != ROOT.resolve():
        def skip_sources(dir_path, names):
            # "*-src.webp" are working negatives kept for scripts/build_images.py;
            # the rendered HTML never references them, so leave them out of dist.
            return [n for n in names if re.search(r"-src\.\w+$", n)]

        for item in ["css", "js", "assets", "favicon.svg", "robots.txt", "sitemap.xml"]:
            src = ROOT / item
            if not src.exists():
                continue
            dst = out_dir / item
            if src.is_dir():
                shutil.copytree(src, dst, dirs_exist_ok=True, ignore=skip_sources)
            else:
                shutil.copy2(src, dst)


if __name__ == "__main__":
    main()
