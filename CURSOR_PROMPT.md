# Paste this into Cursor (Agent mode)

You are rebuilding the Dexetera marketing site pixel for pixel in this repo as a Next.js 15 App Router app (TypeScript, Tailwind CSS, next/font/google, lucide-react). The design is finished; your job is faithful replication, not redesign.

## Read first, in this order (source of truth wins on conflict)
1. `design/source/Dexetera Landing v2.dc.html`, `design/source/Whitepaper.dc.html`, `design/source/Contact.dc.html`: exact markup, inline styles and logic (`Component` class inside `<script data-dc-script>`; `renderVals()` holds every responsive value).
2. `design/HANDOFF.md` (v2, current: theme, tokens, nav, links, storm, Contact, Whitepaper, fixes, checklist).
3. `design/HANDOFF_v1_detailed.md` (deep landing spec). Where it mentions Docs in the nav, support@, app.dexetera.xyz or "no CSS variables", it is outdated; follow v2.
4. `design/rendered/*.html`: static DOM snapshots (dark, 1440px) you can open offline to inspect computed structure.
5. `design/reference/*.jpg` + `INDEX.md`: visual targets at 1440/1280/1024/768/390, dark and light.

## Pages
- `/` landing, `/whitepaper`, `/contact`. Shared `Header`, `Footer`, `MobileMenu`, `ThemeToggle`.

## Non-negotiables
- Tokens: use `design/tokens/theme.css` verbatim in `app/globals.css`; map Tailwind colors to the CSS variables. No hard-coded hex where a token exists.
- Theme: default dark, `localStorage['dx-theme']`, `<html data-theme>`, inline no-flash script in `<head>`, `suppressHydrationWarning`, `theme-anim` class for 350ms on toggle.
- Hero storm: port `design/source/assets/dx-storm-minimal.js` unchanged into a client component (`useEffect` + cleanup). Canvas z-index 0 under copy (1), dashboard (2), rocks (3, or 0 at ≤768px).
- Nav: Markets, How it works, Product, Whitepaper, Contact. **No Docs in any nav** (header, mobile menu, footer). Docs only in content links to `https://doc.dexetera.org`.
- Links exactly as HANDOFF v2 §3. Email is `admin@dexetera.xyz` everywhere. Never use app.dexetera.xyz, doc.dexetera.xyz or support@.
- Copy: keep wording from the source exactly. No em dashes, never "regulated/licensed/compliant", USD only.
- Mobile: no horizontal scroll at 390px on any page; menu on all pages.
- Apply the deliberate fixes in HANDOFF v2 §10 (sticky top 72px, no dead code, lucide-react, etc.).
- Contact form: build `app/api/contact/route.ts` that validates and returns 200 with a TODO for the mail provider. No invented secrets.

## Build order
1. Scaffold, fonts, tokens, theme script + toggle, Header/Footer/MobileMenu. Check against references.
2. Landing hero (scroll sequence, dashboard, rocks parallax, storm).
3. Landing sections 2 to 16 in order, one component each, comparing to `reference/landing_*` after each.
4. Whitepaper (sticky contents, anchors).
5. Contact (form, states, cards, API stub).
6. Light theme pass on all pages, then 1280/1024/768/390 passes.
7. Run the acceptance checklist in HANDOFF v2 §12 and report results.

## Definition of done
Every item in HANDOFF v2 §12 passes, and side-by-side screenshots (Playwright, same widths and themes as `reference/`) show no visible layout, spacing, type or color differences apart from animated content.

**Before writing code: read the files above, then reply with your plan (component tree, Tailwind config, how you'll port renderVals and the storm) and any questions. Wait for my "go".**
