# Contact and Whitepaper pages: exact rebuild spec

These two pages are NOT built like the landing page. They are plain HTML with one class-based stylesheet each, no templating. Re-creating them in Tailwind is what makes them drift. The exact method is: **copy the scoped CSS file, port the markup 1:1 to JSX, port the small page script to a `useEffect`.** Following that method was verified pixel-identical to the design (page heights equal, 0.000 to 0.001% pixel difference at 1440 and 390, dark and light).

## Files (all in `design/pages/`)

| File | Use |
|---|---|
| `contact.css`, `whitepaper.css` | The page stylesheets, copied verbatim and scoped under `.dx-contact` / `.dx-whitepaper` so classes like `.card`, `.btn`, `.hero`, `h1`, `h2` cannot clash with the landing page. Import into the route (e.g. `app/contact/contact.css` imported in `page.tsx`). Do not convert to Tailwind. |
| `contact.body.html`, `whitepaper.body.html` | The page markup, links already rewritten to routes, logo pointed to `/dexetera-logo.svg`, with the original page script at the bottom. Port to JSX line by line. |
| `contact.preview.html`, `whitepaper.preview.html` | Working reference built from exactly those two files. Open over a local server (`cd design && python3 -m http.server`, then `/pages/contact.preview.html`) and compare with your build. |
| `../reference/fullpage/*.jpg` | Full-page screenshots of the originals at 1440 and 390, dark and light. Whitepaper 390 is split into 3 parts. |
| `../source/assets/dexetera-logo.svg` | The logo these two pages use (inline SVG in the source). Copy to `public/`. Also copy `hero_rocks.webp` to `public/`. |

## Port rules (both pages)

1. Root wrapper: `<div className="dx-contact" style={{'--rocks':"url('/hero_rocks.webp')"}}>` (or `dx-whitepaper`). Every element goes inside it.
2. Keep every class name and every inline style value exactly. `class` becomes `className`; inline `style="a:b"` becomes `style={{a:'b'}}`; CSS custom properties in style objects stay as string keys.
3. Global tokens come from `globals.css` (`design/tokens/theme.css`). The page CSS sets `--sans`, `--mono`, `--serif`, `--max` on the wrapper. If next/font exposes different variable names, set `--sans: var(--font-manrope), ...` there, nothing else.
4. Route-level: Contact `html{scroll-behavior:smooth}`; Whitepaper `html{scroll-behavior:smooth;scroll-padding-top:96px}`. Add via the route's CSS (`:root:has(.dx-whitepaper)`) or a layout class.
5. Body text defaults on the wrapper: 15px / 1.7, color `--t2`, Manrope. Do not let a global Tailwind preflight or `prose` change h1/h2/p margins: the page CSS resets them itself (`.dx-x *{margin:0;padding:0}`).
6. Inline SVG figures (Whitepaper Fig. 1 to 4): paste the SVG markup verbatim (convert attributes to JSX: `stroke-width` to `strokeWidth`, `font-family` to `fontFamily`, `text-anchor` to `textAnchor`, etc.). Keep the hard-coded hex fills: the light-mode remap block at the end of the CSS rewrites them by attribute value, so changing a hex breaks light mode.
7. Icons: Whitepaper header uses two unpkg `lucide-static` images (globe, arrow-up-right). Replace with `lucide-react` `Globe` (14px, color `--t2`) and `ArrowUpRight` (12px, color `--btn-p-bg`). Everything else is inline SVG, keep it.
8. Header: use the shared `Header` component from the landing build, which must match the Whitepaper header markup (they are identical: Georgia wordmark 12px, letter-spacing .04em, logo radius 6, Create a market and Launch app at 34px tall, 12px text). The Contact source header has small slips (wordmark letter-spacing .18em, logo radius 8, 13px buttons); do not copy those. Nav order and active state: current page link gets class `on` (color `--t1`) and `aria-current="page"`.
9. Footer: keep each page's own footer markup (4 columns: brand, Product, Learn, Company/Community; bottom bar "© 2026 Dexetera" and "Settled by public data"). Already fixed in the body file: Whitepaper "Create a market" now goes to `https://dexetera.xyz/new-market` (the source pointed to the landing #product by mistake).
10. Breakpoints are plain CSS media queries in the page CSS: `max-width:1100px` (nav hidden, menu button shown, Whitepaper contents rail hidden, Contact columns stack, h1 60px) and `max-width:720px` (h1 44px, h2 30px, 16px side padding, single columns). The header extras use JS: Create a market shows at width ≥ 1000, English at ≥ 1180.

## Shared hero (both pages)

- `.hero`: `min-height:100vh`, `overflow:hidden`, background `radial-gradient(120% 70% at 50% 0%, var(--hero-a) 0%, var(--hero-b) 45%, var(--bg) 75%)`; `::after` 220px fade to `--bg` at the bottom; `.grain` noise overlay at `opacity:var(--grain)`, `mix-blend-mode:overlay`.
- `.hero-in`: centered, max 1344, padding top 168px. Chip (26px pill, mono 10px, letter-spacing .2em) → h1 76px / 1.02 / 600 / -0.04em with first line in `--t5` (`.g`, display block) → lede 17px / 1.6 `--t3`, max 580 (Contact) or 560 (Whitepaper).
- Light mode: h1 and lede get `text-shadow: 0 0 24px #FAFAFA, 0 0 48px #FAFAFA`.
- Rocks: two layers (`#rockL`, `#rockR`) sized by JS from the same formula as the landing hero, then a scroll parallax. Port this exactly:

```js
function size(){
  const w=innerWidth, D=w>1024, T=w>768;
  const dashW=D?Math.min(880,w*.72):T?w*.86:w-32, m=(w-dashW)/2, ov=T?70:20;
  const sc=Math.max((m+ov)/515, D?0:w*.22/515);
  L.style.width=(530*sc)+'px'; R.style.width=(m+ov+10*sc)+'px';
  L.style.height=R.style.height=(1080*sc)+'px';
  const bs=(1920*sc)+'px '+(1080*sc)+'px';           // background-size on the inner layer
  Li.style.backgroundSize=Ri.style.backgroundSize=bs;
  Ri.style.backgroundPosition=(-1300*sc)+'px 0px';
}
function onScroll(){                                    // skip below 769px and with reduced motion
  const p=Math.min(1,Math.max(0,scrollY/(innerHeight*.8))), s=1+.12*p;
  L.style.transform=`translateX(${-28*p}%) scale(${s})`;
  R.style.transform=`translateX(${28*p}%) scale(${s})`;
}
// on mount: inner layers go from scale(1.08) to scale(1) over 1200ms cubic-bezier(.2,.7,.2,1)
// header gets class "scrolled" when scrollY > 24 (glass background + hairline)
```

Measured rock boxes: at 1440 each about 360px wide, 734px tall, sitting on the hero bottom; at 1024 about 232 x 472; at 390 about 88 x 180.

## Contact page (`/contact`)

Measured at 1440 x 900: total height 1996px. Hero 900px. Form block starts at y=520 (it overlaps the hero on purpose: `.contact{margin-top:calc(-100vh + 520px); position:relative; z-index:3}`). Form + side column 675px tall. Questions section 489px. Footer 280px.
At 1024: 2743px total (columns stacked). At 390: 3556px.

Structure:
1. Hero: chip "Contact", h1 "Tell us the risk." / "We'll help you price it.", lede.
2. `.contact` grid `1.35fr 1fr`, gap 24:
   - **Form card** (`.card.formcard`): radius 16, padding 32 (22 on mobile), shadow `var(--highlight), var(--shadow)`. Eyebrow "Send a message", h2 30px "How can we help?".
     - Topic chips: radio group (inputs visually hidden), 34px pills; checked = `--t1` background with `--bg` text. Options: Hedging a risk (default), Creating a market, Providing liquidity, Partnerships, Press, Other.
     - Two rows of two fields (`.row2`): Name*, Work email*; Company (optional), Metric or exposure (optional). Then Message* textarea 128px.
     - Inputs 44px, radius 10, `--card2` background, focus ring `--blue` plus `0 0 0 3px color-mix(in srgb, var(--blue) 22%, transparent)`.
     - Validation on submit: name length > 1, email regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`, message length > 3. Invalid field gets class `err` (red border, message shown) and the first invalid field is focused; typing clears `err`.
     - Submit row: privacy line with admin@dexetera.xyz link, primary button "Send message →". On mobile it stacks.
     - Success: form hidden, `.done` shown (48px tick circle, "Message sent.", "Thanks for reaching out. We'll reply to you by email.", "Send another" resets).
     - POST `FormData` to `/api/contact` before showing success. Build the route as a validated stub with a TODO for the mail provider (deliver to admin@dexetera.xyz).
   - **Side column** (`.side`, gap 12): three link cards (Email admin@dexetera.xyz / X / Twitter @dexeteralabs / Documentation doc.dexetera.org), each with a 32px circular arrow; then "What happens next" card with a 3-step numbered list (01, 02, 03 in mono).
3. Questions (`.sec`, padding 88 top, 56 bottom): two columns `1fr 1.4fr`; left eyebrow "Questions" and h2 44px "Before you" / "write to us."; right `<details>` accordion, first item open, "+" rotates 45° when open. Four questions, copy in the markup.
4. Footer.

## Whitepaper page (`/whitepaper`)

Measured at 1440 x 900: total height 14,088px. Hero 937px (cover card at y=591, 880 x 249). Doc grid starts at 937. Footer 280px.
At 1024: 13,368px. At 390: 20,211px (hero 1190 because the cover stacks).

Structure:
1. Reading progress bar: fixed, top 0, 2px, `--progress`, z 60, width = scroll percentage of the whole page.
2. Hero: chip "Whitepaper", h1 "Commercial risk," / "made tradable.", lede, CTA row (primary "Start reading →" to #summary, secondary "Launch app" to https://dexetera.xyz), then the **cover card** (max 880, radius 16, grid `1.2fr 1fr`): left eyebrow "Commercial Risk Markets", h3 22px, paragraph; right a 2 x 3 grid of key/value pairs (Chapters 07, Reading time 14 min, Collateral USDC, Settlement UMA Optimistic Oracle, Market type Scalar futures, Trading On-chain orderbook). "Scroll to read" pill at the hero bottom. Rocks container has a mask fading the bottom 220px.
3. `.doc` grid `240px minmax(0,1fr)`, gap 72, padding 88 32:
   - **Contents rail** (`.toc`): sticky, top 104, max-height `calc(100vh - 128px)`. Links 00 to 08 with a 1px left border; the current chapter gets class `on` (`--t1` text and border). Current = last chapter whose top is above 140px from the viewport top. Under the links a "Reading" meta showing the same percentage as the progress bar. Hidden at ≤ 1100px.
   - **Article** (`.body`, max 760): nine chapters, each `section.ch` with 56px vertical padding and a hairline top border (none on the first).

| Anchor | Number / title | Contains | Height at 1440 |
|---|---|---|---|
| `#summary` | 00 Executive Summary | intro paragraph, pull quote | 996 |
| `#problem` | 01 The Problem | 3 cards (`.grid3`), dash list | 1085 |
| `#existing` | 02 Why Existing Markets Stop Short | Fig. 1 (SVG), 2 lists | 1727 |
| `#opportunity` | 03 The Opportunity | 6 cards (`.grid3`) | 972 |
| `#protocol` | 04 The Protocol | Fig. 2, Fig. 3, 5 numbered subheads, `.grid2` cards, steps lists, pull quote | 4267 |
| `#customers` | 05 The Customer Model | Fig. 4, 3 subheads, list | 1529 |
| `#onchain` | 06 Why On-Chain Markets Matter | comparison table in `.tbl` (Dexetera column highlighted `.dx`) | 1088 |
| `#vision` | 07 Long Term Vision | pull quote | 684 |
| `#links` | 08 Links | 2 x n link cards | 348 |

   Type inside the article: chapter label mono 10px, letter-spacing .3em; h2 44px / 1.08, first line `--t5`; subheads 20px with mono number; paragraphs 15/1.7 `--t2`, intro 17px `--t3`; pull quote 20px card; lists use a 6px dash marker; numbered steps use mono 01, 02...
   - Below 1100px the rail disappears and figures and tables scroll inside their own box (`overflow-x:auto`), never the page.
4. Footer.

Note: the cover says "Chapters 07" while the contents run 00 to 08. That is how the design reads; keep it unless the owner says otherwise.

## Acceptance (both pages)

- Open your build and the matching `*.preview.html` side by side at 1440, 1024, 768 and 390, dark and light. Page heights must match within a few px (Contact 1996 / 2743 / 3556; Whitepaper 14,088 / 13,368 / 20,211 at 1440 / 1024 / 390).
- `scrollWidth === innerWidth` at 390.
- Contents highlight and progress percentage update while scrolling; anchors land below the header.
- Form validation, error clearing, success state and "Send another" all work; the request reaches `/api/contact`.
- Theme toggle switches both pages, including the SVG figures, with no flash on reload.
- No em dashes, no app.dexetera.xyz, no doc.dexetera.xyz, no support@.
