<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Season cards

One FIFA-style card per year, from the first clip (2018) to now, with the
career arc (rise → peak → decline → current) worked out from the numbers.

**Everything you edit lives in `data/seasonCards.ts`.** Per season:

- `attributes` — 17 ratings, 1-99 (acceleration, sprint speed, finishing,
  shot power, long shots, vision, short passing, crossing, agility, balance,
  ball control, dribbling, interceptions, standing tackle, jumping, stamina,
  strength).
- `skillMoves`, `weakFoot` — 1-5 stars.
- `headline`, `story` — the words on the card and in its detail view.
- `portraitClipId` — which highlight's thumbnail is the card photo.
- `clipIds` — pin undated highlights to this season.

You never type a face stat or overall. `lib/seasonRatings.ts` derives
PAC/SHO/PAS/DRI/DEF/PHY as averages of their attributes, the overall from
those (weighted by position), the card colour (bronze < 65 ≤ silver < 75 ≤
gold), and which season is the peak (highest overall, Prime card), which are
decline, and which is current (always the latest year).

**Clips land on a season automatically** when the highlight in
`constants.tsx` has a `date`, or a year in its title. Most highlights have
neither yet, so they appear under "Show undated clips" on every card. Add a
`date` (or a `clipIds` pin) to move a clip onto its year.

To add next year: copy the last season block, bump `year`, re-rate.
`npm run check` fails if a year repeats or is skipped, a rating is outside
1-99, or a clip id doesn't exist.
