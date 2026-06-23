# Your photos go here

The site is wired so that **each image first looks for your photo in this folder,
and automatically falls back to a stock image if the file isn't there yet.**
So nothing ever looks broken — the moment you add a correctly-named file, your
real photo appears with no code changes needed.

## Just drop these files in this folder

Save the photos you sent under these exact names:

| Filename         | Your photo                                             | Best shape    |
|------------------|--------------------------------------------------------|---------------|
| `hero.jpg`       | Pancakes with the syrup being poured (the hero shot)   | any           |
| `about.jpg`      | Smashed avocado on sourdough with poached egg          | portrait      |
| `gallery-1.jpg`  | Pancakes close-up                                       | square        |
| `gallery-2.jpg`  | Avocado toast (tall tile)                               | portrait/tall |
| `gallery-3.jpg`  | The salad bar bowls                                     | square        |
| `gallery-4.jpg`  | Sandwiches & quiches at the counter                    | square        |
| `gallery-5.jpg`  | A wide table / spread shot (wide tile)                  | landscape     |
| `gallery-6.jpg`  | Another salad / dish                                    | square        |

You only have 4 photos right now — that's fine. Name your four favourites and any
gallery slot you don't fill simply keeps a tasteful stock image. You can also
reuse the same photo under more than one name.

## Tips
- Keep each file under ~400 KB for fast loading. Export as **WebP** if you can
  (then use e.g. `hero.webp` and update the `src` in `index.html`).
- Landscape works best for `hero` and `gallery-5`; portrait suits `about` and
  `gallery-2`. The site crops them cleanly either way.

## Logo
Your logo badge is recreated in CSS as the rotating "Good Food · Good Times" mark,
so no image file is required. To use your original logo PNG instead, drop it here
as `logo.png` and let me know — I'll wire it in.
