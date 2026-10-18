# Dexetera site: Developer Handoff v2 (current)

Exported from Claude Design on 18 Oct 2026. This file describes the site **as it is now**. It supersedes `HANDOFF_v1_detailed.md` wherever the two differ. v1 is still the best section-by-section spec for the landing page body (component inventory, copy, data, animations), so read it for detail, but trust this file for: theme, tokens, nav, links, email, storm, Whitepaper, Contact, mobile.

Source of truth order:
1. `source/*.dc.html` (exact markup, styles, logic)
2. this file
3. `HANDOFF_v1_detailed.md`
4. `rendered/*.html` (static DOM snapshots, dark, 1440px) and `reference/*.jpg` (visual targets)

Target stack: Next.js 15 App Router, TypeScript, Tailwind CSS, `next/font/google`, `lucide-react`.

---

## 1. How to read the source files

`.dc.html` is Claude Design's own format. Each file has:
- `<helmet>`: head content (fonts, `<style>` blocks with tokens, theme script).
- Template markup using `<sc-if value="{{ x }}">`, `<sc-for>` and `{{ }}` bindings, mostly inline styles.
- `<script type="text/x-dc" data-dc-script>`: a `Component` class with `state`, lifecycle methods and `renderVals()`, which computes every `{{ }}` value from state and `window.innerWidth`.

It runs on `support.js` (loads React 18.3.1, ReactDOM and Babel from unpkg). To view it as designed:

```
cd design/source && python3 -m http.server 8765
# open http://localhost:8765/Dexetera%20Landing%20v2.dc.html   (needs internet)
```

Port the template into JSX components and the `renderVals()` logic into hooks. Inline style values are the spec; convert to Tailwind arbitrary values or CSS modules, but keep the numbers.

---

## 2. Pages and routes

| Route | Source file | `<title>` | Notes |
|---|---|---|---|
| `/` | `Dexetera Landing v2.dc.html` | none in source. Suggested: `Dexetera | The marketplace for risk` (confirm with owner) | Hero storm, scroll-sequence hero, 13 sections |
| `/whitepaper` | `Whitepaper.dc.html` | `Whitepaper | Dexetera` | Long-form with sticky contents |
| `/contact` | `Contact.dc.html` | `Contact | Dexetera` | Form + contact cards |

Rewrite cross-page links: `Dexetera Landing v2.dc.html#markets` → `/#markets`, `Whitepaper.dc.html` → `/whitepaper`, `Contact.dc.html` → `/contact`.

No favicon, Open Graph image or meta description exists yet. Use `assets/dexetera-logo.png` as the favicon placeholder and flag OG as a TODO.

### Landing page section map (1440px wide, dark)

| # | Section | Anchor | data-screen-label | Top (px) |
|---|---|---|---|---|
| 0 | Header (fixed, 72px) | | | 0 |
| 1 | Hero (scroll sequence, 1620px tall) | `#top` | Hero | 0 |
| 2 | Ticker strip | | | 1620 |
| 3 | Stat strip | | | 1666 |
| 4 | Trust row | | | 1745 |
| 5 | Market wall | `#markets` | Market wall | 1822 |
| 6 | How risk moves today (network) | | Problem | 2727 |
| 7 | How it works | `#how` | How it works | 3799 |
| 8 | GPU example | | Example | 4364 |
| 9 | Market types | | Market types | 5340 |
| 10 | Who it's for | | Who it's for | 5923 |
| 11 | Product terminal (NINO34-DEC26) | `#product` | Product | 6543 |
| 12 | Why Dexetera (comparison) | | Why Dexetera | 7834 |
| 13 | Creators earn | | Creators | 8290 |
| 14 | FAQ | `#faq` | FAQ | 8792 |
| 15 | Final CTA | | Final CTA | 9536 |
| 16 | Footer + status bar | | Footer | 10049 |

Total height ≈ 10,400px. Keep `data-screen-label` attributes; they help QA.

---

## 3. Links and contact (final, all verified live)

| Purpose | URL |
|---|---|
| Launch app / brand home | `https://dexetera.xyz` |
| Create a market (all "Create a market" buttons) | `https://dexetera.xyz/new-market` |
| Explore markets | `https://dexetera.xyz/explore` |
| Watchlist | `https://dexetera.xyz/watchlist` |
| Market cards | `https://dexetera.xyz/token/PRICE-EGGS`, `https://dexetera.xyz/token/NINO34-DEC26` |
| Docs (content links only, see below) | `https://doc.dexetera.org` |
| Terms / Privacy | `https://dexetera.org/dexetera-tos.html`, `https://dexetera.org/dexetera-privacy.html` |
| Discord | `https://discord.com/invite/ntVTBwhTd` |
| X | `https://x.com/dexeteralabs` |
| Email (everywhere) | `mailto:admin@dexetera.xyz` |

Rules:
- **Docs is NOT in the navigation** on any page: not in the header, the mobile menu or the footer nav. It appears only in content: the Contact page "Documentation" card, and the landing FAQ ("Docs →", "Read the docs").
- **Never use** `app.dexetera.xyz`, `doc.dexetera.xyz` or `support@dexetera.xyz`. They do not exist. (v1 and the old Cursor prompt mention them; ignore that.)

---

## 4. Design tokens and theme

Full token file: `tokens/theme.css` (copied verbatim from the landing source; the landing set is a superset of the Whitepaper/Contact sets). Put it in `app/globals.css` and map Tailwind colors to the variables (e.g. `bg: 'var(--bg)'`, `t1: 'var(--t1)'`). Never hard-code a hex that has a token.

Key values:

| Token | Dark | Light |
|---|---|---|
| `--bg` | #0A0A0B | #FAFAFA |
| `--card / --card2 / --card3` | #0F0F0F / #141414 / #1A1A1A | #FFFFFF / #F4F4F5 / #EDEDED |
| `--line..--line4` | #222 / #2A2A2A / #333 / #404040 | #E5E5E5 / #DADADA / #D4D4D4 / #A3A3A3 |
| `--t1..--t5` | #FFF / #A1A1A1 / #808080 / #606060 / #5C5C5C | #0A0A0B / #404040 / #595959 / #737373 / #A3A3A3 |
| `--green / --red` | #4ADE80 / #F87171 | #16A34A / #DC2626 |
| `--amber / --violet / --blue` | #FACC15 / #8B5CF6 / #3B82F6 | #CA8A04 / #7C3AED / #2563EB |
| `--hdr-glass` | rgba(10,10,11,.78) | rgba(250,250,250,.82) |
| Primary button | white pill, black text | black pill, white text |
| `--rock-filter` | none | saturate(.9) brightness(1.08) |
| `--hero-ts` | none | text halo `0 0 24px #FAFAFA, 0 0 48px #FAFAFA` |

### Theme behavior
- Default **dark**. Stored in `localStorage['dx-theme']` (`'light' | 'dark'`). Applied as `<html data-theme="...">`.
- No flash: inject the theme script from the source `<helmet>` as an inline script at the top of `<head>` in `app/layout.tsx` (`dangerouslySetInnerHTML`, before paint) and put `suppressHydrationWarning` on `<html>`.
- `window.dxToggleTheme()` flips the theme, adds class `theme-anim` to `<html>` for 350ms (0.3s color transitions on everything), saves to localStorage and updates every `.theme-toggle` aria-label ("Switch to light mode" / "Switch to dark mode"). Port it as a `useTheme` hook with the same behavior.
- Toggle button: 34px circle, `.theme-toggle` CSS in `tokens/theme.css`, moon and sun inline SVGs (copy from the header markup), sits directly left of "Create a market" on all three pages.

### Fonts
- Manrope 400/500/600/700 (body, headings), JetBrains Mono 400/500/600 (numbers, labels, tickers). Load with `next/font/google`, expose as CSS variables.
- Wordmark "DEXETERA": Georgia serif, 500, 12px, letter-spacing .04em, uppercase.

---

## 5. Header and navigation (all pages identical)

- Fixed, top 0, height 72px, z-index 40, inner max-width 1344px. Background goes from transparent to `--hdr-glass` + backdrop blur once scrolled (see `hdrBg/hdrLine/hdrBlur` in renderVals).
- Left: 32px logo (`assets/dexetera-logo.png`, radius 6) + wordmark, links to `/#top` (or `#top` on landing).
- Center nav (landing: width > 1100, see `hdrNav`; check the equivalent value in each page's renderVals): `MARKETS` (/#markets) · `HOW IT WORKS` (/#how) · `PRODUCT` (/#product) · `WHITEPAPER` (/whitepaper) · `CONTACT` (/contact). 11px, 600, letter-spacing .08em, uppercase, gap 28px.
- Right: `English` (globe icon, decorative, shows ≥1180px) · theme toggle · `Create a market` (secondary pill, shows ≥1000px) · `Launch app` (primary pill with icon chip).
- Mobile (≤1100px when open): `Menu` button opens a full-width panel under the header with the same nav items plus Create a market. Same on Whitepaper and Contact (added this round). Reference: `reference/*_390_dark_menu-open.jpg`.

Footer nav mirrors the header (no Docs), plus Terms, Privacy, Discord, X and the admin@ email.

---

## 6. Hero storm (landing only)

Minimal lightning: thin hairline bolts, rare, from the side lanes. No candlesticks, no grid, no colored haze.

- File: `source/assets/dx-storm-minimal.js` (vanilla, no deps). Port it as-is to `components/HeroStorm.tsx` (`'use client'`), wrapping the function body in a `useEffect` and returning its cleanup. Do not "improve" the timing or look.
- Markup: `<canvas class="dx-storm" aria-hidden="true">` placed inside the hero stage **after the grain div and before the copy block**; `position:absolute; inset:0; z-index:0; pointer-events:none`. Init once: `dxStorm(canvas.parentElement, canvas)`.
- Layering in the hero stage: storm 0 → copy 1 → dashboard 2 → rocks 3 (rocks drop to 0 at ≤768px) → scroll pill 4.
- Behavior: a strike every 3.2 to 6.5s; x only in side lanes (0.5 ± 0.27 to 0.45 of width, never behind the headline); starts at y = 84px + 4 to 22px (below the header); ends at 45 to 78% of hero height; a branch 60% of the time; 1.25px core (white in dark, rgba(64,64,64) in light) with a 6px faint green or red halo and a soft cloud glow centered 130px below the start. Respects `prefers-reduced-motion`, pauses when off screen or the tab is hidden, DPR aware.
- Whitepaper and Contact have no storm.

---

## 7. Contact page (`/contact`)

- Hero: eyebrow pill "CONTACT", two-tone headline "Tell us the risk. / We'll help you price it.", subcopy, min-height 100vh, same rock art, sizing and parallax as the landing hero, `--hero-ts` halo in light mode.
- Left card "Send a message / How can we help?": topic chips (single select): Hedging a risk, Creating a market, Providing liquidity, Partnerships, Press, Other. Fields: `name` (Jane Smith), `email` (jane@company.com), `company` optional, `metric` optional "Metric or exposure" (e.g. Niño 3.4, ERCOT power, GPU rates), `message` (What moves your costs or revenue...). Submit shows an inline success state.
- **No backend yet.** The source has a TODO to POST to `/api/contact`. Build `app/api/contact/route.ts` that validates and returns 200, with a clear TODO for the mail provider (send to admin@dexetera.xyz). Do not invent credentials.
- Validation: inline errors ("Please add your name.", "Please add a valid email.", "Please add a short message."), privacy line, "Prefer email? Write to admin@dexetera.xyz." Success state: "Message sent. Thanks for reaching out..." with "Send another".
- Right column cards: Email admin@dexetera.xyz (Hedging, markets, partnerships) · X / Twitter @dexeteralabs · Documentation doc.dexetera.org (this card stays). Then a 3-step "What happens next" block and a "Questions" FAQ accordion.
- References: `reference/contact_*`.

## 8. Whitepaper page (`/whitepaper`)

- Same header, footer, tokens and hero treatment as landing.
- Two-column body: sticky contents rail (`position:sticky; top:104px; max-height:calc(100vh - 128px)`) + article. On mobile the rail collapses and the article is one column (`grid-template-columns: minmax(0,1fr)`); wide tables and diagrams scroll inside their own wrapper so the page never scrolls sideways.
- Anchors: `#summary #vision #protocol #problem #opportunity #onchain #links #existing #customers`. Use `scroll-margin-top: 88px`.
- Full source text of the whitepaper: `source/whitepaper_source_text.txt` (copy in the .dc.html is the edited, final wording; use that).
- In the "Links" section the app row reads `dexetera.xyz` (fixed in this kit; the live Claude Design file still says "app.dexetera.xyz").

---

## 9. Breakpoints and layout (unchanged from v1)

```ts
const L = w >= 1100, M = w >= 900, S = w >= 640;   // sections
const D = w > 1024, T = w > 768;                    // hero (strict)
const showCreate = w >= 1000, showLang = w >= 1180; // header
const NW = w < 640, MID = !NW && w < 900;           // network diagram
// tailwind screens: { s:'640px', m:'900px', create:'1000px', hd:'1025px', l:'1100px', lang:'1180px', ht:'769px' }
```

Container: max-width 1344, padding-inline `clamp(16px,3vw,32px)`. Section padding top `clamp(56px,7vw,88px)`. Hero rocks: `assets/hero_rocks.webp`, JS-positioned with scroll parallax (see `rockLRef/rockRRef` in the source).

---

## 10. Fix these on purpose (do not copy the bug)

1. Comparison table sticky header uses `top:57px`; use `top:72px` (header height).
2. Drop unused keyframes `dx-roll-in`, `dx-roll-out`, `dx-barpulse`.
3. Do not port dead code: `tagLines`, `litLabels`, `tailNoise`, `gpuNoise`, `heroHover`, `tagI/tagPrev/tagN/lit/litN`, `heroCols/termCols/ticketCols`.
4. `stepSpark` is regenerated each render; generate it once.
5. Replace the unpkg `lucide-static` `<img>` icons with `lucide-react` components (same names, same sizes; tint via `currentColor` instead of CSS invert filters).
6. Seeded data: keep the Park–Miller RNG seeded at 11 and the draw order in v1 §9.3 if exact chart shapes must match the screenshots; otherwise give each dataset its own seed.
7. Decorative only (no logic needed): English switch, hero dashboard Live toggle, date range, bell, search, sidebar items, ticket Market/Limit tabs, chart intervals.

## 11. Copy rules (enforce in review)

- No em dashes anywhere. USD only.
- Never say "regulated", "licensed" or "compliant".
- Dexetera is the platform; markets are contracts listed on it.
- No investor material on public pages (TAM, raise amount, incorporation).
- Creators: say "a share of trading fees", no percentage.

## 12. Acceptance checklist

- [ ] Each page matches `reference/` side by side at 1440, 1280, 1024, 768 and 390, dark and light (where provided): spacing, type sizes, colors, borders, radii.
- [ ] Theme persists across reloads and pages with no flash; toggle animates colors only.
- [ ] Storm: side lanes only, never over the header or headline, off with reduced motion.
- [ ] `document.documentElement.scrollWidth === innerWidth` at 390px on all pages.
- [ ] Mobile menu works on all three pages.
- [ ] Every link matches §3; no Docs in any nav; no app./doc.dexetera.xyz; no support@.
- [ ] Anchors land below the fixed header.
- [ ] Lighthouse: no layout shift from fonts (next/font), images have width/height.
- [ ] Grep the build for `—`, "regulated", "licensed", "compliant": zero hits.
