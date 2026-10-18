# Dexetera Landing v2: Developer Handoff

Source of truth: `Dexetera Landing v2.dc.html` (template markup at the top, logic class `Component` at the bottom inside `<script data-dc-script>`). Every value below is copied from that file. Where this document and the file disagree, the file wins.

Target stack: Next.js App Router, TypeScript, Tailwind CSS.

---

## 1. Overview: page order

The whole page sits in one root wrapper: `min-height:100vh; background:#0A0A0B; color:#fff; font-family:Manrope`.

| # | Section | Element / anchor | `data-screen-label` |
|---|---|---|---|
| 0 | Header (fixed) | `<header>` | (none) |
| 1 | Hero (scroll sequence) | `#top` | `Hero` |
| 2 | Ticker strip | (no id) | (none) |
| 3 | Stat strip | (no id) | (none) |
| 4 | Trust row (Settled by / Collateral / Data from) | (no id) | (none) |
| 5 | Market wall | `#markets` | `Market wall` |
| 6 | How risk moves today (network diagram + glass stat cards) | (no id) | `Problem` |
| 7 | How it works (4-step stepper) | `#how` | `How it works` |
| 8 | A real example / GPU-H100 | (no id) | `Example` |
| 9 | Market types (two tables) | (no id) | `Market types` |
| 10 | Who it's for (4 cards) | (no id) | `Who it's for` |
| 11 | The product (terminal mock) | `#product` | `Product` |
| 12 | Why Dexetera (comparison table) | (no id) | `Why Dexetera` |
| 13 | Creators earn | (no id) | `Creators` |
| 14 | FAQ | `#faq` | `FAQ` |
| 15 | Final CTA | (no id) | `Final CTA` |
| 16 | Footer + status bar | `<footer>` | `Footer` |

Every section from 5 to 14 has `data-reveal` (reveal on scroll, see 4.4). Sections 5, 6, 7, 11 and 14 have `scroll-margin-top: 88px`; the others have none.

In-page links: `#top` (logos), `#markets` (nav, hero CTA, scroll pill), `#how` (nav, footer, status bar), `#product` (nav), `#faq` (footer). Docs is the external link `https://doc.dexetera.org`.

---

## 2. Design tokens

### 2.1 CSS custom properties

**The source file declares no CSS custom properties.** All values are inline literals. For the rebuild, define the tokens below in `tailwind.config.ts` (`theme.extend`) or as `:root` variables. The names are suggestions; the values are exact.

```css
:root {
  /* Surfaces (darkest to lightest) */
  --bg:            #0A0A0B; /* page, hero, sections, network stage */
  --surface-1:     #0F0F0F; /* cards, dashboard mock, terminal panels */
  --surface-2:     #141414; /* sidebar, pills, hovered rows, active stepper card */
  --surface-3:     #1A1A1A; /* inputs, ghost buttons; also the default hairline */
  --surface-4:     #1F1F1F; /* active sidebar item, chip bg */
  --surface-5:     #2A2A2A; /* active toggle, bars, avatar */

  /* Lines */
  --line-1:  #1A1A1A; /* section dividers, table rows */
  --line-2:  #1F1F1F; /* dashboard internal lines */
  --line-3:  #222222; /* card borders */
  --line-4:  #2A2A2A; /* pill borders */
  --line-5:  #333333; /* chips, hover borders */
  --line-6:  #404040; /* strong hover borders */

  /* Text */
  --text-1: #FFFFFF;
  --text-2: #D1D5DB;
  --text-3: #A1A1A1; /* default link color */
  --text-4: #9CA3AF; /* stat labels, icon masks */
  --text-5: #808080; /* body copy, leads */
  --text-6: #606060; /* eyebrows, mono labels */
  --text-7: #5C5C5C; /* grey first line of two-tone headlines */
  --text-8: #404040;

  /* Semantic */
  --green:       #4ADE80;
  --green-bg:    rgba(16,185,129,0.12);
  --green-line:  rgba(16,185,129,0.22);
  --green-strong-line: rgba(74,222,128,0.6);
  --red:         #F87171;
  --red-bg:      rgba(248,113,113,0.10);
  --red-line:    rgba(248,113,113,0.22);
  --amber:       #D4A017;  /* settle dates */
  --amber-bg:    rgba(250,204,21,0.08);
  --amber-line:  rgba(250,204,21,0.20);
  --violet:      #A78BFA;  /* FEATURED, UMA OO, CREATED BY YOU */
  --violet-bg:   rgba(139,92,246,0.15);
  --violet-line: rgba(139,92,246,0.30);
  --violet-soft: #C4B5FD;  /* "View" link in market tables */
  --link-blue:   #93C5FD;  /* archive.org */
  --slate:       #3B82F6;  /* glass card tint only */

  /* Gradients */
  --grad-share:  linear-gradient(135deg,#6366F1,#8B5CF6 50%,#A855F7);
  --grad-create: linear-gradient(135deg,#8B5CF6 0%,#EC4899 50%,#F97316 100%);
  --grad-hero:   radial-gradient(ellipse at 50% 0%,#232323 0%,#121212 35%,#0A0A0B 70%);

  /* Radii */
  --r-3: 3px;  --r-4: 4px; --r-5: 5px; --r-6: 6px; --r-8: 8px;
  --r-10: 10px; --r-12: 12px; --r-16: 16px; --r-20: 20px; --r-pill: 100px;

  /* Shadows */
  --shadow-dashboard: inset 0 1px 0 rgba(255,255,255,.06), 0 40px 120px rgba(0,0,0,.6);
  --shadow-terminal:  0 8px 32px rgba(0,0,0,0.35);
  --shadow-glass:     inset 0 1px 0 rgba(255,255,255,0.06);

  /* Glass */
  --glass-bg:   rgba(255,255,255,0.04);
  --glass-line: rgba(255,255,255,0.08);
  --glass-line-hover: rgba(255,255,255,0.14);
  --glass-blur: blur(16px);

  /* Layout */
  --container: 1344px;
  --gutter: clamp(16px,3vw,32px);
  --section-pt: clamp(56px,7vw,88px);
  --header-h: 72px;
  --anchor-offset: 88px;
}
```

Global CSS (from `<helmet><style>`, reproduce in `app/globals.css`):

```css
html,body{margin:0;background:#0A0A0B;color:#fff;font-family:"Manrope",system-ui,sans-serif;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
*{box-sizing:border-box}
a{color:#A1A1A1;text-decoration:none}
a:hover{color:#fff}
input[type=range]{accent-color:#fff}
input:focus{outline:none}
@media (prefers-reduced-motion: reduce){*{transition:none !important;animation:none !important;scroll-behavior:auto !important}}

@keyframes dx-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes dx-ticker-r{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@keyframes dx-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes dx-travel{from{transform:translate(var(--x0),var(--y0));opacity:1}to{transform:translate(var(--x1),var(--y1));opacity:0.2}}
@keyframes dx-pulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,.5)}70%{box-shadow:0 0 0 5px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
/* Declared but unused in v2 (left over from earlier hero versions): dx-roll-in, dx-roll-out, dx-barpulse */
```

### 2.2 Fonts

Loaded from Google Fonts:

```
https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap
```

- **Manrope** 400 / 500 / 600 / 700: all UI and body text.
- **JetBrains Mono** 400 / 500 / 600: prices, eyebrows, labels, tickers, tables. CSS stack `'JetBrains Mono',monospace`.
- **Georgia** (system, not loaded): the wordmark. Stack `Georgia,'Times New Roman',serif`, weight 500, 12px, letter-spacing 0.04em, uppercase. Also "FRED" in the trust row (`Georgia,serif`, 700, 15px, 0.04em).

In Next.js use `next/font/google` for `Manrope({ weight:['400','500','600','700'] })` and `JetBrains_Mono({ weight:['400','500','600'] })`, exposed as `--font-sans` and `--font-mono`.

### 2.3 Type scale (as used)

M = Manrope, J = JetBrains Mono. Letter-spacing in em.

```
ROLE                         FONT  SIZE                       WEIGHT LH     TRACK   NOTES
Hero H1                      M     76 / 60 / 44 px (2.4)      600    1.02   -0.04   two-tone spans, display:block
Final CTA H2                 M     clamp(40px,5.6vw,72px)     600    1.0    -0.04   text-wrap:balance
Section H2                   M     clamp(30px,3.4vw,44px)     600    1.08   -0.03   text-wrap:balance
Creators H2                  M     clamp(28px,3vw,40px)       600    1.08   -0.03
Section lead                 M     17px                       400    1.6    0       #808080, max-width 560px, text-wrap:pretty
Hero subhead                 M     15px                       400    1.6    0       #808080, max-width 500px
Eyebrow (section)            J     10px                       400    -      0.1     uppercase #606060
Eyebrow (hero)               J     10px                       400    -      0.14    uppercase #606060
Header nav                   M     11px                       600    -      0.08    uppercase, #A1A1A1, hover #fff
Header pills                 M     12px                       600    -      0
Hero CTAs                    M     13px                       600    -      0       h40, r100
Final CTA buttons            M     14px                       600/500 -     0       h44, r6
Card title (featured)        M     20px                       600    -      -0.015
Card title (small)           M     13px                       600    -      0       nowrap ellipsis
Who card title               M     16px                       600    -      -0.01
Stepper title                M     16px                       600    -      0
Card body                    M     13px                       400    1.6    0       #808080
FAQ question                 M     15px                       600    -      0
FAQ answer                   M     14px                       400    1.65   0       #808080
Footer links                 M     14px                       400    -      0
Footer legal / status bar    M     12px / 13px                400    1.6    0
Dashboard portfolio value    J     40px (28px <=768)          500    1      -0.03
Glass stat number            J     clamp(20px,2.1vw,28px)     500    -      -0.02   overflow-wrap:anywhere
Featured price               J     28px                       600
GPU price label              J     28px                       600
Who: creator fees            J     26px                       600
Stat strip value             J     20px                       600
Settle final value           J     20px                       600
Creator dash KPIs            J     17px                       600
Card price (small)           J     15px                       600
Feat KPI values              J     14px                       600
Product stats values         J     13px                       600
Mono body / chips            J     11px                       400
Mono small labels            J     10px                       400    -      0.08–0.12
Mono micro labels            J     9px                        400    -      0.08–0.1
Stat strip label             M     10px                       500    -      0.08    uppercase #9CA3AF
```

### 2.4 Breakpoints (from `renderVals`, JS-driven on `window.innerWidth`)

```ts
// general sections
const L = w >= 1100;  // large
const M = w >= 900;   // medium (desktop nav, 4-col grids)
const S = w >= 640;   // small (2-col grids)
// hero only
const D = w > 1024;   // desktop hero (76px H1, 880px dashboard)
const T = w > 768;    // tablet+ hero (scroll sequence allowed, sidebar shown)
// header extras
const showCreate = w >= 1000;
const showLang   = w >= 1180;
// network diagram
const NW  = w < 640;              // vertical layout
const MID = !NW && w < 900;       // 6 nodes, larger labels
```

Note the strict inequalities: at exactly 1024 the hero uses tablet values, and at exactly 768 the hero uses mobile values (no sequence). Tailwind's defaults (`sm 640`, `md 768`, `lg 1024`, `xl 1280`) do not line up with these, so add custom screens:

```ts
screens: { s: '640px', m: '900px', create: '1000px', hd: '1025px', l: '1100px', lang: '1180px', ht: '769px' }
```

### 2.5 Container and section padding

```
Container:          max-width 1344px; margin 0 auto; padding-inline clamp(16px,3vw,32px)
Section padding:    padding: clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0
Section header row: grid hdrCols, gap 20px 48px, align-items end, margin-bottom 40px
                    hdrCols = M ? 'minmax(0,7fr) minmax(0,5fr)' : 'minmax(0,1fr)'
Final CTA inner:    padding clamp(80px,10vw,128px) clamp(16px,3vw,32px); margin-top clamp(56px,7vw,88px)
Footer top:         padding 56px clamp(16px,3vw,32px) 40px
```

Resolved section top padding: 1440 → 88px; 1280 → 88px (7vw = 89.6, so the clamp caps it at 88); 1024 → 71.7px; 768 → 56px (53.8 below the floor); 390 → 56px.
Resolved gutter: 1440 → 32; 1280 → 32; 1024 → 30.7; 768 → 23.0; 390 → 16.

### 2.6 Z-index scale

```
header (fixed)                  40
hero copy block                 1   (inside hero stage)
hero dashboard wrapper          2
hero rocks layer                3 (T) / 0 (<=768, sits behind the card)
hero scroll pill                4
network toggle                  2   (inside stage)
comparison sticky header        5
terminal floating labels        2
```

---

## 3. Component inventory

Markup notes use Tailwind-like shorthand; exact CSS values are in the code blocks.

### 3.1 Header (`components/Header.tsx`, client)

Props: none (reads `scrolled`, `width`, `menuOpen`).

```
<header fixed top-0 inset-x-0 z-40 h-[72px]
        background: scrolled ? rgba(10,10,11,0.78) : rgba(10,10,11,0)
        border-bottom: 1px solid (scrolled ? #1A1A1A : transparent)
        backdrop-filter / -webkit-backdrop-filter: scrolled ? 'blur(14px) saturate(140%)' : 'none'
        transition: background 200ms, border-color 200ms, backdrop-filter 200ms, -webkit-backdrop-filter 200ms>
  <div relative max-w-[1344px] h-full mx-auto px-gutter flex items-center justify-between gap-16>
    <a href="#top" flex items-center gap-10 color #fff>
      <img assets/dexetera-logo.png 32x32 r6>
      <span Georgia 500 12px 0.04em uppercase>Dexetera</span>
    </a>
    {w>=900 && <nav absolute left-1/2 top-1/2 -translate-x/y-1/2 flex gap-28 11px 600 0.08em uppercase nowrap>
       Markets(#markets) · How it works(#how) · Product(#product) · Docs(https://doc.dexetera.org)</nav>}
    <div flex items-center gap-12>
      {w>=1180 && <span flex gap-6 12px #A1A1A1 cursor-pointer><GlobeIcon 14px color≈#A6A6A6/>English</span>}
      <div flex items-center gap-8>
        {w>=1000 && <a href="https://dexetera.xyz/new-market" h-34 px-16 bg #141414 border #2A2A2A r100 #fff 12px 600; hover border #404040>Create a market</a>}
        <a href="https://dexetera.xyz" h-34 pl-6 pr-16 gap-8 bg #fff r100 #0F0F0F 12px 600; hover bg #E5E5E5>
          <span 22x22 r-full bg #0F0F0F center><ArrowUpRight 12px white/></span>Launch app
        </a>
        {w<900 && <button aria-label="Menu" 34x34 r100 border #2A2A2A bg #141414 flex-col gap-4> 3 × <span 14x1.5 bg #A1A1A1/></button>}
      </div>
    </div>
  </div>
  {menuOpen && w<900 && <div absolute top-[72px] inset-x-0 bg #141414 border-b #222 pt-8 px-gutter pb-16 flex-col 12px 600 0.08em uppercase onClick=close>
     Markets · How it works · Product · Docs (each py-14 border-b #1A1A1A) · Create a market (#fff, no border)</div>}
</header>
```

Icons in the source are `lucide-static@0.460.0` SVGs used as `<img>` with `filter: invert(x)`. In Next.js use `lucide-react` with explicit colors: invert(0.65) ≈ `#A6A6A6`, invert(0.6) ≈ `#999`, invert(0.5) ≈ `#808080`, invert(0.4) ≈ `#666`, invert(1) = `#fff`.

### 3.2 Hero (`components/hero/Hero.tsx`, client)

Props: `seq: boolean` (computed: `T && !reducedMotion`), `width`.

```
<div id="top" ref=heroRef relative bg #0A0A0B height: seq ? '180vh' : 'auto'>
  <div stage position: seq ? sticky : relative; top 0; height: seq ? 100vh : auto; overflow hidden;
       padding-bottom: seq ? 0 : (T ? 96px : 72px);
       background: radial-gradient(ellipse at 50% 0%,#232323 0%,#121212 35%,#0A0A0B 70%)>
    <Noise/>          absolute inset-0 opacity .06 pointer-events-none, SVG feTurbulence tile (below)
    <HeroCopy ref=copyRef/>
    <DashboardMock ref=dashRef/>
    <Rocks/>
    {seq && <ScrollPill ref=pillRef/>}
  </div>
</div>
```

Noise tile (background-image, auto repeat):

```
url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22160%22%20height=%22160%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23n)%22/%3E%3C/svg%3E')
```

HeroCopy:

```
<div ref=copyRef relative z-1 flex-col items-center text-center padding: (T ? 96 : 112)px 16px 0; will-change transform,opacity>
  <div J 10px 0.14em uppercase #606060 [stagger 0ms]>The marketplace for risk</div>
  <h1 mt-20 size 76|60|44 600 lh1.02 -0.04em>
    <span block #5C5C5C [stagger 80ms]>Hedge the</span>
    <span block #fff    [stagger 160ms]>unhedgeable.</span>
  </h1>
  <p mt-20 max-w-500 15px lh1.6 #808080 pretty [stagger 240ms]>Create a futures market on any number you can measure, trade it long or short in USDC, and let public data settle it.</p>
  <div mt-28 flex wrap justify-center gap-8 [stagger 320ms]>
    <a href="#markets" h-40 px-20 gap-8 bg #fff r100 #0F0F0F 13px 600; hover bg #E5E5E5>Explore markets <span>→</span></a>
    <a href="https://dexetera.xyz/new-market" h-40 px-20 bg #141414 border #2A2A2A r100 #fff 13px 600; hover border #404040>Create a market</a>
  </div>
</div>
```

ScrollPill:

```
<a href="#markets" absolute z-4 left-1/2 bottom-24 -translate-x-1/2 h-32 px-14 gap-8
   bg rgba(20,20,20,0.8) backdrop-blur(10px) border #2A2A2A r100 11px #A1A1A1 nowrap;
   hover color #fff border #404040>
  <MouseIcon 12px/>Scroll to explore
</a>
```

### 3.3 DashboardMock (`components/hero/DashboardMock.tsx`, client: ticking values)

Props: `width:number` (dashW px), `showSidebar:boolean` (T), `eggPrice:number`, `eggChg24:number`, `myOpen`, `onToggleMy`.

```
<div ref=dashRef relative z-2 flex justify-center margin-top: (T?44:36)px; will-change transform>
  <div card width dashW flex-none flex overflow-hidden bg #0F0F0F border #222 r16
       box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 40px 120px rgba(0,0,0,.6)
       [load: opacity 0→1, translateY(48px)→none, 700ms, delay 200ms]>
    {showSidebar && <aside w-200 flex-none bg #141414 border-r #1F1F1F p-[16px_12px] flex-col gap-14>
       row: logo 24x24 r5 + "Dexetera" 13px 600 | PanelLeft icon 14px (#666)   (px-4, justify-between)
       search: h-32 px-10 gap-8 bg #0F0F0F border #222 r8 | Search icon 12px | "Search" 12px #606060 flex-1 | "⌘K" J10 #404040
       nav (flex-col gap-2 12px 500): each h-32 px-10 gap-10 r8
         Overview (bg #1F1F1F, #fff, icon LayoutDashboard white) · Explore (Compass) · Watchlist (Star) · Analytics (Activity), inactive #A1A1A1 icon #999
       group (border-t #1F1F1F pt-12 flex-col gap-2):
         button h-28 px-10 justify-between J10 0.1em #606060 "MY MARKETS" + ChevronDown 12px (rotate(-90deg) when closed, transition .2s)
         rows (when open): h-30 px-10 gap-8 J10 | dot 6px | symbol #D1D5DB flex-1 | price #606060
    </aside>}
    <main flex-1 min-w-0 p-[16px_20px] flex-col gap-20>
      top row (flex wrap justify-between gap-8):
        chip h-32 pl-4 pr-12 gap-8 border #222 r100 bg #141414 | avatar 24 r-full bg #2A2A2A border #333 | "0xdda4…12b4" J11 #fff
        right (gap-8): Live toggle (track 26x14 r100 #fff, knob 10x10 #0F0F0F at right:2 top:2) + "Live" 11px #A1A1A1
                       {showSidebar && date chip h-28 px-10 gap-6 border #222 r100 J10 #A1A1A1 "Oct 1 to Oct 16" + ChevronDown 10px}
                       bell 28x28 r-full border #222, Bell icon 12px
      value block (flex-col gap-8):
        "PORTFOLIO VALUE" J10 0.12em #606060
        row (flex wrap items-center gap-10): value J 40|28px 500 -0.03em lh1 | chip green "+4.8%" J11 px-7 py-3 r100 #4ADE80 on rgba(16,185,129,0.12) | chip grey "+$15,840" J11 #A1A1A1 on #1F1F1F
      asset chips (flex wrap gap-8): each h-30 px-12 gap-8 border #222 r100 bg #141414 J11 | dot 7px | sym #fff | price #A1A1A1 | change (green/red)
      chart (flex-col gap-8):
        bars: h-140 flex items-end gap-2; each bar flex-1 min-w-0 r1, height %, color #2A2A2A or #D1D5DB
        dates: flex justify-between J9 #606060  OCT 1 · OCT 4 · OCT 7 · OCT 10 · OCT 13 · OCT 16
      positions header: grid [minmax(0,2fr) repeat(4,minmax(0,1fr))] gap-8 pt-12 border-t #1F1F1F J10 0.08em uppercase #606060
        Market · Side · Entry · Mark · P&L(right)
      positions body (flex-col, margin-top -12px): 3 rows, same grid, h-38 border-t #1A1A1A J11
        market #fff | side green(Long)/red(Short) | entry #A1A1A1 | mark #A1A1A1 | P&L right green/red
    </main>
  </div>
</div>
```

### 3.4 Rocks (`components/hero/Rocks.tsx`, client: geometry depends on width)

Two halves of the same image, so each boulder can be placed and moved on its own.

```
<div aria-hidden absolute inset-0 pointer-events-none z: (T ? 3 : 0)>
  <div ref=rockLRef absolute left-0 bottom-0 width 530*sc px, height 1080*sc px, transform-origin left bottom, will-change transform>
    <div w-full h-full bg url(/assets/hero_rocks.webp) no-repeat, bg-size `${1920*sc}px ${1080*sc}px`, bg-position 0px 0px,
         transform-origin left bottom, [load: scale(1.08)→scale(1), 1200ms cubic-bezier(.2,.7,.2,1)]/>
  </div>
  <div ref=rockRRef absolute right-0 bottom-0 width (m+ov+10*sc) px, height 1080*sc px, transform-origin right bottom>
    <div ... bg-position `${-1300*sc}px 0px`, transform-origin right bottom, same load scale/>
  </div>
</div>
```

Geometry is covered in 6.2.

### 3.5 Ticker (`components/Ticker.tsx`, CSS animation; client only because it reads the live egg price)

Props: `items: [symbol, price, changePct][]`, `durationSec`, `reverse?`, `pausable?`.

```
wrapper: bg #0A0A0B border-b #1A1A1A h-46 overflow-hidden
track:   display flex; width max-content; height 46; align-items center; J11;
         animation: `${reverse?'dx-ticker-r':'dx-ticker'} ${dur}s linear infinite`;
         animation-play-state: paused while hovered (main ticker only)
items rendered twice (items.concat(items)) so -50% loops seamlessly.
item:    inline-flex items-center gap-8 px-22 border-r #1A1A1A nowrap
         [symbol #808080] [• #404040] [price #fff] [±x.xx% green >0 / red <0 / #A1A1A1 =0]
```

### 3.6 StatStrip

```
outer: border-b #1A1A1A bg #0A0A0B → container (overflow-x auto) → grid statCols
statCols = M ? 'repeat(5,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))'
cell: padding 16px 20px; flex-col gap-6; border-right #1A1A1A; border-bottom: M ? none : 1px solid #1A1A1A
      grid-column: (!M && i===0) ? 'span 2' : 'auto'
label: flex gap-6 M10 500 0.08em uppercase #9CA3AF + green dot 5px
value row: flex items-baseline gap-8 | J20 600 #fff | J10 #606060 sub
```

### 3.7 TrustRow

```
container py-28 flex wrap items-center justify-center gap 16px 40px color #606060
[SETTLED BY (J10 0.1em #404040)] [UMA 15px 700 0.06em] [Optimistic Oracle 12px 500]
| divider 1x16 #222 |
[COLLATERAL] [USDC 15px 600 0.02em]
| divider |
[DATA FROM] [FRED Georgia 15 700 0.04em] [BLS 15 700 0.12em] [ERCOT 15 600 0.02em italic] [Freightos 15 600 -0.01em] [TrendForce J13 600]
inner gaps 10px; the Data-from group is flex-wrap with gap 10px 22px
```

### 3.8 MarketCard / FeaturedCard (Market wall)

Filters row: `flex gap-4 overflow-x-auto mb-16 pb-2`. Each button: `flex-none h-32 px-14 r8 M12 500`. Active: bg `rgba(255,255,255,0.06)`, border `rgba(139,92,246,0.25)`, color `#fff`. Inactive: transparent / transparent / `#808080`. Filters: `All, Commodities, Energy, Compute, Freight, Macro, Ratio`. Cards outside the filter get `opacity: 0.28` (transition .25s).

Grid: `grid-template-columns: c4; grid-auto-rows: minmax(176px,auto); gap 12px`.

FeaturedCard (GPU-H100, market index 0), `<a>`:

```
grid-column: S ? 'span 2' : 'span 1'; grid-row: M ? 'span 3' : 'span 1'
bg #0F0F0F border #222 r12 p-20 flex-col gap-16; hover border #333, translateY(-1px); transition opacity .25s, border-color .15s, transform .15s
row1: [cat chip 10px 500 #808080 bg rgba(255,255,255,0.04) border rgba(255,255,255,0.06) r4 px-7 py-3] [FEATURED 10px 600 0.08em violet pill r100 px-9 py-3] ... [tag J9 0.08em LIVE green / EXAMPLE #606060]
row2: name 20/600/-0.015em + "GPU-H100/USDC · $/hr" J11 #606060 | price J28 600 + chg J12 colored ("▲ 1.23%" / "▼ …")
chart: flex-1 min-h-220 (featChart: area + right axis 48px + volume bars 34px + 90D/60D/30D/NOW labels)
KPIs: grid 4 cols border-t #1A1A1A pt-14 gap-8: VOLUME 24H $412K · OPEN INT. $1.9M · TRADERS 186 · SETTLES 31 MAR 2027 (J12 600 #D4A017); label J9 0.1em #606060, value J14 600
buttons: grid 2 cols gap-8: "↗ Long" h40 r8 13/600 #4ADE80 bg #0F0F0F border #4ADE80 | "↘ Short" same in #F87171
```

MarketCard (indices 1–6), `<a>`:

```
bg #0F0F0F border #222 r12 p-16 flex-col gap-10; hover border #333, translateY(-1px)
row1: cat chip | tag
name 13/600 nowrap ellipsis + "ID · unit" J10 #606060
spark h-40 (area chart, clip-path reveal)
price J15 600 | change J11 colored
settle chip: J9 #D4A017 bg rgba(250,204,21,0.08) border rgba(250,204,21,0.20) r4 px-6 py-2 "SETTLES 31 DEC 2026"
href: live ? https://dexetera.xyz/token/{id} : https://dexetera.xyz/explore
```

Change % per card: egg = vs `open24`; featured (i=0) = last vs first point; others = last vs `a[length-25]`.

### 3.9 Network diagram (`components/network/RiskNetwork.tsx`, client)

Stage:

```
<div ref=netRef relative overflow-hidden border #222 r20 bg #0A0A0B height: NW ? 600px : MID ? 480px : 640px>
  grid overlay: absolute inset-0; 48px grid lines rgba(255,255,255,0.035);
                mask radial-gradient(ellipse 70% 70% at 50% 50%,#000 30%,transparent 100%)
  toggle: absolute left-1/2 top-20 -translate-x-1/2 z-2 flex p-3 gap-2 bg #141414 border #2A2A2A r100
     button h-30 px-16 r100 J11 0.06em; active bg #2A2A2A #fff; inactive transparent #808080; transition .2s
     "Today" | "● On Dexetera" (6px green dot, gap 6)
  svg holder: absolute left-0 right-0 top-64 bottom-12 → <svg viewBox preserveAspectRatio="xMidYMid meet" w-full h-full overflow-visible>
</div>
```

The SVG contents and animation are specified in 4.8; coordinates are in 5.

### 3.10 GlassStatCard

Grid: `margin-top 12px; grid-template-columns c4; gap 12px` (4 / 2 / 1 columns).

```
<div relative overflow-hidden bg rgba(255,255,255,0.04) backdrop-blur(16px) border rgba(255,255,255,0.08) r16
     shadow inset 0 1px 0 rgba(255,255,255,0.06) p-22 flex-col gap-10; transition border-color .2s, transform .2s
     hover: border rgba(255,255,255,0.14), translateY(-2px)>
  <span tint absolute right-[-60px] top-[-60px] 200x200 r-full blur(24px) pointer-events-none
        background: radial-gradient(circle,rgba(74,222,128,0.08),transparent 70%)   // cards 1, 3
                 or radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%)   // cards 2, 4
  <span relative J clamp(20px,2.1vw,28px) 500 -0.02em #fff overflow-wrap:anywhere>{v}</span>
  <span relative 13px lh1.5 #808080 flex-1 min-h-39>{d}</span>
  <span relative flex items-center gap-6 J10 0.08em #4ADE80 border-t rgba(255,255,255,0.06) pt-12>DEXETERA: {x}<span>→</span></span>
</div>
```

Equal heights come from grid row stretch plus `flex-1` on the description.

### 3.11 Stepper + vignettes (How it works)

Grid: `grid-template-columns c4; gap 24px 12px`. Four columns, each `<div onClick flex-col gap-14 cursor-pointer min-w-0>`:

```
rail: flex items-center gap-10 (margin-right -12px on steps 1–3)
  badge J11 600 r4 px-7 py-3 "01".."04"; transition all .25s
    bg:     i===step ? #fff : #0F0F0F
    color:  i===step ? #0A0A0B : #808080
    border: i<=step ? #fff : #333
  line flex-1 h-1: i<step ? rgba(255,255,255,0.5) : #222 (transition .4s). Step 4 line is fixed #1A1A1A.
card: flex-1 r12 p-18 flex-col gap-14 transition all .25s
  bg i===step ? #141414 : #0F0F0F; border i===step ? #404040 : #1A1A1A
  title 16/600 color i===step ? #fff : #A1A1A1; body 13/1.6 #808080
  vignette: mt-auto bg #0A0A0B border #1A1A1A r10 p-12
```

Vignettes:

1. **List**: "GPU H100 rental $/hr" 13px #D1D5DB with a blinking caret (1x14 #808080, `dx-blink 1s steps(1) infinite`); "SUGGESTED SOURCES" J9; chips "GPU rental index · daily", "Cloud list prices" (11px #A1A1A1 border #333 r100 px-9 py-3); "✦ Create" h26 px-10 bg #2A2A2A r8 11px #D1D5DB, right-aligned.
2. **Trade**: Long (active green: bg rgba(16,185,129,0.12), border rgba(74,222,128,0.6)) / Short (#808080 border #222), both h26 r8 11/600; size row h30 px-10 bg #1A1A1A border #2A2A2A r8 J11 "Size" / "$1,000 · 5x"; button h30 r8 12/600 bg #4ADE80 #0A0A0B "Long GPU-H100".
3. **Price & margin**: spark h34 (area of `walk(2.14,30,0.003,0.04)`, ref 2.0, min 1.9, max 2.25, green); rows J10: ENTRY · MARK `$2.00 · $2.14`; UNREALIZED P&L `+$350.00` green 600; MARGIN USED `$1,000.00`; LIQ. PRICE `$1.62`.
4. **Settle**: FINAL VALUE + violet "UMA OO" chip; `$2.31` J20 600 + " /HR" J10 #606060; SNAPSHOT `archive.org/web/…` #93C5FD; CHALLENGE WINDOW amber chip "2H".

### 3.12 GPU example

```
card bg #0F0F0F border #222 r12 overflow-hidden
top p-[20px_20px_12px] flex-col gap-14:
  header: "GPU-H100/USDC · MARK · 90 DAYS" J10 0.1em #606060 | price J28 600 + move label J11 (color)
  chart: relative h clamp(180px,22vw,260px); area chart in left:0..right:44; right axis 44px border-l #1A1A1A J9:
         $3.00 @12.5%, $2.00 @50% (#A1A1A1), $1.00 @87.5%
  <input type=range min=1 max=3 step=0.05 aria-label="GPU price per hour"> accent #fff, w-full
  labels J10 #606060: $1.00 | DRAG · ENTRY $2.00 · 1,000 HRS HEDGED | $3.00
ledgers: grid exLedgerCols (S ? 2 cols : 1) border-t #1A1A1A; each p-20 flex-col gap-14 border-r/b #1A1A1A
  head: name 15/600 + role 12 #808080 | side chip J10 600 r8 px-9 py-4 (green or red set)
  2 rows: label J11 #808080 | value colored; bar track h6 bg #141414 r3 with center tick (1px #404040)
          fill: left/width from bar(v), color green/red, transition left .15s, width .15s
  NET row: J12 border-t #1A1A1A pt-10 "NET" | "$0" 600
footer: flex wrap justify-between p-[14px_20px] bg #0A0A0B: "TRADING FEES GENERATED · CREATOR SHARES IN EVERY TRADE" J10 | fees J16 600
note below: 15px lh1.65 #606060 max-w-720 mt-16
```

### 3.13 Market tables

Grid `tablesCols = L ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)'`, gap 12.

```
card bg #0F0F0F border #222 r12 overflow-hidden
head: flex justify-between px-20 py-16 border-b #1A1A1A | title 15/600 + count chip J10 #A1A1A1 bg #1A1A1A r4 px-6 py-2 | sub 12 #606060
body: overflow-x auto → min-width 580px
  cols: minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr) 64px 44px; gap 12
  header row: py-10 px-20 border-b J9 0.1em #606060: MARKET LONG SHORT 7D (blank)
  row <a>: min-h-58 py-8 px-20 border-b #1A1A1A; hover bg #141414
     name 13/600 + sym J10 #808080 | long 12 #A1A1A1 | short 12 #A1A1A1 | spark h22 | "View" 12/600 #C4B5FD right
```

### 3.14 WhoCards

Grid `c4`, gap 12. Card: `bg #0F0F0F border #222 r12 p-20 flex-col gap-14; hover border #333 translateY(-1px)`.

```
visual box h-128 bg #0A0A0B border #1A1A1A r8 p-10|12
number line J10 0.1em #606060 ("01 / BUSINESSES")
title 16/600 -0.01em
body 13/1.6 #808080 flex-1
chip link J10 #D1D5DB border #333 r4 px-8 py-4; hover border #404040 #fff
```

1. Businesses: legend J9 "— UNHEDGED COST" (#F87171) "-- HEDGED" (#A1A1A1); area `whoA` red with dashed ref at 100. Link `GPU-H100 →` to /explore.
2. Funds & Traders: legend "— POWER" green, "— GAS" #808080, "▒ GAP" #606060; area `whoA` green with band `gas` (band stroke #808080). Link `POWER / GAS →`.
3. Data owners: "CREATOR FEES · DRAM-DDR5" J9, live `ownerFees` J26 600, "PAID PER TRADE" / "▲ LIVE" green. Link `DRAM-DDR5 →` to /new-market.
4. Global investors: "WHAT YOU NEED" rows J10: Wallet ✓ (green), Collateral USDC, Gas $0, Signatures per trade 1. Link `PRICE-EGGS →` to /token/PRICE-EGGS.

### 3.15 ProductTerminal (replica of the live app's token page, Niño 3.4 demo market)

Replica of the dexetera.xyz token page layout, built from `uploads/ref_trading_page.png` and `uploads/ref_trading_page_b.png`, showing a demo market NINO34-DEC26. All numbers are demo values (generic user "Trader"). Market icon: `assets/nino34-icon.svg` (blue to teal circle #1E3A8A → #0D9488, two white waves, orange #F97316 sun dot), used in the market header (34px) and the Token Information card (26px).

```
frame (breaks out of the 1344 content container; section header, notes and features stay inside it):
  width: calc(100vw - 48px); max-width: 1680px; margin-left: 50%; transform: translateX(-50%)
  border #222 r12 overflow-hidden bg #0A0A0B, no shadow
  bottom fade into the page: mask-image linear-gradient(to bottom, #000 calc(100% - 140px), transparent)
stage height: 803px (top bar through the positions table). Comments, creator, similar markets, status bar and the rail's create button are not in the mock.
sizing:
  frame width >= 1330px (viewport about 1380+): 1:1 real pixels, no transform. Inner width 100% of the frame; wrapper height 803px.
    (The fixed-size top bar, header row and chart toolbar need about 1330px; below that they would clip.)
  frame width <  1330px: fixed 1280px design width, transform scale(min(1, frameClientWidth / 1280)), origin 0 0; wrapper height round(803 * scale).
  frameClientWidth is measured from appRef on every resize (fallback: min(1680, innerWidth - 48) - 2).
regions (canvas px; right edges are fluid):
  rail          left 0, width 52, full height. bg #0F0F0F border-r #1A1A1A; avatar 32 r8; 6 icons (layout-grid compass bookmark signal lightbulb settings) at y 88/131/176/220/264/308
  top bar       left 52, right 0, top 0, h56. logo 36 r8 + DEXETERA Georgia 14; search flex 1 1 463px (min 200, max 463) x30; flex spacer; Deposit 111x36 #3B82F6; bell; "Demo view"; avatar + "Trader"
                stats: Portfolio $90.10 | Available Cash $24.58 | Unrealized P&L +$24.74
  ticker        left 52, right 0, top 56, h46. J12, 70s loop: NINO34-DEC26 (live), ETHEREUM, GOLD, NASDAQ, PRICE-EGGS (live egg), PRICE-MILK-US, SILVER, 500
  market header left 52, right 0, top 102, h138, bg #0F0F0F. All chips flex:none + nowrap (single line).
                Row 1 (top 8, h52): Niño 3.4 icon 34 + green status dot; "Niño 3.4" 15/600 + badge-check #8B5CF6; "NINO34-DEC26" J11; amber chip "Settles Dec 31, 2026"; tags Climate / Weather / Index / +3 (green); OB + ID address chips; WATCHING 0 box 102x46; spacer; star 32; Share (purple gradient)
                Row 2 (top 66): stats J11 MARK LAST 24H CHG 24H HIGH 24H LOW BID ASK SPREAD VOLUME TRADES
                Row 3 (top 98): description 11 #606060 ellipsis + "More": "A market tracking the NOAA CPC monthly Niño 3.4 sea surface temperature anomaly in °C. Settles at 3,000 + 1,000 × anomaly, floored at zero, $1 per point. Source: NOAA Climate Prediction Center."
  main grid     left 56, right 4, top 242. grid-template-columns: minmax(0,2.2fr) minmax(0,1fr) 320px; rows 318px 240px; gap 3px 5px
                All extra width goes to the chart and book columns (2.2 : 1); right column fixed 320.
    chart       col 1 row 1. toolbar h40 (search, NINO34, +, 1D, candles, fx Indicators, undo/redo, history hexagon maximize camera); tools column w54 (7 icons, first selected); chart fills the rest x 240; legend overlay ("NINO34-DEC26 (NOAA CPC) · 1D · ORDERBOOK", OHLC of hovered/last candle, "Live Metric Tracker (1) NINO34"); bottom bar h38 (5y 1y 3m 1m 5d 1d, calendar, live UTC clock, %, log, auto)
    positions   col 1 row 2. tabs Positions 5 / Open Orders 12 / Trade History 0 / Order History 50 + "Live"; cols minmax(0,1.1fr) 1fr 1.2fr 1.8fr 1.8fr 1.1fr 1.3fr, padding 0 12 0 9; rows h44 (NINO34-DEC26, NINO12-DEC26, PRICE-EGGS); clipped like the app
    book        col 2 rows 1-2 (h561). BOOK/TRADES segmented; Order Book (title top 46, header top 68): 9 asks (container top 88 h198, bottom aligned), ASKS (SELL) top 290, spread bar top 308 h26, BIDS (BUY) top 340, 9 bids top 356; rows h22 J12 centered; columns PRICE / SIZE (CONTRACTS) / TOTAL (USD)
    right col   col 3 rows 1-2, flex column gap 6:
      metric+token h198: "Metric Source" + cpc.ncep.noaa.gov (red, external-link icon); Token Information card; Current Price box (LIVE chip, price J18/700, change, Margin Used/Reserved/Available value)
      ticket       h357: Market/Limit (h42), Long/Short (h34), POSITION SIZE + input h50 (placeholder 1,000.00), QUICK AMOUNTS (+$100 +$500 +$1K +$5K Max), Slippage 1%, "Enable Trading" h42 #3B82F6 → /token/NINO34-DEC26
annotation pills (landing only): 1 Live order book (book panel, top -11 left 12), 2 Gasless, one signature (right column, top 193 left 12), 3 Source + UMA settlement (right column, top -11 left 150)
panels: border #1F1F1F r6 bg #0F0F0F; inner dividers #1A1A1A
below the frame (unchanged): 3 numbered notes (grid c3) and the 5-up features strip
```

### 3.16 ComparisonTable

```
grid split57 (L ? 'minmax(0,5fr) minmax(0,7fr)' : 1 col), gap 40px 56px, align start
left column: position L ? sticky : static, top 96px; eyebrow, H2, lead, "Read the docs →" (h40 px-18 bg #1A1A1A border #222 r6 13/500; hover border #333)
table wrapper: overflow-x (L ? visible : auto) bg #0F0F0F border #222 r12 → min-width 640
  cols: minmax(0,1fr) minmax(0,1.2fr) repeat(3,minmax(0,1fr))
  header: position L ? sticky : static; top 57px; z-5; J9 0.1em #606060 bg #0F0F0F border-b #222 r[12 12 0 0]
          cells p-[14px_16px]; DEXETERA cell bg #141414 #fff border-top 1px #fff 600
  rows 13px border-b #1A1A1A: feature #A1A1A1 | Dexetera bg #141414 #fff 600 with "✓" J green | 3 others #808080 with glyph (✓ green, – #606060, ✕ red)
```

### 3.17 CreatorDashboard

```
card bg #0F0F0F border #222 r12 overflow-hidden grid split57
left p clamp(24px,4vw,48px) flex-col justify-center gap-20: eyebrow "Creators earn", H2 clamp(28px,3vw,40px), lead (max-w 480),
     CTA "+ Create a market" h44 px-22 r10 gradient --grad-create #fff 14/600 (hover brightness 1.08)
right p clamp(16px,2.5vw,28px) bg #0A0A0B border-l #1A1A1A → inner card bg #0F0F0F border #222 r12 p-18 flex-col gap-16:
  head: "MY MARKETS / DRAM-DDR5" J10 + "DRAM DDR5 spot, $/Gb" 15/600 | violet "CREATED BY YOU" pill + "EXAMPLE" pill (J9 border #222 #606060)
  KPIs grid 3: each bg #0A0A0B border #1A1A1A r6 p-12: label 10/500 0.08em #9CA3AF, value J17 600:
     30D VOLUME $1.84M | FEES EARNED {ownerFees} green | TRADERS 318
  bars: "DAILY VOLUME · 30D" / "USDC" J9; h-120 flex items-end gap-3 border-b #222; 30 bars r[2 2 0 0], last #fff, others #333
  footer J11 border-t pt-12: "Creator fee share" #808080 | "Paid per trade · see docs" #D1D5DB
```

### 3.18 FAQ accordion

```
grid split57; left: eyebrow "Learn how this works", H2 "Questions, answered.", lead max-w 420, buttons
  (support@dexetera.xyz h40 bg #1A1A1A border #222 r6 13/500; "Docs →" #A1A1A1)
right: flex-col gap-8; item r12, transition background .2s, border-color .2s
  open: bg #0F0F0F border #222; closed: transparent border #1A1A1A
  <button w-full flex gap-12 px-18 py-16 text-left>
     "?" circle 22px border #404040 11px #9CA3AF | question 15/600 flex-1 | sign J14 #808080 ("−" open / "+" closed)
  {open && <p pl-52 pr-18 pb-18 14/1.65 #808080 pretty>{a}</p>}
```

Single-open accordion; default open index `0`; clicking the open item closes it (`faq: null`).

### 3.19 FinalCTA

```
section relative overflow-hidden mt clamp(56px,7vw,88px) border-y #1A1A1A bg #0A0A0B
background: absolute inset-0 flex-col justify-center gap-10 opacity .22 pointer-events-none
   mask radial-gradient(ellipse 70% 90% at 50% 50%,transparent 20%,#000 75%)
   5 ticker rows: T1 (80s), T2 (95s reverse, items reversed), T3 (70s, items rotated by 4), T1, T2; not pausable
content: relative container py clamp(80px,10vw,128px) flex-col items-center gap-24 text-center
   eyebrow "DEXETERA / LIVE ON MAINNET" J10 0.1em #606060
   H2 "Hedge the unhedgeable." clamp(40px,5.6vw,72px) 600 lh1.0 -0.04em balance
   p 17/1.6 #808080 max-w 520
   buttons: "Launch app →" h44 px-22 bg #fff r6 #0F0F0F 14/600 (hover #E5E5E5) | "Create a market" h44 px-22 bg #1A1A1A border #222 r6 #fff 14/500 (hover border #404040)
```

### 3.20 Footer

```
grid footCols (M ? 'minmax(0,2fr) repeat(3,minmax(0,1fr))' : S ? 'repeat(2,minmax(0,1fr))' : 1 col) gap 40px 32px
brand col (max-w 320, flex-col gap-16): logo 32 r6 + Georgia wordmark; tagline 14/1.6 #808080
   "The on-chain marketplace for risk. Create and trade futures on any measurable number."
   socials: X, Discord (h32 px-12 border #222 r6 12px; hover border #333)
3 link cols (flex-col gap-12 14px), heading J10 0.1em #606060 mb-4:
   PRODUCT: Markets (dexetera.xyz/explore), Create a market (/new-market), Docs
   RESOURCES: How it works (#how), Settlement (doc.dexetera.org), FAQ (#faq)
   COMPANY: X (x.com/dexeteralabs), Discord (discord.com/invite/ntVTBwhTd), support@dexetera.xyz
legal row: container pt-20 pb-24 border-t #1A1A1A flex wrap justify-between gap 12px 24px 12px
   "Trading derivatives involves risk of loss. Markets are created by users. Nothing here is investment advice." #606060 max-w 720
   Terms of Service (dexetera.org/dexetera-tos.html) · Privacy Policy (dexetera.org/dexetera-privacy.html), gap 20
```

### 3.21 StatusBar (last footer strip)

```
bg #0A0A0B + dot pattern radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px) size 6px 6px; border-t #1A1A1A
container min-h-48 py-10 flex wrap items-center gap 8px 20px 13px
"● Live" green (dot 6px with dx-pulse 2s infinite) | How it works (#how) | Watchlist (dexetera.xyz/watchlist) | Docs | Support (mailto)
right (ml-auto flex wrap gap-6): "Active Markets:" #606060 + chips J10 #A1A1A1 border #333 r4 px-7 py-3 → /token/{symbol}
```

---

## 4. Behavior and motion

### 4.1 Scroll-driven hero

Active only when `seq = innerWidth > 768 && !prefersReducedMotion`. Runs inside one rAF-throttled passive scroll listener; nothing calls `preventDefault`, and the page uses no scroll-snap and no `overflow:hidden` on html/body.

```ts
// wrapper 180vh, stage sticky top:0 height:100vh  →  scroll distance = 80vh
const vh = window.innerHeight;
const p  = clamp01((scrollY - hero.offsetTop) / Math.max(1, hero.offsetHeight - vh));

// Dashboard (outer wrapper; the inner card keeps its load transform)
const dashH = dash.offsetHeight;
const fit   = Math.max(0.82, Math.min(1, (vh - 104) / dashH));        // scale floor 0.82
const end   = Math.max(88, 72 + (vh - 72 - dashH * fit) / 2);          // header 72 + 16 clearance
const delta = Math.max(0, dash.offsetTop - end);                       // offsetTop relative to sticky stage
dash.style.transformOrigin = '50% 0';
dash.style.transform = `translateY(${-delta * p}px) scale(${1 - (1 - fit) * p})`;

// Headline block
copy.style.opacity   = String(1 - Math.min(1, p / 0.7));
copy.style.transform = `translateY(${-120 * p}px)`;

// Rocks (percent of each rock's own box)
const s2 = 1 + 0.12 * p;
rockL.style.transform = `translateX(${-28 * p}%) scale(${s2})`;   // origin left bottom
rockR.style.transform = `translateX(${ 28 * p}%) scale(${s2})`;   // origin right bottom

// Pill
pill.style.opacity = String(Math.max(0, 1 - p / 0.15));
```

When `seq` is false the handler clears all these inline transforms and opacities, so the content stays in normal flow. The handler runs on mount, on every scroll, and after every resize (the resize `setState` callback calls it).

### 4.2 Header scrolled state

`scrolled = window.scrollY > 24`. It is evaluated in the same rAF scroll handler, and `setState` fires only when the value changes. Style values are in 3.1; transition 200ms.

### 4.3 Load stagger

`hin` becomes `true` after two `requestAnimationFrame`s following mount (immediately under reduced motion).

```
element              from                          to     transition
eyebrow              opacity 0, translateY(16px)   1/none opacity 600ms ease 0ms;   transform 600ms cubic-bezier(.2,.7,.2,1) 0ms
h1 line 1            same                                 ... 80ms
h1 line 2            same                                 ... 160ms
subhead              same                                 ... 240ms
CTA row              same                                 ... 320ms
dashboard card       opacity 0, translateY(48px)   1/none opacity 700ms ease 200ms; transform 700ms cubic-bezier(.2,.7,.2,1) 200ms
rock inner layers    scale(1.08)                   scale(1) transform 1200ms cubic-bezier(.2,.7,.2,1)
```

### 4.4 Reveal on scroll + fail-safe

`setupReveal()` runs 60ms after mount and is skipped when reduced motion is on or `IntersectionObserver` is missing.

```ts
const els = document.querySelectorAll('[data-reveal],[data-spark]');
// initial
[data-reveal]: opacity 0; transform translateY(8px); transition 'opacity 400ms ease, transform 400ms ease'
[data-spark]:  clip-path inset(0 100% 0 0)   // its own transition: clip-path 900ms cubic-bezier(.2,.7,.2,1)
// observe after 2 rAFs, rootMargin '0px 0px -6% 0px'
on intersect: reveal → opacity 1, transform none | spark → clip-path inset(0 0 0 0); unobserve
// fail-safe: 1500ms after setup, reveal everything and disconnect
```

`[data-spark]` is the wrapper of every area chart produced by `area()` (market card sparks, table sparks, step spark, GPU chart, Who visuals).

### 4.5 Tickers

```
main ticker:   60s linear infinite, 'dx-ticker', paused on hover (animation-play-state)
CTA row 1:     80s, items tk
CTA row 2:     95s, 'dx-ticker-r', items tk reversed
CTA row 3:     70s, items tk.slice(4).concat(tk.slice(0,4))
CTA rows 4,5:  repeat rows 1 and 2
```

### 4.6 Live price ticking (shared egg price)

All live numbers come from one candle array `cs` (44 candles). The egg price is `last = cs[cs.length-1].c`.

```ts
// PRNG: Park–Miller, seed 11. All seeded data depends on call order.
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// initial candles
let v = 2.6; for 44: o=v; v=v*(1+(rnd()-0.46)*0.014); h=max(o,v)*(1+rnd()*0.005); l=min(o,v)*(1-rnd()*0.005)
scale every OHLC by 2.715 / v  → last close = 2.715
open24 = cs[20].c ; chg24 = (last/open24 - 1)*100

// tick every 1500ms (disabled under reduced motion)
m = last.c * (1 + (rnd()-0.5)*0.004)
tn++ ; if (tn % 6 === 0) shift oldest, push {o:last.c,c:m,h:max,l:min} else update last candle c/h/l
series[i] (i>=2, 50% chance each): shift + push last*(1+(rnd()-0.5)*0.012)
trades: prepend {p:m, s:round(50+rnd()*900), up:m>=last.c, t:now}, keep 9
book = makeBook(m)   // 8 levels each side, tick 0.001, sizes round(300+rnd()*3200), cumulative totals
flash = m>=last.c ? 1 : -1 ; flashRow = floor(rnd()*16) ; cleared after 450ms
ownerFees += 0.4 + rnd()*2.6     // starts at 1284.20
```

Flash colors: mark text `#4ADE80` / `#F87171` / `#fff`; mark background `rgba(16,185,129,0.12)` / `rgba(248,113,113,0.10)` / transparent; flashed book row `rgba(255,255,255,0.06)`.

Where the egg price is used: main ticker (PRICE-EGGS), egg market card, terminal mark/stats/order book/positions P&L, hero dashboard (portfolio value, PRICE-EGGS chip, positions row, sidebar My markets).

```ts
// hero dashboard
pv   = 345398.34 + (last - 2.715) * 52000
gain = 15840     + (last - 2.715) * 52000
pvPct = '+' + (gain/(pv-gain)*100).toFixed(1) + '%'
pvGain = '+$' + Math.round(gain).toLocaleString('en-US')
// terminal position
pnl = 5000 / 2.69 * (last - 2.69)
```

### 4.7 Network diagram toggle and morph

```
state: netMode 'today' | 'dex' (default 'today'), netManual false, netI 0, netHover null
autoplay: IntersectionObserver(threshold 0.4) on the stage; on first intersect → disconnect, then after 2200ms
          set netMode 'dex' unless netManual. Runs once.
toggle click: clear the pending autoplay timeout, set netMode, netManual = true
cycle: setInterval 1600ms → netI++ while netMode==='dex' && !reducedMotion
       N = nodes.length; cyc = netI % (N + 2); act = (dex && cyc < N) ? cyc : -1   // two idle beats per loop
morph: every fade uses opacity 900ms cubic-bezier(.2,.7,.2,1)
       Dexetera connector draw-in: strokeDasharray = L, strokeDashoffset L → 0, 900ms same easing, delay i*60ms
       side connectors (USDC, UMA): same, delay 300ms + j*120ms
       active connector stroke rgba(255,255,255,0.25) → rgba(74,222,128,0.75), transition stroke 400ms
       hub brackets stroke #606060 → rgba(255,255,255,0.9), 900ms; hub dot fill #2A2A2A/stroke #404040 → #fff, 900ms
traveling dot: circle r2.5 #4ADE80, key = netI (remounts per step),
       CSS vars --x0/--y0 (node) --x1/--y1 (hub edge), animation dx-travel 1.3s cubic-bezier(.4,0,.2,1) both,
       base transform translate(x1,y1) (where it sits under reduced motion)
node lit: dex && (i < cyc || i === act) → fill #4ADE80; else dex ? #D1D5DB : (ok ? #808080 : #404040), transition fill 400ms
hover: node dot scale(1.15) (transform-box fill-box, origin center, 200ms); label → #D1D5DB; tooltip rect drawn in SVG
reduced motion: the global CSS rule removes transitions and animations, so the swap is instant and the dot is static
```

SVG drawing rules (every number in SVG user units):

```
fs  = NW ? 11 : MID ? 17 : 13
VB  = NW ? [360,640] : [1200,600]
hub = NW ? [180,96]  : [600,270]
B (bracket half size) = NW ? 26 : 46 ; A (arm length) = NW ? 8 : 14 ; R (connector stop) = B * 1.15
connector end (ex,ey) = hub - unit(hub - node) * R
Today line:   node → (ok ? hub edge : 58% point), stroke ok ? #808080 : #404040, dashed '4 4' when blocked, width 1
blocked mark: an "x" (two 8-unit lines) at the 58% point, stroke #808080 width 1.25
Today tag:    centered at (58% point.x, 58% point.y + fs*1.5), rect fill #0A0A0B stroke #2A2A2A rx3, text #606060 size fs*0.78
Dex tag:      centered at the 45% point, stroke rgba(74,222,128,0.35), text #4ADE80
              tag width = len*fs*0.58*0.85 + 14 ; height = fs*0.85 + 9 ; tags hidden on NW
node dot r:   NW 4, MID 6, wide 4 ; stroke #0A0A0B width 2 ; invisible hit circle r18
node label:   uppercase mono, size fs*0.85, letter-spacing 0.06em; y = node above hub-60 ? y - fs*1.2 : y + fs*1.9
radial light: circle r = NW ? 180 : 340 at hub, gradient white 0.07→0 (Today) / #4ADE80 0.07→0 (Dex), crossfade
hub labels:   title at y = hub.y - B - fs*0.9, size fs*0.95, 600
              Today "BANK SWAP DESK" #A1A1A1 / Dex "DEXETERA ORDER BOOK" rgba(255,255,255,0.9), green dot r3 left of text
              desc at y = hub.y + B + fs*1.6, size fs*0.82: "Prices the hedge, keeps the spread" #606060 / "Live bids and asks set the price" #808080
bank (Today): dashed line from hub bottom edge to bank.y-8 (#404040), square 8x8 fill #2A2A2A stroke #606060,
              "BANK BALANCE SHEET" #A1A1A1 600 at +fs*1.7, "Holds all the risk, decides the payout" #606060 fs*0.8 at +fs*3.1
side nodes (Dex): green line rgba(74,222,128,0.6), dot r4 #4ADE80, title #fff 600 at +fs*1.7, desc #808080 fs*0.8 at +fs*3.1 (desc hidden on NW)
tooltip:      width = len(d)*fs*0.55*0.85 + 24, height fs*2.2, rx6, fill #141414 stroke #333, text #D1D5DB fs*0.85 at x+12;
              clamped to [8, VB.w - width - 8]; below the node when it sits in the upper area, above otherwise (±fs*2.8)
draw order:   defs, lights, connectors/markers/dots, bank, side nodes, brackets, hub dot, hub labels, tags, nodes, tooltip
```

### 4.8 Stepper auto-advance

```
step: 0..3 (default 0). Every 4000ms: if (Date.now() - stepClick > 8000) step = (step+1) % 4.
Click on a step sets step and stepClick = Date.now(). Disabled under reduced motion.
```

### 4.9 GPU slider math

```ts
gpu ∈ [1, 3], step 0.05, default 2
d = (gpu - 2) * 1000                           // P&L for 1,000 hrs
gpuLabel = '$' + gpu.toFixed(2) + '/hr'
moveLabel = |d|<1 ? 'AT ENTRY' : (d>0?'+':'−') + '$' + |gpu-2|.toFixed(2) + ' FROM ENTRY'
gpuChgColor = |d|<1 ? '#A1A1A1' : gpu>=2 ? '#4ADE80' : '#F87171'
path[i], i=0..89, t=i/89:
  nz = 0.12*sin(t*9+0.5) + 0.07*sin(t*21+2) + 0.04*sin(t*37)
  y  = 2 + (gpu-2)*(t*t*(3-2t)) + nz*sin(PI*t)
chart: area(path, color, {min:0.8, max:3.2, ref:2, grid:true, sw:1.75})
bar(v): p = min(50, |v|/1000*50) ; left = v>=0 ? 50% : (50-p)% ; width = p% ; color green/red
InferCo (LONG):  rows ['Compute cost change', -d], ['Hedge P&L', d]
RigCloud (SHORT): rows ['Compute revenue change', d], ['Hedge P&L', -d]
money(v): |round(v)|<0.5 → '$0' ; else sign ('+' / '−') + '$' + |v| en-US
color(v): |v|<0.5 → #A1A1A1 ; v>0 → #4ADE80 ; else #F87171
fees: on each input event where v !== previous gpu: fees += 2 * 1000 * v * 0.001   (starts 0; shown '$' + fees.toFixed(2))
```

### 4.10 Terminal: Niño 3.4 demo data, live tick, chart

```
market: NINO34-DEC26, "Niño 3.4", settles Dec 31, 2026
formula: price = 3,000 + 1,000 × anomaly (°C), floored at 0, $1 per point
  latest weekly NOAA CPC Niño 3.4 anomaly used for the demo: +2.4 °C → 3,000 + 2,400 = 5,400
stats row: MARK $5,400.00 | LAST $5,400.00 | 24H CHG +1.7% (vs previous daily close 5,310) | 24H HIGH $5,430 | 24H LOW $5,310
           BID $5,390.00 | ASK $5,410.00 | SPREAD $20.00 | VOLUME $184K | TRADES 1,412
current price card: mark, green "↑ 1.69%" (vs previous close); Margin Used / Reserved / Available unchanged (31.1900 / 12.4000 / 24.5800)
tick size: $10
live tick (every 1500ms, skipped under reduced motion):
  last = clamp(last ± 10 (50/50), 5,380, 5,430); updates the last candle close (high/low widen if needed),
  MARK, LAST, current price, ticker and the order book mid together. A trade (1 to 40 contracts) is prepended to TRADES.
order book (mid = last): asks last+10 … last+90 (9 levels), bids last-10 … last-90 (9 levels)
  ask sizes (contracts) [120, 85, 240, 60, 310, 180, 420, 95, 600]
  bid sizes (contracts) [150, 90, 260, 40, 380, 210, 500, 130, 560]
  TOTAL (USD) = price × size per row; depth bar = cumulative contracts / max cumulative
  spread row "$20.00 · 0.37%" (20 / last); counts "9 orders"
positions (Positions tab; badges stay 5 / 12 / 0 / 50):
  NINO34-DEC26  LONG 12   entry $4,620.00  mark live ($5,400.00)  PNL 12 × (mark − 4,620) → +$9,360 +16.9%  liq $2,980.00
  NINO12-DEC26  LONG 5    entry $6,100.00  mark $7,400.00         PNL +$6,500 +21.3%                        liq $3,950.00
  PRICE-EGGS    LONG 4.2  entry $2.5377    mark $2.7180           PNL +$0.76 +7.10%                         liq $0.00
ticket: Market/Limit, Long/Short, size placeholder 1,000.00, quick amounts +$100 +$500 +$1K +$5K Max (24.58), "Enable Trading"
other state: tab, side, bsize, bookTab, posTab, tiTab, btcHover (unchanged)
chart: candle(cs, 'btcHover', 240, { fmt: 2-dec en-US, lvFmt: 0-dec en-US, axis: 72, noOhlc: true, vol: true,
         levels: [5500, 5000, 4500, 4000, 3500], range: [2850, 5800], ref: { v: 3000, label: 'Neutral (0.0 °C)' } })
  candle() options: fmt (price tag), lvFmt (axis labels), axis width, noOhlc, vol (volume bars, bottom 14%, 0.2 opacity),
  padT/padB (range padding), levels (fixed axis levels), range [bottom, top], ref (dashed horizontal line + label)
  last price tag green "5,400.00"; legend shows OHLC + change of the hovered or last candle
daily candles (70, illustrative), [open, high, low, close, volume 0..1]; the last row is today:
  [3580, 3610, 3520, 3600, 0.39],
  [3600, 3650, 3560, 3600, 0.32],
  [3600, 3740, 3560, 3690, 0.85],
  [3690, 3760, 3670, 3710, 0.42],
  [3710, 3790, 3700, 3750, 0.62],
  [3750, 3810, 3700, 3750, 0.24],
  [3750, 3850, 3710, 3790, 0.61],
  [3790, 3890, 3730, 3830, 0.51],
  [3830, 3880, 3780, 3850, 0.41],
  [3850, 3870, 3770, 3800, 0.53],
  [3800, 3920, 3750, 3880, 0.87],
  [3880, 3900, 3720, 3760, 0.92],
  [3760, 3810, 3700, 3790, 0.36],
  [3790, 3820, 3740, 3780, 0.57],
  [3780, 3820, 3760, 3780, 0.34],
  [3780, 3830, 3750, 3800, 0.41],
  [3800, 3920, 3780, 3880, 0.88],
  [3880, 3970, 3840, 3920, 0.6],
  [3920, 4010, 3880, 3970, 0.76],
  [3970, 4050, 3950, 4000, 0.54],
  [4000, 4080, 3970, 4050, 0.71],
  [4050, 4180, 4000, 4160, 0.73],
  [4160, 4180, 4140, 4150, 0.59],
  [4150, 4210, 4130, 4170, 0.45],
  [4170, 4280, 4110, 4260, 0.92],
  [4260, 4350, 4210, 4300, 0.7],
  [4300, 4320, 4290, 4300, 0.29],
  [4300, 4310, 4140, 4180, 0.83],
  [4180, 4250, 4140, 4220, 0.47],
  [4220, 4240, 4170, 4200, 0.6],
  [4200, 4230, 4070, 4080, 1],
  [4080, 4160, 4070, 4100, 0.61],
  [4100, 4120, 3990, 4050, 0.63],
  [4050, 4150, 4030, 4130, 0.64],
  [4130, 4180, 4080, 4170, 0.63],
  [4170, 4270, 4160, 4240, 0.56],
  [4240, 4350, 4200, 4330, 0.92],
  [4330, 4380, 4230, 4280, 0.77],
  [4280, 4490, 4250, 4440, 1],
  [4440, 4520, 4410, 4470, 0.42],
  [4470, 4530, 4420, 4500, 0.53],
  [4500, 4540, 4420, 4470, 0.45],
  [4470, 4530, 4450, 4500, 0.45],
  [4500, 4570, 4460, 4510, 0.55],
  [4510, 4530, 4450, 4490, 0.34],
  [4490, 4520, 4380, 4420, 0.79],
  [4420, 4590, 4400, 4560, 0.99],
  [4560, 4600, 4510, 4550, 0.44],
  [4550, 4720, 4520, 4670, 1],
  [4670, 4710, 4630, 4690, 0.36],
  [4690, 4880, 4670, 4860, 1],
  [4860, 4920, 4810, 4910, 0.72],
  [4910, 5060, 4850, 5000, 0.85],
  [5000, 5010, 4940, 4990, 0.46],
  [4990, 5040, 4890, 4900, 0.66],
  [4900, 4920, 4750, 4760, 0.84],
  [4760, 4800, 4690, 4750, 0.31],
  [4750, 4780, 4710, 4760, 0.33],
  [4760, 4920, 4730, 4860, 0.89],
  [4860, 4990, 4830, 4960, 0.68],
  [4960, 5010, 4890, 4950, 0.3],
  [4950, 5130, 4930, 5090, 0.91],
  [5090, 5140, 5070, 5100, 0.27],
  [5100, 5140, 5020, 5060, 0.55],
  [5060, 5140, 5030, 5130, 0.63],
  [5130, 5140, 5040, 5050, 0.71],
  [5050, 5110, 4990, 5090, 0.65],
  [5090, 5290, 5040, 5260, 1],
  [5260, 5360, 5220, 5310, 0.63],
  [5310, 5430, 5310, 5400, 0.78],
clock: live UTC HH:MM:SS, updates on each tick.
Note: comments, creator and similar markets are not rendered in the current mock (dropped in the 1:1 revision).
  Similar markets data is kept in code as Niño 1+2 (Climate), PRICE-EGGS (Commodities), Silver (Precious Metals).
```

### 4.11 Market wall filter, FAQ, menu

- Filter: `filter ∈ ['All','Commodities','Energy','Compute','Freight','Macro','Ratio']`, default `'All'`. Non-matching cards get opacity 0.28.
- FAQ: `faq` index, default `0`; click toggles `faq === i ? null : i`.
- Mobile menu: `menu` boolean; shown only when `w < 900`; clicking inside the panel closes it.
- Dashboard "My markets": `myOpen` default `true`.

### 4.12 Reduced motion summary

- Global CSS kills every transition and animation, and disables smooth scroll.
- JS: `hin = true` immediately and `rm = true`, so there is no sticky sequence. The hero wrapper is `auto` height, the stage is `position:relative`, `padding-bottom` is 96px (T) or 72px, and the dashboard sits in normal flow.
- Off under reduced motion: live tick interval, stepper auto-advance, reveal-on-scroll (content shows immediately), network cycle (no `netI` increments). The network autoplay to Dexetera still fires once.

---

## 5. Data (paste into `lib/data.ts`)

```ts
export type Market = { id: string; name: string; unit: string; cat: string; base: number; dec: number; settle: string; live?: boolean; pct?: boolean; ab?: string };

export const MARKETS: Market[] = [
  { id: 'GPU-H100', name: 'GPU compute, H100', unit: '$/hr', cat: 'Compute', base: 2.0, dec: 2, settle: '31 MAR 2027', ab: 'GP' },
  { id: 'PRICE-EGGS', name: 'Eggs, Grade A', unit: '$/dozen', cat: 'Commodities', base: 2.715, dec: 3, settle: '31 DEC 2026', live: true },
  { id: 'ERCOT-N', name: 'ERCOT North power', unit: '$/MWh', cat: 'Energy', base: 38.4, dec: 2, settle: '30 JUN 2027' },
  { id: 'FREIGHT-FEU', name: 'Asia to US freight', unit: '$/FEU', cat: 'Freight', base: 2140, dec: 0, settle: '31 JAN 2027' },
  { id: 'DRAM-DDR5', name: 'DRAM DDR5 spot', unit: '$/Gb', cat: 'Compute', base: 4.85, dec: 2, settle: '31 MAR 2027' },
  { id: 'US-CPI-YOY', name: 'US CPI, year on year', unit: '%', cat: 'Macro', base: 2.9, dec: 2, settle: '15 JAN 2027', pct: true },
  { id: 'BTC-MINE-M', name: 'BTC mining margin', unit: 'BTC / POWER', cat: 'Ratio', base: 48.2, dec: 2, settle: '31 MAR 2027' },
];
// MARKETS[0] = featured card; MARKETS[1..6] = small cards. Series: i===0 uses FEATURED_SERIES,
// i===1 uses the live egg candles' closes, others walk(base, 40, i%3===2 ? -0.003 : 0.0025, 0.03).
export const FILTERS = ['All', 'Commodities', 'Energy', 'Compute', 'Freight', 'Macro', 'Ratio'] as const;
export const FEATURED_KPIS = { vol: '$412K', oi: '$1.9M', traders: '186' };

// featured series (deterministic, no PRNG)
export const FEATURED_SERIES = Array.from({ length: 90 }, (_, i) => {
  const t = i / 89;
  return 1.72 + 0.28 * (t * t * (3 - 2 * t)) + 0.035 * Math.sin(t * 11) + 0.02 * Math.sin(t * 23 + 1)
    - (0.035 * Math.sin(11) + 0.02 * Math.sin(24)) * t;
});
// featured volume bars: 0.2 + 0.35*(i/89) + rnd()*0.45   (90 bars, last one #808080, others #2A2A2A)

// random walk helper used everywhere (rnd = seeded PRNG)
export const walk = (rnd: () => number, base: number, n: number, drift: number, vol: number) => {
  let v = base; const a: number[] = [];
  for (let i = 0; i < n; i++) { v *= 1 + drift + (rnd() - 0.5) * vol; a.push(v); }
  const f = base / a[n - 1]; return a.map(x => x * f);
};

// Ticker: [symbol, price, changePct]. Index 0 is live (egg price, chg24 rounded to 2dp).
export const TICKER: [string, string, number][] = [
  ['PRICE-EGGS', '$2.715', 0], ['PRICE-MILK-US', '$4.12', 0.24], ['CRUDE-OIL', '$71.84', -0.62], ['GOLD', '$2,412.30', 0.31],
  ['SILVER', '$29.84', 0.48], ['NASDAQ', '$18,240.11', -0.12], ['GPU-H100', '$2.00', 0], ['ERCOT-N', '$38.40', 1.12],
  ['DRAM-DDR5', '$4.85', -0.41], ['FREIGHT-FEU', '$2,140', 0.66], ['BTC', '$64,210.00', 0.86], ['ETH', '$3,120.45', -0.33],
];

export const STATS = [
  { label: 'Markets live', value: '9', sub: 'ON MAINNET' },
  { label: 'Fee per trade', value: '~0.10%', sub: 'VS ~2%' },
  { label: 'Settlement', value: 'UMA', sub: 'OPTIMISTIC ORACLE' },
  { label: 'Custody', value: 'Your wallet', sub: 'USDC' },
  { label: 'Gas', value: '$0', sub: 'GASLESS' },
];

export const GLASS_STATS = [
  { v: '0.25 to 1%+', d: "Typical cost hidden in a bank's spread on a bespoke hedge.", x: '~0.10% FEE', tint: 'radial-gradient(circle,rgba(74,222,128,0.08),transparent 70%)' },
  { v: '~2%', d: 'Typical fee per trade on popular prediction markets.', x: '~0.10% FEE', tint: 'radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%)' },
  { v: 'Platform only', d: 'Who decides which new markets get listed on most venues.', x: 'ANYONE LISTS', tint: 'radial-gradient(circle,rgba(74,222,128,0.08),transparent 70%)' },
  { v: 'Institutions', d: "Who gets access to a bank's hedging desk.", x: 'ANYONE TRADES', tint: 'radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%)' },
];

// Hero dashboard
export const DASH_ASSETS = [ // PRICE-EGGS price/chg are live
  { sym: 'PRICE-EGGS', p: 'live', c: 'live', dot: '#F5F5F5' },
  { sym: 'GPU-H100', p: '$2.00', c: '+1.20%', col: '#4ADE80', dot: '#808080' },
  { sym: 'ERCOT-N', p: '$41.80', c: '+3.42%', col: '#4ADE80', dot: '#4ADE80' },
];
export const MY_MARKETS = [
  { sym: 'PRICE-EGGS', p: 'live', dot: '#F5F5F5' },
  { sym: 'GPU-H100', p: '$2.00', dot: '#808080' },
  { sym: 'ERCOT-N', p: '$41.80', dot: '#4ADE80' },
];
// [market, side, entry, mark, qty, decimals]; pnl = (mark-entry)*qty*(Long?1:-1)
// output: PRICE-EGGS live | GPU-H100 +$600.00 | ERCOT-N −$220.00 ; format (v>=0?'+$':'−$') + |v| with 2dp
export const POSITIONS: [string, 'Long' | 'Short', number, number | 'live', number, number][] = [
  ['PRICE-EGGS', 'Long', 2.690, 'live', 20000, 3],
  ['GPU-H100', 'Short', 2.06, 2.00, 10000, 2],
  ['ERCOT-N', 'Long', 42.35, 41.80, 400, 2],
];
// 120 barcode bars (generated with the shared rnd, see 9.3):
// x = 0.5; for i in 0..119: x = clamp(x*0.7 + 0.15 + (rnd()-0.5)*0.5, 0.18, 1)
// hi = (30<=i<=46) || (82<=i<=96) ; h = round((hi ? min(1, x+0.15) : x)*100) + '%' ; color hi ? '#D1D5DB' : '#2A2A2A'
// at <=768 render every other bar (i % 2 === 0) → 60 bars
export const DASH_DATES = ['OCT 1', 'OCT 4', 'OCT 7', 'OCT 10', 'OCT 13', 'OCT 16'];

// Network diagram nodes. Wide coords (VB 1200x600). nw = coords in the vertical layout (VB 360x640).
// wideOnly nodes are dropped below 900px (MID); only nodes with nw appear below 640px.
export const NET_NODES = [
  { id: 'imp',  n: 'Importer',       d: 'Pays for goods priced in freight it cannot hedge.',   x: 170,  y: 130, nw: [110, 380], tag: 'BESPOKE TERMS', dtag: 'OPEN LISTING' },
  { id: 'dc',   n: 'Data center',    d: 'Large power buyer. Big enough for a bank desk.',     x: 370,  y: 70,  ok: true },
  { id: 'farm', n: 'Farmer',         d: 'Exposed to crop and fertilizer prices every season.', x: 120,  y: 330, nw: [40, 510],  tag: 'CREDIT CHECK',  dtag: 'ANYONE TRADES' },
  { id: 'mine', n: 'Miner',          d: 'Margin swings with power cost and BTC price.',        x: 240,  y: 500, wideOnly: true },
  { id: 'air',  n: 'Airline',        d: 'Fuel is its largest variable cost.',                  x: 840,  y: 80,  dtag: 'ONE SIGNATURE' },
  { id: 'fund', n: 'Fund',           d: 'Has a credit line and a dealer. Gets a quote.',       x: 1060, y: 160, nw: [250, 380], ok: true },
  { id: 'ret',  n: 'Retail trader',  d: 'Wants a view on real prices. No access to a desk.',  x: 1070, y: 370, nw: [320, 510], tag: 'GEOGRAPHY',     dtag: '~0.10% FEE' },
  { id: 'smb',  n: 'Small business', d: 'Too small for a bank minimum ticket.',                x: 980,  y: 510, wideOnly: true, tag: '$ MINIMUMS' },
] as const;
export const NET_LAYOUT = {
  wide:   { vb: [1200, 600], hub: [600, 270], bank: [600, 480], usdc: [400, 500], uma: [800, 500] },
  narrow: { vb: [360, 640],  hub: [180, 96],  bank: [180, 590], usdc: [50, 225],  uma: [310, 225] },
};
export const NET_SIDE = [
  { key: 'u', title: 'USDC COLLATERAL', titleNarrow: 'USDC', d: 'Held in contracts, not by us' },
  { key: 'm', title: 'UMA ORACLE', titleNarrow: 'UMA ORACLE', d: 'Settles from public data' },
];

// Market type tables. Each row also gets a 7D spark from TBL[i] (single: 0..4, ratio: 5..9).
// TBL[i] = walk(10, 24, i%3===1 ? -0.004 : 0.004, 0.05); color green if last >= first.
const EX = 'https://dexetera.xyz/explore';
export const SINGLE_METRIC = [
  { name: 'Eggs', sym: 'PRICE-EGGS · BLS', long: 'Bakeries, food makers', short: 'Egg producers', href: 'https://dexetera.xyz/token/PRICE-EGGS' },
  { name: 'GPU compute', sym: 'GPU-H100 · $/HR', long: 'AI labs, inference cos.', short: 'GPU clouds', href: EX },
  { name: 'Regional power', sym: 'ERCOT / PJM · $/MWH', long: 'Data centers, factories', short: 'Generators', href: EX },
  { name: 'Ocean freight', sym: 'FREIGHT-FEU · $/FEU', long: 'Importers, retailers', short: 'Carriers', href: EX },
  { name: 'DRAM / NAND', sym: 'DRAM-DDR5 · $/GB', long: 'Device makers', short: 'Memory producers', href: EX },
];
export const RATIO = [
  { name: 'Power-plant margin', sym: 'POWER / GAS', long: 'Large power buyers', short: 'Gas-fired generators', href: EX },
  { name: 'BTC mining margin', sym: 'BTC / POWER', long: 'Funds, traders', short: 'Miners', href: EX },
  { name: 'Farming margin', sym: 'CROP / FERTILIZER', long: 'Food processors', short: 'Farmers', href: EX },
  { name: 'AI margin', sym: 'AI REVENUE / CHIP COST', long: 'Funds, traders', short: 'AI companies', href: EX },
  { name: 'Data-center margin', sym: 'COMPUTE / POWER', long: 'Funds, traders', short: 'GPU clouds', href: EX },
];
export const TYPE_TABLES = [
  { title: 'Single metric', count: '5', sub: 'One public number', rows: SINGLE_METRIC },
  { title: 'Ratio', count: '5', sub: 'The gap between two numbers', rows: RATIO },
];

// Who visuals: whoA = walk(100, 30, 0.004, 0.08); whoB = walk(60, 30, 0.001, 0.05); gas[i] = whoA[i]*0.62 + whoB[i]*0.2
// Creator bars: 30 values 0.25 + 0.55*(i/29) + rnd()*0.3, height min(100, v*100)%, last '#fff' else '#333'

export const PRODUCT_STATS = (last: number, open24: number, bid: number, ask: number, lastTrade: { p: number; up: boolean }) => [
  { l: 'MARK', v: '$' + last.toFixed(3), c: '#fff' },
  { l: 'LAST', v: '$' + lastTrade.p.toFixed(3), c: lastTrade.up ? '#4ADE80' : '#F87171' },
  { l: '24H CHG', v: ((last / open24 - 1) * 100 >= 0 ? '+' : '') + ((last / open24 - 1) * 100).toFixed(2) + '%', c: last >= open24 ? '#4ADE80' : '#F87171' },
  { l: 'BID', v: '$' + bid.toFixed(3), c: '#4ADE80' },
  { l: 'ASK', v: '$' + ask.toFixed(3), c: '#F87171' },
  { l: 'SPREAD', v: '0.001', c: '#fff' },
  { l: 'VOLUME', v: '$184.2K', c: '#fff' },
  { l: 'TRADES', v: '2,412', c: '#fff' },
  { l: 'TOTAL MARGIN', v: '$96.4K', c: '#fff' },
];

export const FEATURES = [ // lucide icon names
  { icon: 'activity', t: 'Live order book', d: 'Real bids, asks and liquidations.' },
  { icon: 'wallet', t: 'USDC, non-custodial', d: 'Funds stay in your wallet and contracts.' },
  { icon: 'zap', t: 'Gasless, one signature', d: 'Trade or list without paying gas.' },
  { icon: 'shield-check', t: 'Public data + UMA', d: 'Named sources, open disputes.' },
  { icon: 'sparkles', t: 'List in minutes', d: 'The AI wizard drafts the market.' },
];

// glyph: 1 → '✓' #4ADE80 ; 0 → '–' #606060 ; -1 → '✕' #F87171
export const COMPARE: { f: string; d: string; o: [string, 1 | 0 | -1][] }[] = [
  { f: 'What you trade', d: 'Any real number', o: [['Yes/no events', -1], ['Crypto only', -1], ['Real risk', 1]] },
  { f: 'Who can list', d: 'Anyone', o: [['Platform only', -1], ['Platform only', -1], ['Banks only', -1]] },
  { f: 'Who can trade', d: 'Anyone', o: [['Some regions', -1], ['Anyone', 1], ['Institutions', -1]] },
  { f: 'Who settles', d: 'Public data + UMA', o: [['The platform', -1], ['Mark price', 0], ['The bank', -1]] },
  { f: 'Who holds funds', d: 'You do', o: [['The platform', -1], ['You do', 1], ['The bank', -1]] },
  { f: 'Cost to trade', d: '~0.10%', o: [['~2%', -1], ['Varies', 0], ['0.25 to 1%+ spread', -1]] },
];
export const COMPARE_COLS = ['FEATURE', 'DEXETERA', 'PREDICTION MKTS', 'CRYPTO PERPS', 'BANKS'];

export const FAQ: [string, string][] = [
  ['How does creating a market work?', 'Describe the number in plain language. The AI wizard turns it into a market, suggests public sources to settle against, and lists it with one signature. The bond and any penalty are shown before you sign.'],
  ['How is a market settled?', 'At expiry the final value is captured from the named public source and a snapshot is saved to archive.org. Anyone can challenge it during the challenge window. Disputes escalate to UMA.'],
  ['What is UMA?', 'UMA runs an optimistic oracle. A proposed value is accepted unless someone disputes it within a set window. Disputed values are resolved by UMA token holders voting on the evidence.'],
  ['Who holds my funds?', "You do. Dexetera is non-custodial. Your USDC stays in your wallet and in the market's smart contracts. Dexetera never takes custody."],
  ['What does it cost to trade?', 'About 0.10% per trade, with no gas thanks to gasless mode. For comparison, popular prediction markets charge around 2%, and bank hedges hide 0.25 to 1% or more in the spread.'],
  ['What makes a good market?', 'A number that a public source publishes on a regular schedule, that is hard to manipulate, and that has people on both sides who care where it goes.'],
  ['Can I exit before settlement?', 'Yes. Close all or part of a position at any time against the live order book. Your P&L is realized at the price you exit.'],
  ['What happens if the data source is disputed?', "Anyone can challenge the proposed final value during the challenge window. The archived snapshot serves as the record, and UMA's oracle makes the final decision."],
];

export const FOOTER_CHIPS = ['PRICE-EGGS', 'PRICE-MILK-US', 'CRUDE-OIL', 'GOLD']; // → https://dexetera.xyz/token/{s}

export const LEDGERS = [
  { name: 'InferCo', role: 'Buys GPU compute', side: '↗ LONG', sideColor: '#4ADE80', sideBg: 'rgba(16,185,129,0.12)', sideLine: 'rgba(16,185,129,0.22)' },
  { name: 'RigCloud', role: 'Sells GPU compute', side: '↘ SHORT', sideColor: '#F87171', sideBg: 'rgba(248,113,113,0.10)', sideLine: 'rgba(248,113,113,0.22)' },
];
export const LEVERAGES = ['1x', '2x', '5x', '10x'];
export const TICKET_TABS = ['Market', 'Limit'];
```

---

## 6. Assets

### 6.1 Files

```
assets/hero_rocks.webp     1920×1080 WEBP, transparent (65.7% fully transparent), 143 KB. Two mossy boulders (left and right).
assets/dexetera-logo.png   1340×1340 PNG, opaque, 21 KB. Header logo (32×32 r6), footer logo (32×32 r6), dashboard sidebar (24×24 r5).
```

Copy both into `public/assets/` and reference them as `/assets/...`. Use `next/image` for the logo (`width={32} height={32}`). Keep the rocks as a CSS background (below); `next/image` cannot do the split-half positioning.

Remote assets (replace with `lucide-react`): `https://unpkg.com/lucide-static@0.460.0/icons/{name}.svg` for globe, arrow-up-right, panel-left, search, layout-dashboard, compass, star, activity, chevron-down, bell, mouse, wallet, zap, shield-check, sparkles.

Fonts: Google Fonts (2.2). Georgia comes from the system.

Unused uploads (references only, do not ship): `uploads/ref_synex_hero.jpg`, `uploads/ref_synex_network.jpg`, `uploads/ref_synex_network2.jpg`, `uploads/Screenshot 2026-10-16 at 11.22.04 PM.png`, `uploads/dexetera-logo-black.png`, `uploads/hero_rocks.webp` (duplicate of the asset).

### 6.2 Rocks layer positioning

The rocks are **not** `object-fit: cover`. They are two `background-image` boxes cut from the same image, scaled so each boulder's inner edge overlaps the dashboard by a set amount.

```ts
const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
const m  = (w - dashW) / 2;                 // side margin of the dashboard
const ov = T ? 70 : 20;                     // target overlap at rest
// 515 = x of the left boulder's inner edge in the 1920px source; 1300/1310 for the right one
const sc = Math.max((m + ov) / 515, D ? 0 : (w * 0.22) / 515);

LEFT  box: left 0, bottom 0, width 530*sc, height 1080*sc
           background-size `${1920*sc}px ${1080*sc}px`, background-position 0px 0px, no-repeat
           transform-origin left bottom
RIGHT box: right 0, bottom 0, width (m + ov + 10*sc), height 1080*sc
           background-size same, background-position `${-1300*sc}px 0px`
           transform-origin right bottom
layer z-index: T ? 3 (above dashboard) : 0 (behind dashboard)
pointer-events: none; aria-hidden
load:   inner layer scale(1.08) → scale(1), 1200ms cubic-bezier(.2,.7,.2,1)
scroll: outer box translateX(∓28p %) scale(1 + 0.12p)   (4.1)
```

Resolved values:

```
w     dashW   m      sc      rock box h
1440  880     280    0.680   734px
1280  880     200    0.524   566px
1024  880.6   71.7   0.437   472px   (tablet: dashW = 86vw; (71.7+70)/515 = 0.275, floor 0.22w/515 = 0.437 wins)
768   736     16     0.328   354px   (mobile: floor 0.22*768/515 = 0.328)
390   358     16     0.167   180px   (floor 0.22*390/515 = 0.167 wins over (16+20)/515)
```

(At 1024, D is false, so the 0.22w floor applies.)

---

## 7. Responsive rules per section

```
                         1440            1280            1024              768                390
Flags                    L M S D T       L M S D T       M S T (no L, D)   S only            none
Header nav               centered        centered        centered          menu button       menu button
Header English           yes             yes             no                no                no
Header Create pill       yes             yes             yes               no                no
Hero mode                sticky 180vh    sticky 180vh    sticky 180vh      static flow       static flow
Hero H1                  76px            76px            60px              44px              44px
Hero copy padding-top    96px            96px            96px              112px             112px
Dashboard width          880px           880px           880.6px (86vw)    736px (w-32)      358px
Dashboard sidebar        yes             yes             yes               no                no
Dashboard date chip      yes             yes             yes               no                no
Portfolio value          40px            40px            40px              28px              28px
Dashboard margin-top     44px            44px            44px              36px              36px
Barcode bars             120             120             120               60                60
Rocks z-index            3               3               3                 0                 0
Scroll pill              yes             yes             yes               no                no
Stage padding-bottom     0               0               0                 72px              72px
Ticker / CTA tickers     same everywhere (46px tall, J11)
Stat strip               5 cols          5 cols          5 cols            2 cols (1st spans 2) 2 cols (1st spans 2)
Trust row                one line        one line        wraps as needed   wraps             wraps
Section header           7fr / 5fr       7fr / 5fr       7fr / 5fr         stacked           stacked
Market wall grid (c4)    4 cols          4 cols          4 cols            2 cols            1 col
Featured card            span 2 × 3 rows span 2 × 3      span 2 × 3        span 2 × 1        span 1 × 1
Network stage            640px, 8 nodes  640px, 8 nodes  640px, 8 nodes    480px, 6 nodes    600px vertical, 4 nodes
                         fs 13           fs 13           fs 13             fs 17             fs 11, no tags
Glass stats (c4)         4 cols          4 cols          4 cols            2 cols            1 col
Stepper (c4)             4 cols          4 cols          4 cols            2 cols            1 col
GPU ledgers              2 cols          2 cols          2 cols            2 cols            1 col
GPU chart height         260px           260px           225px (22vw)      180px (min)       180px
Market tables            2 cols          2 cols          1 col             1 col             1 col (h-scroll at 580px)
Who cards (c4)           4 cols          4 cols          4 cols            2 cols            1 col
Terminal body            1fr 230 270     1fr 230 270     2 cols, chart full width   2 cols    1 col
Notes row (c3)           3 cols          3 cols          3 cols            1 col             1 col
Features (c5)            5 cols          5 cols          5 cols            1 col             1 col
Comparison               5/7, sticky     5/7, sticky     stacked, h-scroll stacked, h-scroll  stacked, h-scroll
Creators                 5/7             5/7             stacked           stacked           stacked
FAQ                      5/7             5/7             stacked           stacked           stacked
Footer                   2fr + 3         2fr + 3         2fr + 3           2 cols            1 col
```

---

## 8. Suggested Next.js mapping

```
app/
  layout.tsx            fonts (next/font), <body> classes, globals.css
  page.tsx              server component; composes sections in the order of §1
  globals.css           §2.1 globals + keyframes + reduced-motion rule
components/
  Header.tsx                     client (scroll state, width, menu)
  hero/Hero.tsx                  client (refs, sequence)
  hero/HeroCopy.tsx              client (load stagger) — forwardRef
  hero/DashboardMock.tsx         client (live egg price) — forwardRef
  hero/Rocks.tsx                 client (geometry from width) — forwardRef ×2
  hero/ScrollPill.tsx            client — forwardRef
  Ticker.tsx                     client (live egg item, hover pause)
  StatStrip.tsx                  server
  TrustRow.tsx                   server
  markets/MarketWall.tsx         client (filter, live series)
  markets/FeaturedCard.tsx       client
  markets/MarketCard.tsx         client
  network/RiskNetwork.tsx        client (mode, cycle, hover, IO)
  network/GlassStatCard.tsx      server
  how/Stepper.tsx                client (auto-advance)
  example/GpuExample.tsx         client (slider)
  types/MarketTables.tsx         server (sparks are pure SVG; reveal handled globally)
  who/WhoCards.tsx               client (ownerFees ticks)
  product/ProductTerminal.tsx    client (book, trades, ticket, candle hover)
  product/CandleChart.tsx        client
  compare/ComparisonTable.tsx    server
  creators/CreatorDashboard.tsx  client (ownerFees)
  faq/FaqAccordion.tsx           client
  FinalCta.tsx                   client (tickers)
  Footer.tsx                     server; StatusBar inside it (server, CSS pulse)
  charts/AreaSpark.tsx           server-safe pure SVG (area(), smooth())
hooks/
  useViewport.ts           { w, h } from window, SSR default { w: 1440, h: 800 }
  usePrefersReducedMotion.ts
  useScrollProgress.ts     rAF-throttled scrollY + progress for a ref'd element; writes styles imperatively
  useLiveMarket.ts         context provider: candles, book, trades, series, flash, ownerFees; 1500ms tick
  useRevealOnScroll.ts     global [data-reveal]/[data-spark] observer + 1500ms fail-safe
  useInView.ts             one-shot IntersectionObserver (network autoplay)
lib/
  data.ts                  §5
  prng.ts                  seeded Park–Miller (seed 11) + walk()
  format.ts                money(), col(), fmtP()
```

Notes:

- **One shared PRNG and one shared live-market context.** The egg price must be one source used by the hero dashboard, ticker, market card and terminal. Put `useLiveMarket` in a provider in `page.tsx`, wrapped in a client boundary.
- **Imperative scroll styles.** Do not put scroll progress in React state (it would re-render the page every frame). Write `style.transform` / `style.opacity` on refs inside rAF, as the source does. Only `scrolled` (header) goes into state, and only when it changes.
- **SSR and hydration.** The source assumes `w = 1440` before mount. Render the 1440 layout on the server and correct it after hydration, or move layout switches to CSS media queries (breakpoints in §2.4) wherever no JS geometry is involved. Rocks geometry, dashboard width and network layout need JS (or CSS `calc()` with `vw` for the rocks).
- **CSS-only candidates:** ticker marquee, status-bar pulse, stepper caret blink, grid/noise backgrounds, glass cards, hover states, most responsive grids (use Tailwind arbitrary values such as `grid-cols-[minmax(0,7fr)_minmax(0,5fr)]`).
- **Reveal:** the source puts `data-reveal` on section roots and sets inline styles from a global observer. In React, prefer a `<Reveal>` wrapper component, but keep the same numbers (8px, 400ms, rootMargin −6%, fail-safe 1500ms).
- **Network diagram:** build it as JSX SVG. Keep the element `key`s stable (`tl{id}`, `dl{id}`, `n{id}`) so CSS transitions run, and give the traveling dot `key={netI}` so it remounts per step.

---

## 9. Known gaps, TODOs, and differences

### 9.1 No README spec in the project

There is no README or spec file in this project. The page was specified in chat. The closest reference points are the earlier design `Dexetera Landing.dc.html` (v1, superseded) and the Synex reference images in `uploads/`. Nothing in §1–8 depends on them.

### 9.2 Inconsistencies in the current file (reproduce, or fix on purpose)

1. **Comparison sticky header offset is stale.** The table header uses `top:57px` (the old header height). With the 72px fixed header it slides under the header by 15px. It should be `top:72px`.
2. **Comparison left column** uses sticky `top:96px`; consider 88px to match the anchor offset.
3. **Sections without anchors:** Example, Market types, Who, Comparison, Creators and Final CTA have no `id` and no `scroll-margin-top`.
4. **Glass stat footers** use per-card values (`~0.10% FEE`, `~0.10% FEE`, `ANYONE LISTS`, `ANYONE TRADES`), not "DEXETERA: ~0.10% FEE" on all four.
5. **Network stage height on phones** is 600px (vertical layout), not 480px.
6. **Rocks drift** is ±28% (asked for ±24%). 28% was used because the 1.12 scale grows each rock back inward from its outer edge.
7. **Hero headline position**: the copy starts 96px from the top of the page (tablet and up) and 112px on mobile.
8. **Header nav** has no FAQ link (FAQ is reachable from the footer). The mobile menu likewise lists Markets, How it works, Product, Docs, Create a market.
9. **Unused keyframes** `dx-roll-in`, `dx-roll-out`, `dx-barpulse` remain in the CSS; drop them.

### 9.3 Seeded data depends on call order

All "random" data uses one Park–Miller generator seeded at 11, consumed in this order inside the constructor (each step consumes values before the next starts):

```
1. 44 egg candles (3 rnd per candle + wick)        cs
2. walk() for MARKETS[1..6] series (40 steps each)  series
3. featVol (90)                                      featured volume
4. tbl: 10 × walk(10, 24, ...)                       table sparks
5. gpuNoise (60)                                     unused
6. bars (30)                                         creator bars
7. tailNoise (160)                                   unused (old hero), still consumed
8. dBars (120)                                       hero barcode
9. whoA, whoB                                        Who visuals
10. makeBook(2.715), seedTrades(2.715)               initial book and trades
then: live ticks, stepSpark walk (re-generated on every render)
```

To reproduce the exact bar shapes and sparks, keep this order, including the unused `gpuNoise` and `tailNoise` draws. If exact shapes don't matter, generate each dataset from its own seed.

Also note: `stepSpark` calls `walk()` inside render, so it changes on every re-render (every 1500ms tick). Generate it once in the rebuild.

### 9.4 Dead code in the source (do not port)

`tagLines`, `litLabels`, `tailNoise`, `gpuNoise`, the `heroHover` state, and the `tagI/tagPrev/tagN/lit/litN` state are left over from earlier hero versions. `heroCols`, `termCols` and `ticketCols` are computed but no longer used.

### 9.5 Other TODOs

- Replace the unpkg Lucide `<img>` icons with `lucide-react`.
- Every link to the app (`dexetera.xyz/...`) is a plain URL; confirm the routes before launch.
- The Live toggle, date range, bell, search and sidebar items in the hero dashboard are decorative. Only "My markets" collapses.
- The Market/Limit ticket tabs and the 15M/1H/4H/1D chart intervals are visual only.
- The "Settles" date color `#D4A017` is the only amber in the system; keep it.
- Copy guardrails used throughout: no em dashes in copy, and never describe Dexetera as regulated, licensed or compliant.
