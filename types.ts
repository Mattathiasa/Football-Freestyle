export interface HighlightStats {
  power: number;
  speed: number;
  control: number;
}

export interface Highlight {
  id: string;
  title: string;
  category: 'Match' | 'Training' | 'Skills' | '1v1' | 'Pingball' | 'Lemon' | 'Warmup' | 'Recap' | 'Basketball' | 'Full Video' | 'Milestone';
  tags: string[];
  videoUrl: string;
  thumbnail: string;
  description?: string;
  stats?: HighlightStats;
  date?: string; // Date in YYYY-MM-DD format
  rating?: number; // Star rating from 1 to 5
  skillType?: string; // e.g., "Juggling", "Control", "Trick Shot", "First Touch"
  surface?: string; // e.g., "Concrete", "Turf", "Indoor", "Grass"
  progressTag?: 'Early' | 'Mid' | 'Recent'; // Development timeline
  featured?: boolean; // Included in the cinematic featured reel
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  passAccuracy: string;
}

// Performance Data Types
export interface PerformanceData {
  age: number;
  year: number;
  goals: number;
  assists: number;
  successfulDribbles: number;
  minutesPlayed: number;
  matchRating: number;
  overallScore: number;
}

export interface HeatmapData {
  x: number;
  y: number;
  touches: number;
  passes: number;
  dribbles: number;
  zone: string;
}

export interface ShotData {
  x: number;
  y: number;
  foot: 'left' | 'right';
  outcome: 'goal' | 'on-target' | 'miss';
  xG: number;
}

export interface FootEfficiency {
  foot: 'left' | 'right';
  shotAccuracy: number;
  goalConversion: number;
  power: number;
  curve: number;
  firstTouchShots: number;
}

// ── Season cards (FIFA-style) ─────────────────────────────────────────────

/** The six face stats printed on the front of a card. */
export type FaceStat = 'PAC' | 'SHO' | 'PAS' | 'DRI' | 'DEF' | 'PHY';

/**
 * Detailed attributes, 1-99. Face stats are averages of these, the same way
 * the real game derives them, so you only ever edit this level.
 */
export interface SeasonAttributes {
  // Pace
  acceleration: number;
  sprintSpeed: number;
  // Shooting
  finishing: number;
  shotPower: number;
  longShots: number;
  // Passing
  vision: number;
  shortPassing: number;
  crossing: number;
  // Dribbling
  agility: number;
  balance: number;
  ballControl: number;
  dribbling: number;
  // Defending
  interceptions: number;
  standingTackle: number;
  // Physical
  jumping: number;
  stamina: number;
  strength: number;
}

export interface SeasonCard {
  /** Calendar year this card covers. */
  year: number;
  /** Position printed under the rating, e.g. "CAM". */
  position: string;
  /** Short line for the back of the card: what defined this year. */
  headline: string;
  /** Longer note shown in the detail view. */
  story: string;
  attributes: SeasonAttributes;
  /** 1-5. Freestyle is mostly skill moves, so this one matters here. */
  skillMoves: number;
  /** 1-5. */
  weakFoot: number;
  /** Highlight id whose thumbnail becomes the card portrait. */
  portraitClipId?: string;
  /** Extra highlight ids to pin to this season even if they carry no date. */
  clipIds?: string[];
}

export type CardTier = 'bronze' | 'silver' | 'gold' | 'peak';

/** Where a season sits in the career arc, derived from the ratings. */
export type CareerPhase = 'rise' | 'peak' | 'decline' | 'current';
