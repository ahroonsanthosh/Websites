# Websites

Consolidated monorepo. Each top-level folder is a formerly standalone GitHub repository, imported with `git subtree` so its full commit history is preserved (`git log -- <folder>` shows it).

## Projects

| Folder | Imported from branch | Stack | Former deploy |
| --- | --- | --- | --- |
| [`115`](115/) | `claude/cafe-website-cork-hpxcnt` | Static HTML |  |
| [`5points`](5points/) | `claude/5-points-cafe-website-jzvbhx` | Next.js | https://5points-lovat.vercel.app |
| [`balance`](balance/) | `main` | Static (build script) |  |
| [`bayou`](bayou/) | `claude/bayou-cafe-website-qc8vbd` | Next.js | https://bayou-puce.vercel.app |
| [`blondie`](blondie/) | `main` | Images only (the full site is on archived branch `claude/blondie-cafe-site-9h3db6`, see below) |  |
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

Some original repositories had branches that were never merged into the branch imported here. So that nothing was lost when those repositories were deleted, each one is kept reachable from this repository's history by the commit "Preserve unmerged branches from the original repositories" (a merge that records them as parents without changing any files). Their files sit at the root of each commit, as in the original repository, not inside the folder.

To look at one: `git log <commit>` or `git checkout <commit>`. To restore one as a branch: `git branch <name> <commit>`.

| Folder | Original branch | Commit |
| --- | --- | --- |
| `5points` | `claude/image-replacement-tp31pg` | `8174c161ba9a` |
| `Brightside` | `claude/bright-side-cafe-site-4s80jj` | `bc5d548d2c73` |
| `CoolBeans` | `gh-pages` | `c9546d132f4f` |
| `Hansum` | `claude/hansum-rotisserie-build-qwe6nt` | `e849962108d1` |
| `Somedose` | `claude/delete-repo-data-gxgz72` | `7b84882677ae` |
| `Somedose` | `claude/some-dose-coffee-site-vj2l61` | `73077aeb6ae5` |
| `Uncles` | `claude/site-review-g0rzhi` | `1277e6d6f24c` |
| `Web` | `claude/friendly-galileo-a07rzz` | `1675fde33ffe` |
| `Webs` | `main` | `e579a6c5490f` |
| `balance` | `claude/balance-cafe-site-k32mjc` | `1cf8b2e412df` |
| `bayou` | `claude/menu-text-conversion-4ezty5` | `bc840fee0261` |
| `blondie` | `claude/blondie-cafe-site-9h3db6` | `6d95bd25c687` |
| `chapelgate` | `claude/chapel-gate-cafe-site-931h7y` | `9a565d0f4cd0` |
| `hl` | `claude/project-thread-84klyx` | `71679cc2bfd6` |
| `loka` | `claude/current-site-review-7x55fb` | `d1d129408406` |
| `lough` | `claude/lough-cafe-website-7l84o4` | `358fc4f048ae` |
| `somedosev2` | `claude/some-dose-cafe-site-ofy1be` | `9233ea156396` |
| `velo` | `claude/cafe-velo-website-c42snx` | `8e7e04bb2f66` |

## Deploying a project

Each folder is self-contained. On Vercel or Netlify, point the project at this repository and set its **Root Directory** to the folder (for example `Hansum`).
