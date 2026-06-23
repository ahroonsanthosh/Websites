# Your photos go here

The site currently uses tasteful stock placeholders (loaded from Unsplash) so it
looks finished out of the box. Swap in your own Buttermilk photos like this:

## 1. Drop your images in this folder
Recommended files (any high-quality JPG/WebP works):

| File          | Used for                  | Suggested size        |
|---------------|---------------------------|-----------------------|
| `hero.jpg`    | Full-screen hero banner   | 2000×1200 (landscape) |
| `about.jpg`   | The "Our Story" photo     | 1200×1500 (portrait)  |
| `gallery-1.jpg` … `gallery-6.jpg` | The gallery grid | ~900×900          |

Tip: keep each image under ~400 KB for fast loading. Export as **WebP** if you can.

## 2. Point the HTML at them
Open `index.html` and look for the comments that say `SWAP:`.
Replace each Unsplash URL with your local file, e.g.

```html
<!-- before -->
<img src="https://images.unsplash.com/photo-...." alt="..." />

<!-- after -->
<img src="assets/img/hero.jpg" alt="A bright brunch table at Buttermilk" />
```

Do the same for `about.jpg` and the six gallery images.
Keep the descriptive `alt` text accurate — it helps Google and screen readers.

## Logo
Your logo badge is recreated in CSS as the rotating "Good Food · Good Times" mark,
so no image file is required. If you'd prefer to use the original logo PNG,
drop it here as `logo.png` and let me know — I'll wire it in.
