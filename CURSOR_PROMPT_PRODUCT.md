# Cursor prompt: Product section exact match

Paste everything below the line into Cursor (Agent mode). Keep `design/product/` in the repo.

---

Rebuild the landing page Product section (`#product`, "A full exchange, live on mainnet.") so it is a pixel-exact match of the design. The current version is not exact. Treat the files in `design/product/` as the source of truth, not your own judgment.

Read these first, in order:
1. `design/product/PRODUCT_SECTION.md`: the full spec, measured sizes and acceptance checks.
2. `design/product/rendered/product_1440_dark.html`: the fully rendered markup with every inline style resolved. This is the primary build reference.
3. `design/product/product.logic.js`: verbatim logic (`appVals`, `candle`, `appTicker`, `bookRows`, `doTick`, constructor data).
4. `design/product/product.template.dc.html`: which values are data-driven (`{{ }}`, `sc-for`, `sc-if`).
5. `design/product/reference/`: screenshots at 7 widths, 2x detail crops, interaction states.
6. `design/tokens/theme.css`: all CSS variables for dark and light.

Before writing code, list the files you will create or change and the component tree. Then implement it without stopping for confirmation.

Requirements:

1. **Scaled fixed app, not a responsive layout.** The terminal is one absolutely positioned app, 803px tall. Measure the frame's inner width `cw` with a ResizeObserver. If `cw >= 1330`, the app is `width:100%` with no transform. Otherwise the app is `width:1280px; transform:scale(cw/1280); transform-origin:0 0` inside a clip box of `height: round(803*scale)px; overflow:hidden; position:relative`. Do not add breakpoints, flex-wrap or Tailwind responsive classes inside the app.
2. **Frame breakout.** `width: calc(100vw - 48px); max-width: 1680px; margin-left: 50%; transform: translateX(-50%)`, 1px `var(--line)` border, radius 12, `overflow:hidden`, bottom mask fade of 140px, 38px browser bar with three dots and the mono URL pill `dexetera.xyz/token/NINO34-DEC26`.
3. **Port the markup 1:1** from `rendered/product_1440_dark.html` into `components/landing/ProductSection.tsx` (client component). Keep exact px values, font sizes, weights, letter spacing, borders and radii. Use the CSS variables as written (`var(--card)`, `var(--ln)`, `var(--t-soft)`, etc.), so light mode works automatically. Drop `data-dc-tpl` attributes. Use the main grid as specified: `left:56px; right:4px; top:242px; grid-template-columns: minmax(0,2.2fr) minmax(0,1fr) 320px; grid-template-rows: 318px 240px; gap: 3px 5px`.
4. **Fonts.** Manrope for UI text, JetBrains Mono wherever the source uses it (prices, ticker, stats, book, URL pill). No Tailwind text-size substitutions.
5. **Icons.** Replace each masked `lucide-static` icon with the same-named `lucide-react` icon at the same pixel size and color (`currentColor`). The list is in the spec.
6. **Chart.** Port `candle()` as a pure TypeScript function that returns the same SVG: height 240, 72px axis, levels 5,500 to 3,500, range 2,850 to 5,800, dashed reference line at 3,000 labelled "Neutral (0.0 °C)", volume bars, green last-price tag. Copy the hard-coded NINO34 OHLCV array from the constructor exactly. Hover updates the OHLC legend.
7. **Order book, trades, positions.** Same rows, values, colors and depth bars as the rendered file. Asks red above the spread row "$20.00 · 0.37%", bids green below, "9 orders" counts.
8. **Live behaviour** (port `doTick`): every 1500ms, the last candle close moves by $10 within 5,380 to 5,430, a trade is prepended (keep 14), one random book row flashes for 450ms, and the UTC clock updates. Skip the interval when `prefers-reduced-motion` is set and pause it when the section is off screen (IntersectionObserver).
9. **Ticker.** Duplicate the items and animate `@keyframes dx-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }` at 70s linear infinite.
10. **Interactions (local state only, nothing submits):** BOOK/TRADES, Margin Used/Reserved/Available, Market/Limit, Long/Short, size input (digits, comma, dot, max 12 chars), quick amounts add to the size, Max sets 24.58, and the Positions / Open Orders / Trade History / Order History tabs. "Enable Trading" links to https://dexetera.xyz/token/NINO34-DEC26.
11. **Below the frame:** three numbered callouts (3 columns from 900px, 1 below) and the five-feature strip (5 columns from 900px, 1 below) with icons activity, wallet, zap, shield-check, sparkles.
12. **Assets:** copy `design/source/assets/nino34-icon.svg` and `dexetera-logo.png` into `public/assets/`.
13. **One intentional fix:** add `white-space: nowrap` to the white callout pills inside the terminal so "3 Source + UMA settlement" stays on one line. Everything else must be replicated, not improved.

Copy rules: no em dashes, USD only, never use "regulated", "licensed" or "compliant".

Acceptance (check each one and report the numbers):
- Section height: 1290px at 1920, 1680 and 1440; 1259 at 1280; 1119 at 1024; 1521 at 768; 1406 at 390 (within a few px).
- Frame width: 1392 at 1440, 1232 at 1280, 976 at 1024, 720 at 768, 342 at 390. Inner scale: 0.9609, 0.7609, 0.5609 and 0.2656 at 1280, 1024, 768 and 390.
- At 1440, compare side by side with `design/product/product.preview_dark.html` and `product.preview_light.html` (serve the repo root and open them over http). There should be no differences except live values and ticker position.
- Matches `reference/detail_*.png` for type, icon size, borders and radii, and `reference/state_*.jpg` for each interaction state.
- No horizontal scroll at 390px. Both themes are correct.

When done, list any place where you could not match the reference exactly and why.
