# Websites

Consolidated monorepo. Each top-level folder is a formerly standalone GitHub repository, imported with `git subtree` so its full commit history is preserved (`git log -- <folder>` shows it).

## Projects

| Folder | Imported from branch | Stack | Former deploy |
| --- | --- | --- | --- |
| [`115`](115/) | `claude/cafe-website-cork-hpxcnt` | Static HTML |  |
| [`5points`](5points/) | `claude/5-points-cafe-website-jzvbhx` | Next.js | https://5points-lovat.vercel.app |
| [`balance`](balance/) | `main` | Static (build script) |  |
| [`bayou`](bayou/) | `claude/bayou-cafe-website-qc8vbd` | Next.js | https://bayou-puce.vercel.app |
| [`blondie`](blondie/) | `main` | Images only (site build is on tag `archive/blondie/claude/blondie-cafe-site-9h3db6`) |  |
| [`Brightside`](Brightside/) | `main` | Next.js |  |
| [`cafejane`](cafejane/) | `claude/cafe-jane-website-nf0t7v` | Next.js | https://cafejane.vercel.app |
| [`chapelgate`](chapelgate/) | `main` | Static (build script) |  |
| [`COCOA`](COCOA/) | `claude/cafe-website-cork-hp1s4k` | Next.js | https://cocoa-rho.vercel.app |
| [`CoolBeans`](CoolBeans/) | `claude/cool-beans-coffee-site-jlhyxl` | Static HTML |  |
| [`db`](db/) | `claude/dulce-bun-house-site-p91bx6` | Vite | https://db-nine-theta.vercel.app |
| [`dragon`](dragon/) | `claude/jiu-jitsu-gym-cork-site-89hf35` | Static HTML |  |
| [`dulce`](dulce/) | `claude/dulce-bun-house-site-ie2gb3` | Next.js | https://dulce-pi.vercel.app |
| [`greenfrog`](greenfrog/) | `claude/awesome-cray-8a7ztw` | Static HTML |  |
| [`Hansum`](Hansum/) | `claude/current-site-review-ff5hk9` | Next.js | https://hansumwebsite.vercel.app |
| [`happydays`](happydays/) | `claude/happy-days-cafe-site-u1ql1w` | Next.js | https://happydays-rho.vercel.app |
| [`hl`](hl/) | `claude/loving-mayer-9cch99` | Vite |  |
| [`Kafto`](Kafto/) | `claude/kaftooooooooo-website-8xgbfl` | Static HTML |  |
| [`loka`](loka/) | `claude/b-egg-farm-review-y1lxom` | Next.js | https://loka-gamma.vercel.app |
| [`lough`](lough/) | `main` | Static HTML |  |
| [`madden`](madden/) | `claude/cafe-website-cork-t448nm` | Vite | https://madden-lake.vercel.app |
| [`morso`](morso/) | `main` | Static HTML |  |
| [`northsouth`](northsouth/) | `claude/northsouth-cafe-website-9abw5f` | Next.js | https://northsouth-omega.vercel.app |
| [`Paperboys`](Paperboys/) | `main` | Static HTML + Vercel API (CMS) | https://paperboys-kappa.vercel.app |
| [`Parkgate`](Parkgate/) | `claude/jolly-ride-340ky0` | Static HTML |  |
| [`rhd`](rhd/) | `claude/salon-cancellation-matching-mvp-k41jy4` | Next.js |  |
| [`Somedose`](Somedose/) | `main` | Next.js |  |
| [`somedosev2`](somedosev2/) | `main` | Astro |  |
| [`thegreenfrogcafe`](thegreenfrogcafe/) | `claude/great-fermi-9md8jy` | Static HTML |  |
| [`Uncles`](Uncles/) | `claude/rotisserie-deli-website-dxo9mp` | Next.js | https://uncles-orcin.vercel.app |
| [`velo`](velo/) | `main` | Static (build script) |  |
| [`Web`](Web/) | `claude/quirky-shannon-3yln1d` | Static HTML |  |
| [`Webs`](Webs/) | `claude/inspiring-franklin-hxbtpn` | Static HTML |  |
| [`Wild`](Wild/) | `claude/charming-bardeen-tiqwdq` | Static HTML |  |

The original repositories `Sanity` and `decaf` were empty (no commits), so they have no folder here.

## Archived branches

Work that lived on other branches of the original repositories and was never merged into the imported branch is kept as tags named `archive/<folder>/<branch>`. These tags contain the original repository's history, with files at the repository root (not inside the folder).

```bash
git fetch --tags
git tag -l 'archive/*'
git log archive/bayou/claude/menu-text-conversion-4ezty5
git checkout archive/bayou/claude/menu-text-conversion-4ezty5   # inspect it
```

## Deploying a project

Each folder is self-contained. On Vercel or Netlify, point the project at this repository and set its **Root Directory** to the folder (for example `Hansum`).
