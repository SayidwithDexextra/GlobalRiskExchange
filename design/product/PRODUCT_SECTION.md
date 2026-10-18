# Product section (`#product`): exact rebuild spec

"A full exchange, live on mainnet." The section is a mock of the real token page for **NINO34-DEC26** inside a browser frame, plus three numbered callouts and a five-feature strip. Exported from Claude Design on 18 Oct 2026 (latest version, after the Market wall, Problem and Example compaction).

## The one thing that makes it match

The terminal is **one fixed-layout app, 803px tall**, built with absolute positioning. It is never reflowed for smaller screens; it is **scaled**:

```ts
// container = the bordered frame under the browser bar
const cw = frameInnerWidth;                 // = min(1680, viewportW - 48) - 2 (1px borders)
const D  = cw >= 1330;                      // "desktop": inner app is fluid width, no scale
const sc = D ? 1 : Math.min(1, cw / 1280);
// inner app: position:absolute; left:0; top:0; height:803px; transform-origin:0 0
//   width:     D ? '100%'   : '1280px'
//   transform: D ? 'none'   : `scale(${sc})`
// clip box around it: position:relative; overflow:hidden; height: Math.round(803*sc)px
```

Measure `cw` with a ResizeObserver on the frame (the source reads `clientWidth` on resize). Build every panel inside the 803px app at the pixel values in the source and **do not add responsive classes inside it**. That alone guarantees the 1024, 768 and 390 layouts match, because they are the same picture scaled.

The frame itself breaks out of the 1344px container: `width: calc(100vw - 48px); max-width: 1680px; margin-left: 50%; transform: translateX(-50%)`, border 1px `--line`, radius 12, `overflow:hidden`, background `--bg`, and a bottom fade `mask-image: linear-gradient(to bottom, #000 calc(100% - 140px), transparent)`. On top sits the 38px browser bar (three 10px dots in `--line2`, centered mono 11px URL pill `dexetera.xyz/token/NINO34-DEC26`).

## Files in this folder

| File | What it is |
|---|---|
| `rendered/product_1440_dark.html`, `_light.html` | **Primary build reference.** The fully rendered section at 1440 wide: every inline style already resolved, the candlestick chart as final SVG, every book row and position row. Port this markup to JSX; the numbers are the spec. (`data-dc-tpl` attributes are build artifacts, drop them.) |
| `product.template.dc.html` | The source template with `{{ }}` bindings, `sc-for` loops and `sc-if` conditions: shows which parts are data-driven and which are static. |
| `product.logic.js` | Verbatim logic: `appVals()` (all values, tabs, book, positions, scaling), `candle()` (chart SVG builder), `appTicker()`, `bookRows()`, `doTick()` (live updates), the constructor (hard-coded NINO34 candles, seeded trades, initial state) and helpers. |
| `product.preview_dark.html`, `_light.html` | Static offline preview built from the rendered markup. Verified identical to the live design (same 1290px height). Serve `design/` and open `/design/product/product.preview_dark.html`. |
| `measurements.json` | Section, frame and inner-app boxes plus panel boxes at 1920, 1680, 1440, 1280, 1024, 768, 390. |
| `reference/product_{width}_{theme}.jpg` | Full-width screenshots of the section at each width. |
| `reference/detail_*.png` | 2x close-ups at 1440 dark: window/header/ticker/market header, chart, positions, order book, trade ticket, callouts + features. Use these for type, icon and spacing checks. |
| `reference/state_*.jpg` | 2x interaction states: Trades tab, Limit tab, Short side, Open Orders tab. |

## Measured sizes

| Viewport | Section height | Frame (w x h) | Inner app transform | Page scrollWidth |
|---|---:|---|---|---:|
| 1920 dark | 1290 | 1680 x 843 | none (fluid) | 1920 |
| 1680 dark | 1290 | 1632 x 843 | none (fluid) | 1680 |
| 1440 dark | 1290 | 1392 x 843 | none (fluid) | 1440 |
| 1440 light | 1290 | 1392 x 843 | none (fluid) | 1440 |
| 1280 dark | 1259 | 1232 x 812 | matrix(0.9609, 0, 0, 0.9609, 0, 0) | 1280 |
| 1024 dark | 1119 | 976 x 651 | matrix(0.7609, 0, 0, 0.7609, 0, 0) | 1024 |
| 768 dark | 1521 | 720 x 490 | matrix(0.5609, 0, 0, 0.5609, 0, 0) | 768 |
| 390 dark | 1406 | 342 x 253 | matrix(0.2656, 0, 0, 0.2656, 0, 0) | 390 |
| 390 light | 1406 | 342 x 253 | matrix(0.2656, 0, 0, 0.2656, 0, 0) | 390 |

## Layout inside the 803px app (1440 wide, inner width 1390)

| Area | Position (inside the app) | Notes |
|---|---|---|
| Left rail | left 0, top 0, width 52, full height, `--card`, right hairline | user avatar tile (32px, radius 8) at top 14, then 18px icons at top 79, 122, 167... (layout-grid, compass, bookmark, signal, lightbulb, settings) in `--t3` |
| App header | left 52, right 0, height 56, bottom hairline | logo 36px radius 8 + Georgia "DEXETERA"; search field 30px tall (`--card3`, `--line2`, max 463px); Portfolio $90.10, Available Cash $24.58 (green dot), Unrealized P&L +$24.74; blue Deposit button; bell; "Demo view" pill; avatar ring + "Trader" |
| Ticker | top 56, height 46, bottom hairline | mono 12px; items: name `--t-soft`, price `--t1`, change green/red; 24px side padding per item; list duplicated and animated `dx-ticker 70s linear infinite` (translateX 0 to -50%) |
| Market header | top 102, height 138, `--card` | NINO34 icon (`nino34-icon.svg`), "Niño 3.4" + verified badge, mono "NINO34-DEC26"; amber "Settles Dec 31, 2026" chip; tag chips Climate, Weather, Index, +3; two address chips with copy icons; WATCHING 0; star and purple Share buttons. Stats row (mono 11px labels `--t3`, values 600 weight): MARK, LAST, 24H CHG, 24H HIGH, 24H LOW, BID (green), ASK (red), SPREAD, VOLUME $184K, TRADES 1,412. Description line and "More" button |
| Main grid | left 56, right 4, top 242; `grid-template-columns: minmax(0,2.2fr) minmax(0,1fr) 320px; grid-template-rows: 318px 240px; gap: 3px 5px` | panels: radius 6, border 1px `--ln`, background `--card` |
| Chart (row 1, col 1) | | toolbar (search NINO34, +, 1D, candles icon, fx Indicators, undo/redo, history, hexagon, maximize, camera); drawing tool column; title "NINO34-DEC26 (NOAA CPC) · 1D · ORDERBOOK" with live dot; OHLC legend; "Live Metric Tracker (1) NINO34"; candles from `candle()` height 240, axis 72px, levels 5,500 to 3,500, range 2,850 to 5,800, dashed reference at 3,000 "Neutral (0.0 °C)", volume bars; green last-price tag; footer 5y 1y 3m 1m 5d 1d, calendar, UTC clock (updates), %, log, auto |
| Positions (row 2, col 1) | | tabs Positions 5, Open Orders 12, Trade History 0, Order History 50 (count badges) + Live dot; table SYMBOL, SIDE, SIZE, ENTRY, MARK, PNL, LIQ PRICE; rows Niño 3.4 (12 @ $4,620.00), Niño 1+2 (5), Average egg price (4.2); other tabs show "Open the app to view ..." or "No ... yet" |
| Order book (rows 1-2, col 2) | | BOOK / TRADES segmented tabs; "Order Book"; PRICE, SIZE, TOTAL (USD); 9 asks (red) above, ASKS (SELL) 9 orders, spread row "$20.00 · 0.37%", BIDS (BUY) 9 orders, 9 bids (green); depth bars proportional to cumulative size; a random row flashes `color-mix(in srgb, var(--t1) 5%, transparent)` for 450ms each tick |
| Right column (col 3) | | "Metric Source" card with red dot and `cpc.ncep.noaa.gov` link; Token Information card (ACTIVE, Niño 3.4, tabs Margin Used / Reserved / Available); Current Price card (LIVE, USDC, $5,410.00, change, Margin Used 31.1900); Trade ticket: Market / Limit tabs, Long (selected: emerald tint, green border, arrow) / Short, POSITION SIZE with USD toggle, $ input (placeholder 1,000.00, right aligned mono), QUICK AMOUNTS +$100 +$500 +$1K +$5K Max (Max is blue), Slippage 1%, blue "Enable Trading" 42px button linking to https://dexetera.xyz/token/NINO34-DEC26 |
| Callout pills | white pills with black number dots: "1 Live order book" (over the book), "2 Gasless, one signature" (over the ticket), "3 Source + UMA settlement" (over Metric Source) | they match the numbered callouts below the frame |

Below the frame: three numbered callouts (grid `repeat(3,1fr)` from 900px, one column below; 20px numbered dots in `--btn-p-bg`), then the five-feature strip (grid `repeat(5,1fr)` from 900px, one column below; card `--card`, border `--line`, radius 12; 18px Lucide icons masked in `--t-gray`: activity, wallet, zap, shield-check, sparkles).

Section header: eyebrow "THE PRODUCT" + green "LIVE TODAY" pill; h2 `clamp(30px,3.4vw,44px)` "A full exchange, live on mainnet."; paragraph 17px `--t3` max 560. Section padding `clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0`, `scroll-margin-top: 88px`.

## Data and live behaviour

- NINO34 candles are **hard-coded** in the constructor (OHLCV array ending at 5,310 / 5,430 / 5,310 / 5,400). Copy the array as-is. Last price shown is $5,410.00.
- Order book is built in `appVals` from fixed size arrays (asks 120, 85, 240, 60, 310, 180, 420, 95, 600; bids 150, 90, 260, 40, 380, 210, 500, 130, 560) at $10 steps from the last price. Deterministic.
- Every 1500ms (`doTick`, skipped with prefers-reduced-motion): last candle close moves ±$10, clamped 5,380 to 5,430; a new trade is prepended (keep 14); a random book row flashes; the clock updates. Pause the interval when the section is off screen.
- Interactions (all local state, nothing submits): BOOK/TRADES, Margin Used/Reserved/Available, Market/Limit, Long/Short, size input (digits, comma, dot; max 12 chars), quick amounts add to size, Max sets 24.58, position tabs, chart hover updates the OHLC legend (`btcHover`).
- Positions P&L for Niño 3.4 = 12 x (last - 4,620), formatted `+$9,480`, percent vs 4,620.

## Port rules

1. Build `components/landing/ProductSection.tsx` (client). Inner app = one absolutely positioned 1280px/fluid box exactly as above.
2. Copy markup and inline style values from `rendered/product_1440_dark.html`. Keep colors as the CSS variables they already use (`var(--card)`, `var(--ln)`, `var(--t-soft)`, `var(--emerald)`, etc.); all are defined in `design/tokens/theme.css` for both themes.
3. Fonts: Manrope for UI, JetBrains Mono for every number, ticker and label that uses it in the source. Do not substitute Tailwind font sizes; use the exact px values.
4. Icons: the source masks unpkg `lucide-static@0.460.0` SVGs (`-webkit-mask: url(...)`). Replace each with the same-named `lucide-react` icon at the same size and color (`currentColor`). Names used: align-justify, arrow-left-right, badge-check, bell, bookmark, brush, calendar, calendar-range, camera, chart-candlestick, chevron-down, chevron-left, chevron-up, circle, circle-plus, compass, copy, external-link, eye, gauge, hexagon, history, layout-grid, lightbulb, list, maximize, plus, redo-2, search, settings, share, signal, slash, spline, star, type, undo-2, user, wallet; features: activity, wallet, zap, shield-check, sparkles.
5. Chart: port `candle()` as a pure function that returns the same SVG (or paste the rendered SVG and drive only the last candle + price tag + legend from state).
6. Ticker: keyframes `dx-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`, 70s linear infinite, items duplicated.
7. Assets: `assets/dexetera-logo.png`, `assets/nino34-icon.svg` to `public/`.

## Fix on purpose

- Callout pill "3 Source + UMA settlement" wraps to two lines and is clipped at 1440. Add `white-space: nowrap` to the pills so it reads on one line. Everything else: replicate.
- Do not let the inner app reflow (no flex-wrap, no breakpoints inside it). Any difference at 1024 or below means scaling is wrong.

## Acceptance

- Section height: 1290 at 1440/1680/1920; 1259 at 1280; 1119 at 1024; 1521 at 768; 1406 at 390 (within a few px).
- Frame widths: 1392 at 1440, 1232 at 1280, 976 at 1024, 720 at 768, 342 at 390. Inner scale 0.9609 / 0.7609 / 0.5609 / 0.2656 at 1280 / 1024 / 768 / 390.
- Side-by-side with `product.preview_dark.html` and `_light.html` at 1440: no visible differences except live-moving values and the ticker position.
- Match `reference/detail_*.png` at 2x for type sizes, weights, icon sizes, borders and radii.
- Each interaction state matches `reference/state_*.jpg`.
- No horizontal scroll at 390.
