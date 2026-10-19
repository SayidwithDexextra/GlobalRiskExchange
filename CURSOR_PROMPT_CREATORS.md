# Dexetera: Creators earn 20% section + three copy edits

The installer copied this pack into `design/creators/`. Make ONLY the changes below. Do not redesign, restyle or move anything else. No em dashes in any copy.

## 1. Replace the "Creators earn" section on the landing page
- Copy `design/creators/drop-in/CreatorsEarn.tsx` and `design/creators/drop-in/creators.css` into the repo's landing components folder (wherever the current Creators section component lives, e.g. `components/landing/`). Keep both files together; the component imports `./creators.css`.
- Replace the current Creators section (the one with the DRAM-DDR5 "MY MARKETS" example card and "Build a market, earn from every trade") with `<CreatorsEarn />`, in the same position on the page (after "Why Dexetera", before the FAQ).
- Delete the old Creators component and any code only it used (for example the DRAM creator fee counter, if nothing else uses it). If the "Who it's for" DATA OWNERS card still uses a shared creator-fee counter, leave that counter in place for that card.
- The component uses the existing theme tokens (`--card --line --line2 --hair --bg --t1 --t3 --t4 --t-gray --green --btn-p-bg --btn-p-fg --btn-p-hover`) and the Manrope / JetBrains Mono fonts already on the site. Do not hardcode colors. If a token name differs in this repo, map it to the equivalent existing token rather than adding new colors.
- If the project needs "use client" components to live in a specific folder or forbids global CSS imports from components, move the CSS import to the landing page or convert creators.css to a CSS module, keeping every class and value identical.

## 2. Copy edits (text only, nothing else in these sections changes)
- Who it's for, card 03 DATA OWNERS, description becomes exactly:
  `If you know a number and where it is published, the wizard turns it into a market in minutes. You earn 20% of its trading fees.`
- FAQ "How does creating a market work?" answer becomes exactly:
  `Describe the number in plain language. The AI wizard turns it into a market, suggests public sources to settle against, and lists it with one signature. The bond and any penalty are shown before you sign. Creators earn 20% of the trading fees their market generates.`
- FAQ "What does it cost to trade?" answer becomes exactly:
  `About 0.10% per trade, with no gas thanks to gasless mode. 20% of that fee goes to the market's creator. For comparison, popular prediction markets charge around 2%, and bank hedges hide 0.25 to 1% or more in the spread.`
- Search the whole site for any other creator fee wording ("a share of trading fees", "creator fee share", "80%", "12 months") and make it say 20% of trading fees, ongoing. Report every place you changed.

## 3. Must match the design exactly
- Reference screenshots: `design/creators/reference/creators_<width>_<theme>.jpg` at 360, 390, 430, 768, 1100, 1280, 1440 in dark and light.
- Section height at each width (must match within 2px): 360 = 1175, 390 = 1126, 430 = 1081, 768 = 913, 1100 = 662, 1280 = 666, 1440 = 669 (card capped at 1344 wide).
- Layout: stacked (text on top, calculator below) under 1100px; side by side 5:7 at 1100px and up. Under 640px the four equation cells wrap 2 per row and the × / = signs hide.
- Calculator: 9 stops $1M, $2M, $5M, $10M, $25M (default), $50M, $100M, $250M, $500M. monthly = volume × 0.001 × 0.20, yearly = monthly × 12. Default shows $5,000 / month and $60,000 / year. $500M shows $100,000 / month and $1,200,000 / year.
- The "+ Create a market" button is the plain primary pill (no gradient) linking to https://dexetera.xyz/new-market.
- The original design markup is in `design/creators/creators.source.html` and the full page in `design/source/Dexetera Landing v2.dc.html` if anything is unclear.

## When done
- Run the build and fix any type or lint errors.
- Check the landing page at 360, 390, 768, 1280 and 1440 in dark and light. No horizontal scroll.
- Commit with message "Creators earn 20% section" and push to the branch Vercel deploys from.
- Reply with the files changed, the commit hash, and one line per item above confirming it is done.
