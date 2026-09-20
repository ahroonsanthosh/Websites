# Heloria Brand Analysis: the current site

**Subject:** https://www.helorialabs.com/ (canonical: https://helorialabs.com/)
**Method:** live inspection of the rendered DOM and the shipped stylesheet.
**Date of inspection:** 2026-09-20
**Status:** analysis only. Nothing here is a redesign proposal.

Every fact below was read off the live site. Where something was not found, this
document says so rather than filling the gap.

---

## 1. Current brand language

### 1.1 Verbal

The site speaks in short declarative sentences with no marketing vocabulary. The
entire copy of the page, in order:

- `Heloria Labs` (wordmark, `h1`)
- `A software company in Ireland.` (lede)
- `We build our own software and run it ourselves.` (statement)
- `Build`: "We design and build our products in-house, start to finish."
- `Run`: "We host them, support them and keep them running."
- `Hold`: "We build products to keep, not to sell on."
- `Our projects` / `krios.ie`
- `People` with three names
- `contact@helorialabs.com`
- A footer readout: ENTITY, COMPANY NO, INCORPORATED, JURISDICTION, PRODUCTS

Meta description: "Heloria Labs is a software company in Ireland. We build our
own products and hold them for the long term. Kríos is the first."

There is no pitch, no feature list, no testimonial, no call to action beyond an
email address. The tone is factual, restrained, and slightly institutional. The
footer readout pushes that further by presenting the company as a record rather
than a brand.

### 1.2 Visual

Dark, near-monochrome, violet-tinted. The visual devices actually shipped:

- A fixed full-page "field": three layered radial gradients over black, driven
  by a `--field-hue: 252` custom property, plus a grain canvas at 16% opacity.
- A text "decrypt" scramble on the wordmark, with a violet scrambling state
  resolving to near-white.
- A dithered canvas behind the Kríos mark, radially masked so it fades out.
- A chromatic glitch hover on the `krios.ie` link (red and cyan text shadows at
  plus and minus 5px).
- A metaball canvas behind the contact section at 62% opacity, radially masked.
- Hairline rules (`--rule`) separating stage blocks and person captions.

The canvases are produced by a `paper-shader` library (`data-paper-shader`
attributes with `contain: strict` canvases at `z-index: -1`).

---

## 2. Current typography

| Role | Family | Details |
| --- | --- | --- |
| Display | **Anybody** (variable) | Self-hosted `/fonts/anybody-latin.woff2`, weight axis 400 to 900, width axis 75% to 125%, `font-display: swap`, preloaded because the wordmark is the LCP element |
| Mono | **Martian Mono** (variable) | Self-hosted `/fonts/martian-mono-latin.woff2`, weight 400 to 600 |

Scale and treatment as shipped:

- `h1`: `clamp(2.75rem, 9vw, 6rem)`, `wdth 112 / wght 800`, tracking `-0.025em`,
  line-height `1.06`
- `h2`: `clamp(1.75rem, 4.2vw, 2.75rem)`, `wdth 100 / wght 700`
- `h3`: `1.25rem`, `wdth 100 / wght 600`
- Body: `1.0625rem`, line-height `1.65`, max width `68ch`
- Statement line: `clamp(1.9rem, 5.4vw, 3.5rem)`, `wdth 96 / wght 700`, `22ch`
- Mono role: `0.75rem`, tracking `0.08em`, used for the footer readout, footer
  links and the project link
- Email: `clamp(1.25rem, 4.4vw, 2.75rem)`, `wdth 92 / wght 700`

The variable width axis is used deliberately and differently per level (112, 100,
96, 92). That is the single most distinctive typographic decision on the site.

---

## 3. Current colours

Declared as custom properties on `:root`:

| Token | Value | Use |
| --- | --- | --- |
| `--horizon` | `#000000` | Page background, also `theme-color` |
| `--dust` | `#0a0910` | Declared; no use found in the shipped CSS |
| `--deep` | `#2e1a63` | Declared; no use found in the shipped CSS |
| `--violet` | `#8b5fff` | Focus rings, wordmark scrambling state, hover accents |
| `--lilac` | `#c9b6ff` | Stage headings, hover text, rule colour source |
| `--halo` | `#f5f3f9` | Primary text |
| `--muted` | `#8a86a0` | Secondary text |
| `--ash` | `#6b6779` | Readout labels |
| `--rule` | `#c9b6ff26` | Hairlines (15% lilac) |
| `--rule-strong` | `#c9b6ff52` | Hairlines on hover (32% lilac) |

Outside the token set: `#120F17` on the glitch pseudo-elements, and literal
`red` / `cyan` shadows on the project link hover. The field gradients are
generated in HSL from `--field-hue: 252` with lightness between 10% and 15%.

Effectively: black, one violet family, one off-white, two greys. `--dust` and
`--deep` are dead tokens.

---

## 4. Current positioning

Stated, not implied:

- A software company in Ireland.
- Builds its own software rather than client work.
- Runs and hosts what it builds.
- Keeps its products rather than selling them on.
- One product so far, Kríos, presented as "the first".

The positioning is **ownership and permanence**. The footer readout (company
number, incorporation date, jurisdiction, product count) reinforces it by
treating the company as a durable legal entity rather than a launch.

---

## 5. Current product presentation

There is one product block, and it contains no product information.

`Our projects` contains a single link to `https://krios.ie` consisting of:

- a dithered canvas backdrop, radially masked to fade at the edges
- `/img/krios-k.webp`, a 140x140 mark, scaled `clamp(88px, 13vw, 140px)`
- the text `krios.ie` with a chromatic glitch on hover
- a hover state that raises the dither opacity to 1 and scales the mark 1.04

There is no description of what Kríos is, no screenshot, no category, no status.
The footer says `PRODUCTS: 1`. The meta description says "Kríos is the first".
A visitor leaves the page not knowing what the product does.

---

## 6. The Plant / Grow / Bloom concept

**Not present on the live site.** No occurrence of "Plant", "Grow" or "Bloom"
exists in the rendered DOM, the copy, the stylesheet, the metadata or the
structured data.

The live site's three-part concept is **Build / Run / Hold**:

| Stage | Copy |
| --- | --- |
| Build | We design and build our products in-house, start to finish. |
| Run | We host them, support them and keep them running. |
| Hold | We build products to keep, not to sell on. |

They are rendered as three equal columns (`repeat(auto-fit, minmax(240px, 1fr))`)
with a top hairline, a lilac `h3` and one muted sentence each, revealed on scroll
with a 90ms stagger.

If Plant / Grow / Bloom exists, it is internal or unreleased, and this project
has not been given it. **It is not invented here.** Before any step treats
Plant / Grow / Bloom as the site's concept, someone at Heloria needs to supply
it, together with whether it replaces Build / Run / Hold or sits alongside it.
Note that the two triads are not equivalent: Build / Run / Hold describes what
the company does with software it owns, while a Plant / Grow / Bloom triad would
describe an organic growth arc. Swapping one for the other is a positioning
change, not a rename.

---

## 7. Current Kríos presentation

Covered in section 5 as product presentation. As brand presentation:

- Kríos is given the site's only bespoke imagery (the `K` mark).
- It is the only outbound product link, appearing twice (project tile, footer).
- It is treated as a destination, not a case study: the tile is a door.
- The visual language around it (dither plus chromatic glitch) is the most
  aggressive moment on an otherwise restrained page, and is the sharpest
  stylistic break from the institutional tone elsewhere.
- The accented "í" is carried correctly in the footer link and the ARIA label.

---

## 8. Current navigation

There is effectively none.

- No header, no menu, no logo link, no persistent chrome of any kind.
- A `Skip to content` link for keyboard users, pointing at `#main`.
- Section ids exist (`#work`, `#projects`, `#people`, `#contact`) but nothing on
  the page links to them.
- Footer links: `Kríos` (external) and `Contact` (mailto).
- `scroll-behavior: smooth` on `html`, so the ids anticipate in-page links that
  were never added.

Navigation is native scroll, top to bottom, one page.

---

## 9. Current content inventory

| Item | Value |
| --- | --- |
| Entity | Heloria Labs Limited |
| Company number | 821585 |
| Structured-data identifier | IE-CRO-821585 |
| Incorporated | 2026-07-21 |
| Jurisdiction | Ireland (`addressCountry: IE`) |
| Products | 1 |
| Contact | contact@helorialabs.com |
| Product | Kríos, https://krios.ie |
| Person | Michael Sweeney Heffernan (LinkedIn) |
| Person | Ahroon Santhosh (LinkedIn) |
| Person | Abraham Sabu Kurian (LinkedIn) |

Images: `/img/krios-k.webp`; `/img/michael.webp`, `/img/ahroon.webp`,
`/img/abraham.webp`, each with a 380w variant and a 640w default, declared
420x560, `loading="lazy"`, `decoding="async"`, rendered at aspect 3/4 with a
grayscale-and-contrast filter that partly lifts on hover. Also `/favicon.svg`
and `/img/og.png`.

Implementation: a React app (`<div id="root">`) with Tailwind v4 utilities
alongside a hand-written stylesheet, built by Vite, using a `paper-shader`
library for the three canvas effects.

Accessibility present and working: skip link, `sr-only` text behind every
animated heading, real `aria-label`s on each link, visible focus rings, and a
full `prefers-reduced-motion: reduce` block that collapses animation to 0.001ms.

---

## 10. Current weaknesses

1. **The product is invisible.** The one thing the company makes is presented as
   a logo and a domain name. No explanation, no evidence, no screenshot.
2. **Three unrelated effect idioms.** Decrypt scramble, dithering and chromatic
   glitch belong to three different visual traditions, and none of them belongs
   to "we build products to keep". The effects are borrowed, not derived.
3. **The glitch contradicts the positioning.** Red and cyan fringing signals
   instability and malfunction on a site whose argument is durability.
4. **Violet on black is the default dark-tech palette.** Nothing in it is
   Heloria specific, and it is the palette a generator would produce.
5. **Decorative canvases without purpose.** Grain, dither and metaballs are
   wallpaper. Under the project's own anti-pattern rules they would each have to
   justify their existence, and currently none of them can.
6. **Dead tokens.** `--dust` and `--deep` are declared and unused, which is a
   sign the palette was assembled rather than designed.
7. **No depth.** The site is flat layers with opacity. There is no material, no
   light, no spatial idea, and therefore nothing at the benchmark's level.
8. **Navigation anticipated but absent.** Section ids and smooth scrolling exist
   with nothing pointing at them.
9. **No sound, no loading experience, no progression.** The page simply appears.
10. **Stack conflict.** React plus Tailwind plus a third-party shader library is
    the opposite of this project's constraints (direct Three.js, no React, no UI
    framework). The current site cannot be extended into the new one; it is a
    source of content and intent only.
11. **People are undescribed.** Three photos and three names, with no roles.
12. **Hero does nothing.** A wordmark and one line occupy a full viewport with a
    scramble effect as its only event.

---

## 11. Information that must be preserved

These are facts and commitments. They carry forward unchanged.

- Entity name, company number 821585, incorporation date 2026-07-21,
  jurisdiction Ireland.
- The contact address contact@helorialabs.com as the only contact route.
- Kríos as the first product, spelled with the accent, linking to krios.ie.
- The three team members' names, and their LinkedIn links.
- The core claims: builds its own software, runs it itself, holds it long term,
  based in Ireland.
- The Build / Run / Hold triad's *meaning*, whatever form it later takes.
- The restrained, factual voice. No marketing vocabulary.
- The accessibility floor: skip link, accessible names behind animated text,
  visible focus, and full `prefers-reduced-motion` support.
- Self-hosted fonts, preloaded for the LCP element.

---

## 12. Information that can be redesigned

- The entire visual system: palette, layout, composition, imagery.
- All three canvas effects, which carry no information.
- The scramble, dither and glitch treatments.
- The page structure and section order.
- The footer readout's presentation, though not its facts.
- The person photos' treatment and framing.
- Navigation, which barely exists.
- The typographic scale, though the typeface choice is a separate decision
  requiring sign-off (see below).
- Every line of implementation. None of it is reusable under the new stack.

---

## WHAT MUST STAY

- **The facts.** Heloria Labs Limited, 821585, incorporated 2026-07-21, Ireland,
  contact@helorialabs.com, Kríos at krios.ie, and the three named people.
- **The argument.** Build it ourselves, run it ourselves, hold it. Ownership and
  permanence, stated plainly.
- **The voice.** Short, factual, unembellished. No adjectives doing sales work.
- **The restraint.** A near-monochrome, high-contrast page with very few
  elements is correct for this company, and must survive the addition of WebGL.
- **The accessibility floor**, including reduced motion and accessible names
  behind any animated or canvas-rendered text.
- **Self-hosted, preloaded typography**, and the deliberate use of a variable
  width axis, which is the one genuinely distinctive thing the current design
  does. The specific typefaces are a brand decision for Heloria to confirm.

## WHAT SHOULD CHANGE

- **Kríos must be explained.** The product needs presence: what it is, who it is
  for, what it looks like. A logo and a domain is not a product presentation.
- **The palette must become Heloria's.** Violet-on-black is generic. The colour
  system needs to derive from something real to this company, and the dead
  tokens must go.
- **The effect idioms must go or earn their place.** Glitch in particular
  contradicts the positioning and should not survive.
- **People need roles**, so the team reads as a company rather than a gallery.
- **Navigation must exist**, in whatever form the new experience takes, and the
  orphaned ids and smooth-scroll behaviour resolved.
- **The stack must be replaced entirely.** React, Tailwind and the third-party
  shader library are out by project rule. Content and intent carry over; code
  does not.

## WHAT SHOULD BE REIMAGINED

- **The hero.** Currently a wordmark in dead space. It is the site's one chance
  to demonstrate that this company builds things properly, and it should be the
  most engineered moment on the page.
- **Build / Run / Hold.** The strongest idea on the site and the weakest
  execution: three columns of small text. It deserves to be the spine of the
  experience rather than a row of cards. (And if Plant / Grow / Bloom is the
  intended replacement, that decision has to come from Heloria first. This
  document does not assume it.)
- **The footer readout.** Presenting the company as a public record is a genuine
  and unusual idea, currently buried at 11px. The idea is worth promoting; the
  execution is not.
- **The relationship between Heloria and Kríos.** Right now Kríos is a door out
  of the site. If Heloria is a company that holds what it builds, the site
  should hold the product inside it, not hand the visitor to another domain
  within two seconds.
- **Loading, progression and sound.** Absent today, and all three are core
  benchmark categories. They should be designed, not bolted on.
