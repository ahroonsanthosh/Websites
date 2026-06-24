# Photos

The café's real photos are wired in. Each `<img>` loads from this folder and
silently falls back to a stock placeholder if a file is ever missing, so the
site never looks broken.

Current mapping (all `.webp`):

| Filename          | Where it appears                | Current photo                          |
|-------------------|---------------------------------|----------------------------------------|
| `hero.webp`       | Full-screen hero background     | Branch chandelier + teal Wild cup      |
| `story-1.webp`    | "Our story" — large image       | Wild cup at the counter                |
| `story-2.webp`    | "Our story" — small inset       | Leaf latte art                         |
| `gallery-1.webp`  | Gallery (1 of 4)                | Very Vegan salad bowl                  |
| `gallery-2.webp`  | Gallery (2 of 4)                | House porridge bowl                    |
| `gallery-3.webp`  | Gallery (3 of 4)                | Pancakes on a teal plate               |
| `gallery-4.webp`  | Gallery (4 of 4)                | Pancakes + iced coffee                 |

To swap any photo, just overwrite the file with the same name (keep `.webp`, or
update the matching `src` in `index.html` if you change the extension).

## Tips
- **.jpg** is assumed. If you only have `.png`, either rename to `.jpg` (usually
  fine) or update the matching `src` in `index.html`.
- Aim for photos **under ~400 KB each** so the site stays fast on phones. Free
  tools like squoosh.app or tinypng.com compress without visible quality loss.
- Great shots to use: the teal storefront on The Mall, the white branch
  chandelier, latte in a Wild cup, a full breakfast plate, the seafood chowder.
- For the best hero, pick a bright, wide photo with some empty space on the left
  (that's where the headline sits).
