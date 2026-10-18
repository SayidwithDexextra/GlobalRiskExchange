# "Who it's for" section: spec

Source of truth: `design/source/Dexetera Landing v2.dc.html`, the block with `data-screen-label="Who it's for"` (Claude Design export, 18 Oct 2026). The section sits on the landing page between the Problem section and the Product section.

## Status

- The design is correct on mobile. Rendered at 360, 390 and 430, every chart stays inside its card and nothing overflows.
- The overflow and misplacement the user saw come from the Next.js implementation, not the design.

## Drop-in (verified)

`drop-in/WhoItsFor.tsx` + `drop-in/who.css` were built in a real Next.js 14 app and measured against the design at 360, 390, 430, 640, 768, 900, 1024 and 1440 (dark and light at 390 and 1440). The section height, the position and size of every card, and the position and size of every chart are identical to the design at every width. The chart paths are the design's own, copied exactly.

One deliberate change: the chart legends used dash characters as line symbols. They are now small drawn line swatches (solid, dashed, filled box) that look the same, which keeps the copy free of dashes.

## Layout

| Width | Columns | Card width | Section height |
|---|---:|---:|---:|
| 360 | 1 | 328 | 1763 |
| 390 | 1 | 358 | 1673 |
| 430 | 1 | 398 | 1630 |
| 640 | 2 | 295 | 981 |
| 768 | 2 | 355 | 938 |
| 900 | 4 | 203 | 644 |
| 1024 | 4 | 232 | 605 |
| 1440 | 4 | 311 | 620 |

Exact boxes are in `measurements.json`.

- Wrapper: max-width 1344, centered, padding `clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0`.
- Header: one column below 900px. From 900px it is `minmax(0,7fr) minmax(0,5fr)`, gap 20px 48px, aligned to the bottom, 40px below. It has the mono 10px eyebrow, the H2 at `clamp(30px,3.4vw,44px)` weight 600, and the 17px lede in `--t3`.
- Grid: gap 12. Columns are `minmax(0,1fr)` below 640px, `repeat(2,minmax(0,1fr))` from 640px and `repeat(4,minmax(0,1fr))` from 900px.
- Card: `--card`, 1px `--line`, radius 12, padding 20, column with 14px gap, `min-width:0`. On hover the border becomes `--line3` and the card lifts 1px.
- Chart box: 128px tall at every width, `--bg`, 1px `--hair`, radius 8, padding 10 (12 for the two stat boxes). It holds a mono 9px legend and the plot area, which fills the rest of the height.
- SVG: `viewBox 0 0 200 60`, `preserveAspectRatio="none"`, 100% of the plot area in both directions, `vector-effect="non-scaling-stroke"` on every line.
  - Card 01: red line with a fading red fill and a dashed `--line4` reference line.
  - Card 02: green power line over a `--t3` gas line, with the gap between them filled green at 10%.
- Card 03: "CREATOR FEES · DRAM-DDR5", a 26px mono number starting at $1,284.20 that rises by $0.40 to $3.00 every 1.5s (paused with reduced motion), and "PAID PER TRADE / ▲ LIVE".
- Card 04: "WHAT YOU NEED" rows: Wallet ✓, Collateral USDC, Gas $0, Signatures per trade 1.
- Text under each chart box:
  - Number label: mono 10px, `--t4`.
  - Title: 16px, weight 600.
  - Body: 13px, line height 1.6, `--t3`.
  - Link chip: mono 10px with a `--line3` border and radius 4.
  - Chip targets: GPU-H100 and POWER / GAS go to dexetera.xyz/explore, DRAM-DDR5 to /new-market, PRICE-EGGS to /token/PRICE-EGGS.

## Common causes of the mobile bug (what to avoid)

- `grid-template-columns: repeat(4, 1fr)` or `1fr` without `minmax(0, …)`: long mono text or SVGs force the column wider than the screen.
- An SVG with a fixed `width`, or one that keeps its aspect ratio (the default `xMidYMid meet`). The chart then shrinks into the middle or overflows instead of filling the box.
- A chart library (Recharts and similar) with a fixed-width container.
- Missing `vector-effect: non-scaling-stroke`, which makes the lines look stretched and blurry when the SVG is stretched.
