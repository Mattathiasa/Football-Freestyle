import { SeasonCard } from '../types';

/**
 * SEASON CARDS — one per year, 2018 to now.
 *
 * ⚠ DRAFT RATINGS. These numbers were drafted from what the archive shows
 * (first clip in 2018, documentation starting in 2020, the 2024 50th-video
 * and recap year, 2025's Lomi battle, no dated clips yet in 2026). They are
 * a starting shape, not a measurement. Edit them to match how you actually
 * rate yourself for each year.
 *
 * You only edit `attributes`, `skillMoves` and `weakFoot`. Face stats
 * (PAC/SHO/PAS/DRI/DEF/PHY), the overall, the card colour, "peak",
 * "decline" and "current" are all computed from them in lib/seasonRatings.ts,
 * so changing one number re-ranks the whole career automatically.
 *
 * Clips: every highlight with a `date` in constants.tsx lands on its year's
 * card automatically. Undated clips can be pinned to a year via `clipIds`.
 */
/** Name printed across every card. */
export const CARD_NAME = 'MATTY';

export const SEASON_CARDS: SeasonCard[] = [
  {
    year: 2018,
    position: 'CAM',
    headline: 'First footage',
    story:
      'The earliest clip in the archive, AU 2018. Raw touch, mostly solo fundamentals. Everything after this is built on these reps.',
    skillMoves: 3,
    weakFoot: 2,
    portraitClipId: 'matty-au-2018',
    attributes: {
      acceleration: 70, sprintSpeed: 68,
      finishing: 54, shotPower: 58, longShots: 50,
      vision: 56, shortPassing: 58, crossing: 50,
      agility: 68, balance: 66, ballControl: 64, dribbling: 63,
      interceptions: 34, standingTackle: 30,
      jumping: 58, stamina: 60, strength: 50,
    },
  },
  {
    year: 2019,
    position: 'CAM',
    headline: 'Quiet build',
    story:
      'No dated footage from this year. Rated as a steady step up from 2018. Replace this note with what this year actually was.',
    skillMoves: 3,
    weakFoot: 2,
    attributes: {
      acceleration: 73, sprintSpeed: 71,
      finishing: 58, shotPower: 62, longShots: 54,
      vision: 61, shortPassing: 63, crossing: 54,
      agility: 72, balance: 70, ballControl: 69, dribbling: 68,
      interceptions: 36, standingTackle: 32,
      jumping: 60, stamina: 64, strength: 54,
    },
  },
  {
    year: 2020,
    position: 'CAM',
    headline: 'Lockdown origin',
    story:
      'Covid year and the first video ever posted. Documentation starts here, and so does the habit of filming every session.',
    skillMoves: 4,
    weakFoot: 2,
    portraitClipId: 'matty-first-video',
    attributes: {
      acceleration: 75, sprintSpeed: 73,
      finishing: 62, shotPower: 66, longShots: 58,
      vision: 66, shortPassing: 68, crossing: 58,
      agility: 77, balance: 75, ballControl: 76, dribbling: 74,
      interceptions: 37, standingTackle: 33,
      jumping: 62, stamina: 66, strength: 57,
    },
  },
  {
    year: 2021,
    position: 'CAM',
    headline: 'Technique year',
    story:
      'Skill development focus. Ball control and close dribbling become the strongest part of the game.',
    skillMoves: 4,
    weakFoot: 3,
    portraitClipId: 'matty-2021',
    attributes: {
      acceleration: 78, sprintSpeed: 75,
      finishing: 66, shotPower: 70, longShots: 62,
      vision: 70, shortPassing: 72, crossing: 61,
      agility: 81, balance: 79, ballControl: 81, dribbling: 79,
      interceptions: 38, standingTackle: 34,
      jumping: 64, stamina: 69, strength: 61,
    },
  },
  {
    year: 2022,
    position: 'CAM',
    headline: 'Sharpening',
    story:
      'No dated footage from this year. Rated as the bridge between the technique year and the 2023 breakout. Replace with what really happened.',
    skillMoves: 4,
    weakFoot: 3,
    attributes: {
      acceleration: 80, sprintSpeed: 77,
      finishing: 70, shotPower: 73, longShots: 66,
      vision: 74, shortPassing: 75, crossing: 64,
      agility: 84, balance: 81, ballControl: 84, dribbling: 82,
      interceptions: 39, standingTackle: 35,
      jumping: 66, stamina: 72, strength: 64,
    },
  },
  {
    year: 2023,
    position: 'CAM',
    headline: 'Breakout',
    story:
      'Sessions in any weather, rain clips included. Volume goes up and so does consistency.',
    skillMoves: 5,
    weakFoot: 3,
    portraitClipId: 'matty-basketball-rain',
    attributes: {
      acceleration: 82, sprintSpeed: 79,
      finishing: 74, shotPower: 77, longShots: 70,
      vision: 78, shortPassing: 78, crossing: 67,
      agility: 87, balance: 84, ballControl: 88, dribbling: 86,
      interceptions: 40, standingTackle: 36,
      jumping: 68, stamina: 75, strength: 67,
    },
  },
  {
    year: 2024,
    position: 'CAM',
    headline: 'Prime',
    story:
      'The densest year in the archive: the 50th video, Experiment 47, the basketball trick-shot sessions and a full year recap. This is the standard.',
    skillMoves: 5,
    weakFoot: 3,
    portraitClipId: 'matty-experiment-47',
    attributes: {
      acceleration: 84, sprintSpeed: 81,
      finishing: 79, shotPower: 81, longShots: 75,
      vision: 82, shortPassing: 81, crossing: 70,
      agility: 90, balance: 87, ballControl: 92, dribbling: 90,
      interceptions: 41, standingTackle: 37,
      jumping: 70, stamina: 78, strength: 70,
    },
  },
  {
    year: 2025,
    position: 'CAM',
    headline: 'The dip',
    story:
      'Lomi Battle 2, then fewer sessions. The touch is still there but sharpness and fitness start to slip.',
    skillMoves: 5,
    weakFoot: 3,
    portraitClipId: 'matty-lomi-battle-2',
    attributes: {
      acceleration: 81, sprintSpeed: 78,
      finishing: 76, shotPower: 79, longShots: 72,
      vision: 81, shortPassing: 80, crossing: 69,
      agility: 86, balance: 84, ballControl: 90, dribbling: 86,
      interceptions: 40, standingTackle: 36,
      jumping: 67, stamina: 71, strength: 69,
    },
  },
  {
    year: 2026,
    position: 'CAM',
    headline: 'Now',
    story:
      'No dated clips yet this year. Pace and stamina are the first things to go without volume; control and vision hold. The comeback card is next.',
    skillMoves: 5,
    weakFoot: 3,
    attributes: {
      acceleration: 77, sprintSpeed: 75,
      finishing: 73, shotPower: 77, longShots: 70,
      vision: 80, shortPassing: 79, crossing: 68,
      agility: 82, balance: 82, ballControl: 88, dribbling: 83,
      interceptions: 39, standingTackle: 35,
      jumping: 64, stamina: 65, strength: 68,
    },
  },
];
