# Dexetera landing: add the hero disaster image layer (keep the lightning)

The installer copied the 5 images to `public/assets/dx-*.webp` and the code into `design/hero-disasters/`. Change ONLY the home page hero. Do not touch the lightning, rocks, copy, buttons, dashboard, header or any other section. No em dashes in copy.

## What it is
Every 10 to 14 seconds one photographic storm (tornado, hurricane, wind, wildfire, storm surge) fades in at the side of the hero, moves slowly, and fades out (2.5s in, 4 to 6s hold, 3s out). Never the same image twice in a row. It sits behind the headline, rocks and dashboard and never overlaps the headline, subcopy or buttons. Dark mode uses `mix-blend-mode: screen`; light mode uses multiply + invert at 50% opacity (it watches `html[data-theme]`). Hidden for prefers-reduced-motion, paused when the tab is hidden. The existing lightning canvas keeps striking on its own the whole time.

## Steps
1. Copy `design/hero-disasters/drop-in/dxDisasters.js` and `HeroDisasters.tsx` into the folder that holds the hero component (e.g. `components/landing/`). Keep them together. If TypeScript complains about the JS import, keep the `// @ts-ignore` line or set `allowJs`.
2. In the hero, find the overflow-hidden stage wrapper inside `<div id="top" data-screen-label="Hero">` (the element that contains the grain overlay, the lightning `<canvas>` wrapper, the copy block with the h1, the rocks and the dashboard). Render `<HeroDisasters />` inside that stage, directly BEFORE the lightning canvas wrapper, so the order is: grain, HeroDisasters, lightning canvas, copy (z-index 1), rocks, dashboard.
3. Add these data attributes so the layer measures the right elements (it auto-detects if missing, but be explicit):
   - `data-hero-copy` on the copy block that contains the h1, subcopy and buttons.
   - `data-hero-dash` on the dashboard preview wrapper below the buttons.
   - `data-hero-rock` on the left rock element.
4. The header height is 84px (default `top={84}`). If the header height differs, pass the real value.
5. Images load from `/assets/dx-<name>.webp` (default `base="/assets/dx-"`). If the site serves assets elsewhere, pass `base`.

## Must match
- Reference screenshots: `design/hero-disasters/reference/<width>_<theme>_<event>.jpg` at 1440, 1280, 768, 390 in dark, plus 1440 light. These were taken by running this exact code on the live www.dexetera.org hero.
- Verified: at 1440, 1280 and 768 no image overlaps the headline, subcopy or buttons; storms sit in the side areas from below the header down to the dashboard. Under 640px images are 60% size, two thirds opacity, and masked to the strip above the headline.
- Sizes and max opacity (already in the code, do not change): tornado 270x400 at 0.6, hurricane 480x480 at 0.35, wind 700x460 at 0.45, wildfire 270x400 at 0.55, surge 440x290 at 0.32.
- Original design logic for reference: `design/hero-disasters/design_source_startDz.js`. Full-resolution PNGs: `design/hero-disasters/images-original/`.

## When done
- Build and fix any type or lint errors. No console errors.
- Check the home page at 390, 768, 1280, 1440 in dark and light for about 40 seconds each: storms appear at the sides, lightning still strikes, nothing covers the headline, no horizontal scroll.
- Commit "Hero disaster image layer" and push to the branch Vercel deploys from. Reply with files changed and the commit hash.
