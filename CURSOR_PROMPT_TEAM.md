# Cursor prompt: add the Team page

Add the new Team page at `/team` so it is a pixel-exact match of the design, and link it from the site navigation. Everything is already prepared in `design/team/`. Do not redesign anything.

Read first:
1. `design/team/TEAM_PAGE.md`: the spec and what each file is for.
2. `design/team/drop-in/`: finished, verified code (`TeamPage.tsx`, `teamData.ts`, `team.css`, `page.tsx`).
3. `design/team/reference/`: screenshots at 1440, 1024, 768, 390 in dark and light, plus 2x close-ups.

Do this without stopping for confirmation:

1. **Install the drop-in.** Move `TeamPage.tsx`, `teamData.ts` and `team.css` into the components folder this repo uses (suggested `components/team/`). Put `page.tsx` at `app/team/page.tsx`, or `src/app/team/page.tsx` if the repo uses `src/`. Fix the import path in `page.tsx` to match (use the repo's alias if `@/` is not configured). Do not change the markup, class names or CSS values. `team.css` is scoped under `.dx-team` and is pixel-identical to the design. Do not convert it to Tailwind.
2. **Header and footer.** Use the site's existing shared header and footer, the same way the Contact and Whitepaper routes get them. Do not render a second header or footer inside `TeamPage`.
3. **Add "Team" to the navigation on every page:**
   - header nav, between Whitepaper and Contact
   - mobile menu, same position
   - footer Company column (titled "Community" on Whitepaper), first item, above Contact
   On `/team` the header Team link uses the same active style the current page gets on Contact and Whitepaper. `design/source/Team.dc.html` and the other updated `.dc.html` files show the exact markup.
4. **Assets.** The page uses `/assets/hero_rocks.webp`, the same rocks as the other pages. The installer already copied it into `public/assets/` if it was missing. Check that the hero rocks show.
5. **Fonts and theme.** Manrope and JetBrains Mono come from the existing layout. Theme follows `<html data-theme>` with the `dx-theme` localStorage key, dark by default, which the site already handles.

Acceptance (check and report each):
- At 1440 wide, `/team` matches `design/team/reference/team_1440_dark.jpg` and `team_1440_light.jpg`: hero 379px tall, two cards 628px wide with a 24px gap, CTA strip below, total page height about 1329px with the site header and footer.
- At 390 wide, it matches `team_390_dark.jpg` and `team_390_light.jpg`: one column, 72px avatars, full-width buttons, no horizontal scroll.
- Close-ups match `reference/detail_*_2x.png`: type sizes, mono role label, tag pills, social buttons, borders and radii.
- The Team link appears in the header, mobile menu and footer on Home, Whitepaper, Contact and Team, and is active on `/team`.
- "Get in touch" goes to `/contact`, "Read the whitepaper" to `/whitepaper`, and the LinkedIn and X icons open in a new tab.
- `npm run build` passes with no type errors.

Content rules: no em dashes, USD only, never "regulated", "licensed" or "compliant", no investor language. To change names, bios or photos later, edit `teamData.ts` only.

When done, list the files you created or changed and anything that does not match the references.
