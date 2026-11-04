# Brenner Abroad — project brief for Claude Code

This repository is the public trip page at **https://brenner.fun**, hosted on GitHub Pages from the `main` branch (root). Pushing to `main` deploys; the Pages CDN takes up to ~10 minutes to refresh.

## What is here

- `index.html` — the whole page: CSS, markup and script in one file. No build step. Edit it directly.
- `photos/` — 25 JPEGs used by the page. All are from Wikimedia Commons under CC licences except `shanghai-skyline.jpg` (CC0). Credits live in the `PHOTOS` object in the script and are printed as one small line in the footer.
- `CNAME` — the custom domain. Do not delete it.
- `.nojekyll` — tells GitHub Pages to serve the files as they are.

## Page structure (top to bottom)

1. **Hero**: a slow crossfade of five city photos (`SLIDES` in the script: Narita, Shanghai, Xi'an, Beijing, Tokyo), the title "Brenner Abroad", a small split-flap departures board (`LEGS`, three columns: month, day, from, to — city names only, no times, no carriers, no booking status), and a handwritten note on lined paper (`#intro`, the text sits between `<!--intro-->` and `<!--/intro-->` comments). The board flips in when it scrolls into view and re-flips once a minute.
2. **Stop cards**: one poster card per stop from the `STOPS` array (kanji ghosted over the photo, city name and dates, a round "+" button). Cards stack as you scroll. Tapping one opens the detail panel (`openDetail`): the lede, a section titled **"Cool stuff"** with photo cards for the sights, then one plain line about where I'm staying.
3. **Footer**: the photo credits.

The script still carries data and code for sections that are currently switched off (a route map with "Where is Brenner now?", day-by-day plans, city maps, a photo viewer). They can come back later; leave them alone unless asked.

## Rules the owner has set

- **Voice**: all text reads as Brenner telling friends and family what he's excited about — first person, casual, specific. Never brochure or sales language, no superlatives.
- **Public audience**: no prices, no hotel addresses or room details, no booking references, no passport details, no planning to-dos. Hotel names and neighbourhoods are fine. Only confirmed plans appear; ideas are not shown as plans.
- No "Must-do / Maybe / Book ahead" labels, no "Stop n of 5", no night counts on the cards.
- Do not add Hangzhou, Suzhou, Qingdao or Chengdu.
- Keep motion gentle and respect `prefers-reduced-motion` (the page already does: flips, slideshow and reveals all stop under it).
- The page is shared mostly on phones: check changes at ~375px width.
- Any new photo needs a licence that allows reuse, and a credit unless it is public domain. Keep files under ~700 KB (resize to ~2400px wide).

## How to update

1. Edit `index.html` (and add any new photo under `photos/`).
2. Check it locally in a browser.
3. Commit and push to `main`. The site updates within a minute or two.

Commit as `Brenner Danielson <info@grassrootinstitute.org>` if no git identity is configured.

## Private material

Planning notes, budgets and the earlier full version of the page with maps and day-by-day are kept outside this public repository, on the owner's Mac in the `2026 Trip` folder. Ask the owner if they are needed.
