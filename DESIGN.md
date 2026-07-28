# Blondie — art direction and build notes

## The one structural idea

**The page is one trading day.** Blondie opens at half eight and closes at half
four, and the site runs on that clock rather than on section numbers. The ground
under the whole page is a single fixed gradient that warms from early-morning
cream through midday amber to a late-afternoon terracotta, scrubbed to scroll
position. The fixed rail down the left edge counts hours — 10.15, 12.00, 13.00,
14.00, 15.00, 16.30 — and the active hour's mark morphs from a flat line to a
wavy one. Every section header leads with its time. It is Radian's "01 / 09"
progress counter rewritten as the thing Blondie actually sells: a case that
changes by the hour.

## Reference and tier

**Tier 1, Reference C** (warm / local / hospitality), with the two Reference E
patterns the brief flags as worth stealing regardless of tier: draggable
idle-float marks (E1) and the scrubbed alternating-rotation corkboard (E5).

Tier 2 was ruled out on assets. There are ten still photographs and no video,
no turntable footage and no frame sequences, so the Tier 2 showpieces —
scroll-scrubbed canvas image sequences, still-to-motion hover video cards,
scrubbed video morphs — could only have been faked. They were skipped.

## Type

| Voice | Face | Used for |
|---|---|---|
| Display | **Fraunces** (variable, `SOFT` and `WONK` axes on) | Every headline. A high-contrast retro serif that answers the serif B on the shop sign. |
| Accent | **Caveat** | The chalkboard voice, and only where a member of staff would actually write something: "ask what's fresh", the wine beside each dish, the questions on the corkboard. |
| Utility | **DM Mono**, tracked out | Hours, address, the clock rail, section kickers, buttons, captions, counters. |

All three are self-hosted from `assets/fonts/`, subset to latin, `font-display:
swap`. Fraunces and DM Mono are preloaded; Caveat is not, because it never
appears above the fold.

## Colour

Sampled from the photographs, not chosen from a palette.

| Token | Value | Where it came from |
|---|---|---|
| `--cream` | `#fbf3e7` | the brown bread and the table tops |
| `--amber` | `#e0a24f` | the pendant lamps in `bl6` |
| `--clay` / `--terracotta` | `#8a5a3b` / `#c8804f` | the timber and the late light |
| `--ink` | `#1e1512` | the darkest point in the room shots |
| `--red` | `#c4392c` | the shop sign |

Strategy: **continuous gradient**, one accent. The red is counted, not
sprinkled — the badge, the two Book buttons, the section clocks, the corkboard
pins, the live status dot, the preloader bar. `--red-deep` (`#9d2a1f`) is the
variant used wherever the accent has to carry small text, because the sign red
does not clear 4.5:1 on cream.

## Motion

Three eases only: entrance `cubic-bezier(0.16, 1, 0.3, 1)`, exit
`cubic-bezier(0.4, 0, 1, 1)`, interact `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
No extra named eases were registered — that budget belongs to Tier 2.

**The one unnecessary delightful thing:** the bake case. Six line drawings —
a slice, a pavlova, a whisk, a glass, a flat white, a scone — drift on their own
randomised cycles, scale up with a shadow when you press them, spring back with
`back.out(3)` on release and hand off to a fresh drift. Arrow keys nudge them
for anyone not using a mouse. There is deliberately no second indulgence; the
physics easter egg from 5B-6 was skipped so this one stands alone.

## Patterns implemented

From **5B** (Tier 1 / Reference C): 1 asset-gated preloader · 2 line-masked
headline · 3 duplicated-track marquee reversing with scroll direction · 4
hide-down/show-up nav · 7 pinned scrubbed cycler, as the sticky dimmed pairing
list · 8 pinned horizontal rail · 9 SVG stroke draw-on (the chalk underline) ·
10 two-state icon button with colour-fill sweep · 11 slow scroll-linked rotation
on one circular mark · 12 oversized footer wordmark reveal · 13 global
`[data-reveal]` system · 14 reduced-motion kill switch.

From **5C / E**: 1 draggable idle-float marks · 4 single-play peel-apart reveal ·
5 scrubbed alternating-rotation corkboard · 7 IntersectionObserver-gated
reveals.

Also borrowed from **A**: the section progress counter (as the day clock) and
the sticky list where only the live line is at full contrast.

**Deliberately skipped:** 5B-5 still-to-motion hover cards and every Tier 2
video/canvas pattern (no footage exists — faking them is explicitly a fail
condition); 5B-6 the physics easter egg (one delightful thing, not two); 5C-D
entirely (wrong register and wrong asset budget for an independent café).

## The three 21st.dev components

21st.dev could not be reached from the build environment — every request to the
site returned HTTP 403 through the network proxy — so the three below were
reimplemented from their public registry patterns rather than pulled, and then
restyled to project tokens until no default styling remained. Each is vanilla:
no React, no Tailwind, no runtime dependency added.

1. **Marquee** — the "all-day brunch / baked this morning / closed Mondays"
   ticker under the hero. Duplicated track, GSAP-driven, `timeScale` flips with
   scroll direction and slows to 12% on hover. Chosen because the brief's
   reference C uses exactly this and the copy is genuinely utility information,
   not decoration.
2. **Sticky Scroll Reveal** — the wine-pairing section. The list scrolls, only
   the live pairing is at full contrast, and the plate beside it cross-fades to
   match. Chosen because it is the only pattern that lets the differentiator
   (a glass suggested per dish) be *demonstrated* rather than asserted.
3. **Dock** — the bottom-anchored Menu / Find / Book pill on mobile. Chosen
   because reference C calls for a thumb-reach nav and because the two things a
   phone visitor standing on Main Street actually needs are directions and a
   table.

## Known limits

* **The logo is a trace, not the original.** See the README. The source is the
  shop sign at roughly 56 pixels across in an overcast photograph.
* **Photographic resolution.** The ten originals are 509–1360px wide phone
  shots. Display sizes are capped so nothing is upscaled at 1×, but on a 2×
  screen the food photography is soft. A proper shoot is the single highest-value
  thing anyone could add to this site, and no amount of CSS substitutes for it.
* **The wine pairings** in `content.json` are written from the brief. Blondie
  should confirm the four grapes before this goes to a real audience.
