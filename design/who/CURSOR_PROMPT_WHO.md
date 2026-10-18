# Cursor prompt: fix the "Who it's for" section (mobile)

On mobile, the landing page's "Who it's for" section ("For anyone with exposure to a number.") has charts that overflow the screen and look misplaced. The design itself is correct at every width. The current implementation is not.

**Fix it by replacing the section with the verified drop-in in `design/who/drop-in/`.** Do not patch the old code and do not redesign anything.

Read first:
- `design/who/WHO_SECTION.md`: the spec and the mobile rules.
- `design/who/drop-in/WhoItsFor.tsx` and `who.css`: finished code, checked against the design.
- `design/who/reference/`: 2x screenshots of the design at 360, 390, 430, 640, 768, 900, 1024 and 1440.

Do this without stopping for confirmation:

1. **Find the current section.** Search the repo for "For anyone with exposure to a number" or "Who it's for". Note its component file and where the landing page renders it.
2. **Install the drop-in.** Move `WhoItsFor.tsx` and `who.css` into the folder this repo uses for landing sections (for example `components/landing/`). Render `<WhoItsFor />` in exactly the spot where the old section was, between the same neighbours. Keep the class names and CSS values as they are, and do not convert them to Tailwind.
3. **Remove the old section** component and any chart helper used only by it. Leave shared helpers alone.
4. **Check that nothing else breaks mobile.** No `width` or `min-width` in px on the section or its parents, and no `w-screen` or `100vw` wrappers. The page must not scroll sideways at 360px.
5. If the landing page has a scroll-reveal system that uses `data-reveal`, the section already carries the attribute. Otherwise nothing is needed.

The mobile rules that caused the bug (already handled in the drop-in, keep them):
- Every grid track is `minmax(0,1fr)`, never `1fr` or a fixed width, and every card has `min-width:0`.
- Each chart is an SVG with `viewBox="0 0 200 60"`, `preserveAspectRatio="none"`, `width:100%`, `height:100%` and `vector-effect="non-scaling-stroke"` on every line. It sits inside a chart box that is a fixed 128px tall at every width. No fixed px width on any SVG, no `aspect-ratio` on it, and no chart library.
- Layout: 1 column below 640px, 2 columns from 640 to 899px, 4 columns from 900px.

Acceptance (check each one in the browser and report the numbers):
- At 390px wide: one column, cards 358px wide starting 16px from the left edge, each chart exactly inside its card, section about 1673px tall, and no horizontal scroll (`document.documentElement.scrollWidth === 390`).
- At 360px: same, cards 328px wide, no horizontal scroll.
- At 768px: two columns, cards 355px wide. At 1024px: four columns, cards 232px wide. At 1440px: four columns, cards 311px wide, section about 620px tall.
- It looks the same as `design/who/reference/who_<width>_<theme>_2x.jpg` at those widths, in dark and light.
- The creator-fees number counts up slowly, and doesn't when reduced motion is on.
- `npm run build` passes.

When done, list the files you created, changed and deleted.
