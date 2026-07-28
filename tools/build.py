#!/usr/bin/env python3
"""Blondie static build.

Reads content.json + src/ and writes a fully static site to dist/.
No server, no CMS, no runtime data fetching — every word on the page is baked
into the HTML at build time so the site reads fine with JavaScript switched off.

Run:  python3 tools/build.py
"""
import html
import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")


def e(s):
    return html.escape(str(s), quote=True)


# --------------------------------------------------------------------------
# Drawn marks. Everything below is specific to Blondie — the badge is the
# traced shop sign, the rest were drawn for this site. No icon library.
# --------------------------------------------------------------------------

BADGE = open(os.path.join(ROOT, "assets", "logo.svg")).read()
BADGE = re.sub(r"<\?xml.*?\?>", "", BADGE).strip()
# unique-ify the clipPath id per inline copy so repeated inlining stays valid
_badge_n = [0]


def badge():
    _badge_n[0] += 1
    n = _badge_n[0]
    return BADGE.replace("bl-stem-clip", f"bl-stem-clip-{n}")


ARROW = (
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" '
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M4 12L12 4M12 4H6M12 4v6"/></svg>'
)

SEAL = """<svg viewBox="0 0 200 200">
  <defs><path id="sealpath" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0"/></defs>
  <g class="seal__ring" id="seal-ring">
    <text><textPath href="#sealpath" startOffset="0">BAKED THIS MORNING · WINE BY THE GLASS · BAKED THIS MORNING · WINE BY THE GLASS · </textPath></text>
  </g>
  <g fill="none" stroke="#8a5a3b" stroke-width="1.4" stroke-linecap="round">
    <path d="M84 92h32v14a16 16 0 0 1-32 0V92Z"/>
    <path d="M116 95h7a6 6 0 0 1 0 12h-7"/>
    <path d="M80 118h40"/>
    <path d="M90 84c0-5 4-5 4-9s-4-4-4-8"/>
    <path d="M100 84c0-5 4-5 4-9s-4-4-4-8"/>
    <path d="M110 84c0-5 4-5 4-9s-4-4-4-8"/>
  </g>
</svg>"""

# the chalk underline, drawn on when the section enters
UNDERLINE = """<svg viewBox="0 0 240 18" id="chalk-rule" aria-hidden="true">
  <path d="M4 12C40 5 78 4 118 6c38 2 76 6 118 2"/>
  <path d="M14 16c34-5 70-6 108-4"/>
</svg>"""

WINE_MARK = (
    '<svg viewBox="0 0 16 22" fill="none" stroke="currentColor" stroke-width="1.4" '
    'stroke-linecap="round" aria-hidden="true">'
    '<path d="M3 2h10l-1.2 7A4.8 4.8 0 0 1 8 12.5 4.8 4.8 0 0 1 4.2 9L3 2Z"/>'
    '<path d="M8 12.5V19"/><path d="M4.5 20h7"/></svg>'
)

MQ_MARK = (
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" '
    'stroke-linecap="round" aria-hidden="true">'
    '<path d="M8 2c1.8 2 1.8 3.4 0 5.4S6.2 12 8 14"/>'
    '<path d="M12.4 4c1.2 1.4 1.2 2.4 0 3.8"/><path d="M3.6 4c-1.2 1.4-1.2 2.4 0 3.8"/></svg>'
)

# the six things that can end up in the case, drawn as line marks and made
# draggable. this is the site's one unnecessary delightful thing.
CRUMBS = [
    ("Slice", '<path d="M14 46h44l-6 26a8 8 0 0 1-8 6H28a8 8 0 0 1-8-6l-6-26Z"/>'
              '<path d="M14 46l22-30 22 30"/><path d="M22 56c6-4 12 4 18 0s12 4 18 0"/>'
              '<path d="M36 16v-6"/>'),
    ("Pavlova", '<path d="M12 52c0-14 12-24 24-24s24 10 24 24"/>'
                '<path d="M10 52h52l-4 16a8 8 0 0 1-8 6H22a8 8 0 0 1-8-6l-4-16Z"/>'
                '<circle cx="26" cy="42" r="4"/><circle cx="40" cy="38" r="4"/><circle cx="50" cy="45" r="4"/>'),
    ("Whisk", '<path d="M36 74V44"/><path d="M30 74h12"/>'
              '<path d="M36 44c-10-6-14-18-10-28 4-10 16-10 20 0 4 10 0 22-10 28Z"/>'
              '<path d="M36 16v28"/><path d="M27 22c4 8 4 16 0 22"/><path d="M45 22c-4 8-4 16 0 22"/>'),
    ("A glass", '<path d="M18 12h36l-4 24a14 14 0 0 1-28 0l-4-24Z"/><path d="M36 50v22"/><path d="M24 76h24"/>'),
    ("Flat white", '<path d="M12 30h40v20a16 16 0 0 1-32 0V30Z"/>'
                   '<path d="M52 34h8a8 8 0 0 1 0 16h-8"/><path d="M10 74h48"/>'
                   '<path d="M26 22c0-4 4-4 4-8s-4-4-4-8"/><path d="M38 22c0-4 4-4 4-8s-4-4-4-8"/>'),
    ("Scone", '<path d="M10 56c0-16 12-28 26-28s26 12 26 28"/>'
              '<path d="M8 56h56v6a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8v-6Z"/>'
              '<path d="M24 44c4-4 8-4 12 0M40 38c4-4 8-3 10 1"/>'),
]

I_MENU = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" '
          'stroke-linecap="round" aria-hidden="true"><path d="M4 4v6a3 3 0 0 0 6 0V4"/>'
          '<path d="M7 10v6"/><path d="M16 4c-2 2-2 5 0 7v5"/></svg>')
I_PIN = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" '
         'stroke-linecap="round" aria-hidden="true"><path d="M10 18s6-6 6-10a6 6 0 1 0-12 0c0 4 6 10 6 10Z"/>'
         '<circle cx="10" cy="8" r="2.2"/></svg>')
I_BOOK = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" '
          'stroke-linecap="round" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12" rx="2"/>'
          '<path d="M3 8.5h14"/><path d="M7 3v3M13 3v3"/><path d="M7.5 12.5l2 2 3.5-4"/></svg>')

IG = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">'
      '<rect x="3" y="3" width="14" height="14" rx="4.2"/><circle cx="10" cy="10" r="3.4"/>'
      '<circle cx="14.2" cy="5.8" r="0.9" fill="currentColor" stroke="none"/></svg>')
FB = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">'
      '<path d="M12.4 18v-7h2.4l.4-3h-2.8V6.3c0-.9.3-1.5 1.6-1.5H15.3V2.1A20 20 0 0 0 13 2c-2.3 0-3.9 1.4-3.9 4v2H6.7v3h2.4v7Z"/></svg>')


# --------------------------------------------------------------------------
# Fragment builders
# --------------------------------------------------------------------------

MANIFEST = json.load(open(os.path.join(ROOT, "assets", "img", "out", "manifest.json")))


def srcset(name, ratio, ext):
    return ", ".join(
        f"assets/img/out/{name}-{ratio}-{w}.{ext} {w}w" for w, _ in MANIFEST[f"{name}-{ratio}"]
    )


def pic(name, ratio, sizes, alt, lazy=True, extra=""):
    """Every <picture> on the site is generated from the derivative manifest, so
    a srcset can never name a file the image build did not produce."""
    steps = MANIFEST[f"{name}-{ratio}"]
    w, h = steps[-1]
    load = 'loading="lazy" decoding="async"' if lazy else 'decoding="async" fetchpriority="high"'
    return (f'<picture>'
            f'<source type="image/avif" srcset="{srcset(name, ratio, "avif")}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{srcset(name, ratio, "webp")}" sizes="{sizes}">'
            f'<img src="assets/img/out/{name}-{ratio}-{w}.webp" width="{w}" height="{h}" '
            f'alt="{e(alt)}" {load}{extra}></picture>')


def hero_picture():
    """The hero is the one image with a purpose-made mobile crop: 16:9 of the
    room on desktop where the row of lamps reads, 4:5 on a phone where it
    doesn't."""
    return (
        '<picture>'
        f'<source type="image/avif" media="(max-width: 61.999rem)" srcset="{srcset("bl6", "4x5", "avif")}" sizes="100vw">'
        f'<source type="image/webp" media="(max-width: 61.999rem)" srcset="{srcset("bl6", "4x5", "webp")}" sizes="100vw">'
        f'<source type="image/avif" srcset="{srcset("bl6", "16x9", "avif")}" sizes="42vw">'
        f'<source type="image/webp" srcset="{srcset("bl6", "16x9", "webp")}" sizes="42vw">'
        '<img src="assets/img/out/bl6-16x9-1280.webp" width="1360" height="765" '
        'alt="The room at Blondie: long wooden tables under a row of amber pendant lamps, with people eating brunch." '
        'fetchpriority="high" decoding="async"></picture>'
    )


def build_rail(c):
    marks = [
        (c["pairing"]["clock"], "pairing", c["pairing"]["kicker"]),
        (c["bakecase"]["clock"], "case", c["bakecase"]["kicker"]),
        (c["menu"]["clock"], "menu", c["menu"]["kicker"]),
        (c["room"]["clock"], "room", c["room"]["kicker"]),
        (c["asked"]["clock"], "asked", c["asked"]["kicker"]),
        (c["find"]["clock"], "find", c["find"]["kicker"]),
    ]
    out = []
    for t, href, label in marks:
        out.append(
            f'<a class="rail__mark" href="#{href}" data-rail="{e(t)}" title="{e(label)}">'
            f'<svg class="rail__line" viewBox="0 0 34 10" aria-hidden="true">'
            f'<path d="M1 5H33"/></svg>'
            f'<span class="rail__t">{e(t)}</span>'
            f'<span class="vh">{e(label)}</span></a>'
        )
    return "\n".join(out)


def build_hero_lines(lines):
    out = []
    for i, ln in enumerate(lines):
        txt = e(ln)
        if i == len(lines) - 1:
            txt = f"<em>{txt}</em>"
        out.append(f'<span class="ln"><span>{txt}</span></span>')
    return "".join(out)


def build_marquee(items):
    one = "".join(
        f'<span class="mq__item">{e(t)}{MQ_MARK}</span>' for t in items
    )
    return f'<div class="mq__set">{one}</div><div class="mq__set">{one}</div>'


def build_pairs(items):
    rows, frames = [], []
    for i, it in enumerate(items):
        n = f"{i + 1:02d}"
        on = ' data-on="1"' if i == 0 else ""
        rows.append(
            f'<li class="pair__item" data-pair="{i}"{on}>'
            f'<span class="pair__no">{n}</span>'
            f'<h3 class="pair__dish">{e(it["dish"])}</h3>'
            f'<p class="pair__wine">{WINE_MARK}{e(it["wine"])}</p>'
            f'<p class="pair__note">{e(it["note"])}</p></li>'
        )
        alt = it.get("alt") or f'{it["dish"]} at Blondie.'
        p = pic(it["img"], "4x5", "(min-width: 62rem) 34vw, 92vw", alt)
        rows[-1] = rows[-1].replace("</li>", f'<div class="pair__shot">{p}</div></li>')
        frames.append(f'<div class="pair__frame" data-frame="{i}"{on}>{p}</div>')
    return "\n".join(rows), "\n".join(frames)


def build_case_items(items):
    return "\n".join(
        f'<li class="case__row"><b>{e(it["name"])}</b><i class="case__dots"></i>'
        f'<span>{e(it["note"])}</span></li>' for it in items
    )


def build_crumbs():
    # spread across the play area; the exact resting places are randomised at
    # runtime, these are the no-JS / reduced-motion positions.
    spots = [(8, 10), (52, 6), (30, 38), (70, 42), (14, 66), (54, 70)]
    out = []
    for i, (name, path) in enumerate(CRUMBS):
        x, y = spots[i]
        out.append(
            f'<div class="crumb" data-crumb="{i}" style="left:{x}%;top:{y}%" '
            f'role="img" aria-label="{e(name)}, a drawn mark you can drag around">'
            f'<svg viewBox="0 0 72 84" fill="none" stroke="currentColor" stroke-width="2.1" '
            f'stroke-linecap="round" stroke-linejoin="round">{path}</svg>'
            f'<span class="crumb__label">{e(name)}</span></div>'
        )
    return "\n".join(out)


def build_menu_cards(sections):
    out = []
    for i, s in enumerate(sections):
        p = pic(s["img"], "4x5", "(min-width: 62rem) 24rem, 62vw", f'{s["name"]} at Blondie.')
        out.append(
            f'<article class="rail-card" data-reveal>'
            f'<div class="rail-card__fig"><span class="rail-card__n">{i + 1:02d}</span>{p}</div>'
            f'<h3>{e(s["name"])}</h3><p>{e(s["items"])}</p></article>'
        )
    return "\n".join(out)


def build_asked(items):
    return "\n".join(
        f'<article class="note" data-note="{i}"><h3>{e(it["q"])}</h3><p>{e(it["a"])}</p></article>'
        for i, it in enumerate(items)
    )


def build_hours(hours):
    out = []
    for h in hours:
        closed = ' data-closed="1"' if not h["open"] else ""
        note = f'<span class="hours__note">{e(h["note"])}</span>' if h["note"] else "<span></span>"
        if h["open"]:
            val = (f'<time datetime="{h["open"]}">{e(h["label"].split("—")[0].strip())}</time>'
                   f' — <time datetime="{h["close"]}">{e(h["label"].split("—")[1].strip())}</time>')
        else:
            val = e(h["label"])
        out.append(
            f'<li data-day="{h["schema"]}"{closed}>'
            f'<span class="hours__day">{e(h["day"])}</span><span>{val}</span>{note}</li>'
        )
    return "\n".join(out)


def build_jsonld(c):
    b = c["business"]
    spec = [
        {"@type": "OpeningHoursSpecification", "dayOfWeek": h["schema"],
         "opens": h["open"], "closes": h["close"]}
        for h in c["hours"] if h["open"]
    ]
    data = {
        "@context": "https://schema.org",
        "@type": "CafeOrCoffeeShop",
        "@id": b["siteUrl"] + "#business",
        "name": b["legalName"],
        "alternateName": b["name"],
        "description": c["meta"]["description"],
        "url": b["siteUrl"],
        "image": [b["siteUrl"] + "assets/og.jpg"],
        "logo": b["siteUrl"] + "assets/logo.svg",
        "priceRange": b["priceRange"],
        "servesCuisine": ["Brunch", "Irish", "Café"],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": b["street"],
            "addressLocality": b["town"],
            "addressRegion": b["county"],
            "postalCode": b["eircode"],
            "addressCountry": b["country"],
        },
        "geo": {"@type": "GeoCoordinates", "latitude": b["lat"], "longitude": b["lng"]},
        "openingHoursSpecification": spec,
        "acceptsReservations": b["booking"],
        "hasMenu": {
            "@type": "Menu",
            "name": "Blondie all-day menu",
            "hasMenuSection": [
                {"@type": "MenuSection", "name": s["name"], "description": s["items"]}
                for s in c["menu"]["sections"]
            ],
        },
        "sameAs": [b["instagram"], b["facebook"]],
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q["q"],
             "acceptedAnswer": {"@type": "Answer", "text": q["a"]}}
            for q in c["asked"]["items"]
        ],
    }
    return json.dumps([data, faq], ensure_ascii=False, separators=(",", ":"))


# --------------------------------------------------------------------------

def main():
    c = json.load(open(os.path.join(ROOT, "content.json")))
    tpl = open(os.path.join(ROOT, "src", "index.template.html")).read()
    css = open(os.path.join(ROOT, "src", "styles.css")).read()
    # the stylesheet is inlined, so its font URLs resolve from the document
    css = re.sub(r"\n\s*/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"[ \t]+", " ", css)
    css = re.sub(r"\n{2,}", "\n", css)

    b = c["business"]
    pair_rows, pair_frames = build_pairs(c["pairing"]["items"])

    subs = {
        "META_TITLE": e(c["meta"]["title"]),
        "META_DESC": e(c["meta"]["description"]),
        "THEME": c["meta"]["themeColor"],
        "SITE": b["siteUrl"],
        "BOOKING": b["booking"],
        "INSTAGRAM": b["instagram"],
        "IG_HANDLE": e(b["instagramHandle"]),
        "FACEBOOK": b["facebook"],
        "CSS": css,
        "JSONLD": build_jsonld(c),
        "ARROW": ARROW,
        "SEAL": SEAL,
        "UNDERLINE": UNDERLINE,
        "IG": IG, "FB": FB,
        "I_MENU": I_MENU, "I_PIN": I_PIN, "I_BOOK": I_BOOK,
        "RAIL": build_rail(c),
        "PRELOAD": (
            '<link rel="preload" as="image" href="assets/img/out/bl6-16x9-1280.avif" '
            'type="image/avif" imagesrcset="' + srcset("bl6", "16x9", "avif").replace("assets", "assets") + '" '
            'imagesizes="(min-width: 62rem) 42vw, 100vw" fetchpriority="high" media="(min-width: 62rem)">'
        ),
        "HERO_PIC": hero_picture(),
        "ROOM_L": pic("bl5", "4x5", "(min-width: 62rem) 27rem, 47vw",
                      "A coffee and a folded napkin on a wooden table by the window at Blondie."),
        "ROOM_R": pic("bl10", "4x5", "(min-width: 62rem) 27rem, 47vw",
                      "Brunch plates and coffees on a table in the window seat at Blondie."),
        "ROOM_WIDE": pic("bl9", "16x9", "(min-width: 62rem) 46rem, 92vw",
                         "A full table at Blondie — eggs, toast, coffees and a jar of flowers."),
        "FIND_SHOT": pic("bl1", "4x5", "(min-width: 74rem) 22rem, (min-width: 56rem) 40vw, 92vw",
                         "The front of Blondie on Main Street, Ballincollig, with the red circular sign over the door."),
        "HERO_EYEBROW": e(c["hero"]["eyebrow"]),
        "HERO_LINES": build_hero_lines(c["hero"]["lines"]),
        "HERO_BODY": e(c["hero"]["body"]),
        "HERO_CTA": e(c["hero"]["cta"]),
        "HERO_CTANOTE": e(c["hero"]["ctaNote"]),
        "MARQUEE": build_marquee(c["marquee"]),
        "PAIR_CLOCK": e(c["pairing"]["clock"]), "PAIR_KICKER": e(c["pairing"]["kicker"]),
        "PAIR_TITLE": e(c["pairing"]["title"]), "PAIR_BODY": e(c["pairing"]["body"]),
        "PAIR_ITEMS": pair_rows, "PAIR_FRAMES": pair_frames,
        "CASE_CLOCK": e(c["bakecase"]["clock"]), "CASE_KICKER": e(c["bakecase"]["kicker"]),
        "CASE_TITLE": e(c["bakecase"]["title"]), "CASE_BODY": e(c["bakecase"]["body"]),
        "CASE_CHALK": e(c["bakecase"]["chalk"]),
        "CASE_ITEMS": build_case_items(c["bakecase"]["items"]),
        "CRUMBS": build_crumbs(),
        "MENU_CLOCK": e(c["menu"]["clock"]), "MENU_KICKER": e(c["menu"]["kicker"]),
        "MENU_TITLE": e(c["menu"]["title"]), "MENU_CARDS": build_menu_cards(c["menu"]["sections"]),
        "ROOM_CLOCK": e(c["room"]["clock"]), "ROOM_KICKER": e(c["room"]["kicker"]),
        "ROOM_TITLE": e(c["room"]["title"]), "ROOM_BODY": e(c["room"]["body"]),
        "ASK_CLOCK": e(c["asked"]["clock"]), "ASK_KICKER": e(c["asked"]["kicker"]),
        "ASK_TITLE": e(c["asked"]["title"]), "ASK_ITEMS": build_asked(c["asked"]["items"]),
        "FIND_CLOCK": e(c["find"]["clock"]), "FIND_KICKER": e(c["find"]["kicker"]),
        "FIND_TITLE": e(c["find"]["title"]), "FIND_BODY": e(c["find"]["body"]),
        "HOURS": build_hours(c["hours"]),
    }

    out = tpl
    for k, v in subs.items():
        out = out.replace("{{" + k + "}}", v)
    # BADGE is inlined more than once and each copy needs its own clip id
    while "{{BADGE}}" in out:
        out = out.replace("{{BADGE}}", badge(), 1)

    left = re.findall(r"\{\{([A-Z_]+)\}\}", out)
    if left:
        raise SystemExit(f"unfilled template slots: {sorted(set(left))}")

    # ---- write dist ------------------------------------------------------
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    open(os.path.join(DIST, "index.html"), "w").write(out)

    shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(DIST, "assets"))
    shutil.copy(os.path.join(ROOT, "src", "main.js"), os.path.join(DIST, "assets", "main.js"))
    open(os.path.join(DIST, ".nojekyll"), "w").write("")
    open(os.path.join(DIST, "robots.txt"), "w").write(
        f"User-agent: *\nAllow: /\nSitemap: {b['siteUrl']}sitemap.xml\n"
    )
    open(os.path.join(DIST, "sitemap.xml"), "w").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"<url><loc>{b['siteUrl']}</loc><changefreq>monthly</changefreq>"
        "<priority>1.0</priority></url></urlset>\n"
    )
    print(f"built dist/ — index.html {len(out) // 1024} KB")


if __name__ == "__main__":
    main()
