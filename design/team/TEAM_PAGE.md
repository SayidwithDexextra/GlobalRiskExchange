# Team page (`/team`): handoff spec

Source of truth: `design/source/Team.dc.html` (Claude Design export, 18 Oct 2026). The page is plain HTML with class-based CSS, like Contact and Whitepaper, so it ports 1:1 without converting to Tailwind.

## What is ready to use

| File | Use |
|---|---|
| `drop-in/TeamPage.tsx` | Finished client component: hero with rock parallax, two team cards, CTA strip. 1:1 port of the design. |
| `drop-in/teamData.ts` | All team content (names, roles, bios, tags, links, optional photo). Edit here only. |
| `drop-in/team.css` | Styles scoped under `.dx-team`. Generated from the design's own CSS. |
| `drop-in/page.tsx` | Route file for `app/team/page.tsx` with title "Team \| Dexetera". |
| `team.preview.html` | The original design page. Serve the repo root and open `/design/team/team.preview.html`. |
| `team.scoped-preview.html` | Same page built from `team.css` + markup, to prove the scoped CSS is exact. |
| `team.body.html`, `team.css` | Plain markup and CSS with app routes, if you prefer not to use the drop-in. |
| `reference/` | Full-page screenshots at 1440, 1024, 768, 390 in dark and light, plus 2x close-ups (header nav, each card, CTA strip, footer). |
| `measurements.json` | Box sizes of hero, cards, avatar, strip and footer at each width. |

## Verified

- The drop-in was built in a real Next.js 14 app and screenshotted against the design: **0.000% pixel difference** at 1440 and 390, dark and light (header and footer hidden in both, since the site supplies its own).
- `team.css` scoped preview vs original: 0.000% difference at 1440, both themes.
- TypeScript strict type check passes.

## Layout (1440 wide)

- Hero (compact): 379px tall. Mono "TEAM" chip, H1 76px "The people building Dexetera.", lede. Same rock images as the other pages (`/assets/hero_rocks.webp` via `--rocks`) with the same scroll parallax (disabled at 768 and below and with reduced motion).
- Team grid: 2 equal columns, gap 24, container 1280 wide. One column at 800px and below.
- Card: `--card` background, 1px `--line`, radius 16, padding 40 (24 at 720 and below), gap 24. Hover: border `--line2` and a 2px lift, 200ms.
- Avatar: 96px rounded square (radius 20), `--card2`, inset 1px `--line2` ring, initials Manrope 600 28px. 72px at 720 and below. Photo replaces the initials when `photo` is set.
- Name 26px/600, role JetBrains Mono 11px, letter spacing .14em, `--t4`. Bio 15px/1.65, `--t3`, max 520. Tags 28px pills. Social row with a hairline top border, 36px round icon buttons.
- CTA strip: radius 16, padding 28 40. Buttons "Get in touch" to `/contact` (primary) and "Read the whitepaper" to `/whitepaper` (secondary). Buttons go full width at 720 and below.
- Page height with header and footer: 1329 at 1440, 1348 at 1024, 1850 at 768, 2309 at 390.

## Site-wide nav change

A "Team" link to `/team` is added in three places on every page:
- the header nav, between Whitepaper and Contact
- the mobile menu, same position
- the footer Company column, first item

On Whitepaper the footer column is titled "Community", and Team is first there. The updated source pages are in `design/source/`. On `/team` itself the header link gets the active style, the same way the current page is highlighted on Contact and Whitepaper.

## Content rules

No em dashes. USD only. Never "regulated", "licensed" or "compliant". No investor or fundraising language on public pages. Email is admin@dexetera.xyz.
