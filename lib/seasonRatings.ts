import { CardTier, CareerPhase, FaceStat, Highlight, SeasonAttributes, SeasonCard } from '../types';

/** Which detailed attributes roll up into each face stat. */
export const FACE_STAT_GROUPS: Record<FaceStat, { label: string; keys: (keyof SeasonAttributes)[] }> = {
  PAC: { label: 'Pace', keys: ['acceleration', 'sprintSpeed'] },
  SHO: { label: 'Shooting', keys: ['finishing', 'shotPower', 'longShots'] },
  PAS: { label: 'Passing', keys: ['vision', 'shortPassing', 'crossing'] },
  DRI: { label: 'Dribbling', keys: ['agility', 'balance', 'ballControl', 'dribbling'] },
  DEF: { label: 'Defending', keys: ['interceptions', 'standingTackle'] },
  PHY: { label: 'Physical', keys: ['jumping', 'stamina', 'strength'] },
};

export const FACE_STATS = Object.keys(FACE_STAT_GROUPS) as FaceStat[];

export const ATTRIBUTE_LABELS: Record<keyof SeasonAttributes, string> = {
  acceleration: 'Acceleration',
  sprintSpeed: 'Sprint Speed',
  finishing: 'Finishing',
  shotPower: 'Shot Power',
  longShots: 'Long Shots',
  vision: 'Vision',
  shortPassing: 'Short Passing',
  crossing: 'Crossing',
  agility: 'Agility',
  balance: 'Balance',
  ballControl: 'Ball Control',
  dribbling: 'Dribbling',
  interceptions: 'Interceptions',
  standingTackle: 'Standing Tackle',
  jumping: 'Jumping',
  stamina: 'Stamina',
  strength: 'Strength',
};

/**
 * How much each face stat counts towards the overall, per position. Rough
 * shape of how the game weights them; every row sums to 1.
 */
const POSITION_WEIGHTS: Record<string, Record<FaceStat, number>> = {
  CAM: { PAC: 0.08, SHO: 0.17, PAS: 0.22, DRI: 0.38, DEF: 0.02, PHY: 0.13 },
  ST: { PAC: 0.15, SHO: 0.38, PAS: 0.07, DRI: 0.25, DEF: 0.0, PHY: 0.15 },
  CM: { PAC: 0.05, SHO: 0.1, PAS: 0.35, DRI: 0.25, DEF: 0.12, PHY: 0.13 },
  LW: { PAC: 0.2, SHO: 0.18, PAS: 0.15, DRI: 0.37, DEF: 0.0, PHY: 0.1 },
  RW: { PAC: 0.2, SHO: 0.18, PAS: 0.15, DRI: 0.37, DEF: 0.0, PHY: 0.1 },
};

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const clamp = (n: number) => Math.max(1, Math.min(99, Math.round(n)));

export const faceStats = (a: SeasonAttributes): Record<FaceStat, number> =>
  Object.fromEntries(
    FACE_STATS.map(s => [s, clamp(avg(FACE_STAT_GROUPS[s].keys.map(k => a[k])))])
  ) as Record<FaceStat, number>;

export const overall = (card: SeasonCard): number => {
  const weights = POSITION_WEIGHTS[card.position] ?? POSITION_WEIGHTS.CAM;
  const face = faceStats(card.attributes);
  return clamp(FACE_STATS.reduce((sum, s) => sum + face[s] * weights[s], 0));
};

export const tierFor = (ovr: number, isPeak: boolean): CardTier => {
  if (isPeak) return 'peak';
  if (ovr >= 75) return 'gold';
  if (ovr >= 65) return 'silver';
  return 'bronze';
};

export interface RatedSeason {
  card: SeasonCard;
  ovr: number;
  face: Record<FaceStat, number>;
  tier: CardTier;
  phase: CareerPhase;
  /** Overall change from the previous season; null for the first card. */
  delta: number | null;
  clips: Highlight[];
}

/** Year a clip belongs to: its date, or failing that a 4-digit year in its title. */
export const clipYear = (clip: Highlight): number | null => {
  if (clip.date) return Number(clip.date.slice(0, 4));
  const m = clip.title.match(/\b(20[1-3]\d)\b/);
  return m ? Number(m[1]) : null;
};

/**
 * Rate every season and place it in the career arc. The peak is the highest
 * overall (latest wins a tie); everything after it that is lower is decline;
 * the last card is always "current" so the latest form is never hidden.
 */
export const rateSeasons = (cards: SeasonCard[], highlights: Highlight[]): RatedSeason[] => {
  const sorted = [...cards].sort((a, b) => a.year - b.year);
  const ovrs = sorted.map(overall);
  const peakOvr = Math.max(...ovrs);
  const peakIndex = ovrs.lastIndexOf(peakOvr);
  const lastIndex = sorted.length - 1;

  return sorted.map((card, i) => {
    const pinned = new Set(card.clipIds ?? []);
    const clips = highlights.filter(h => pinned.has(h.id) || clipYear(h) === card.year);
    let phase: CareerPhase = i < peakIndex ? 'rise' : i === peakIndex ? 'peak' : 'decline';
    if (i === lastIndex && i !== peakIndex) phase = 'current';
    return {
      card,
      ovr: ovrs[i],
      face: faceStats(card.attributes),
      tier: tierFor(ovrs[i], i === peakIndex),
      phase,
      delta: i === 0 ? null : ovrs[i] - ovrs[i - 1],
      clips,
    };
  });
};

/** Clips no season can claim, so the detail view can still surface them. */
export const unplacedClips = (seasons: RatedSeason[], highlights: Highlight[]): Highlight[] => {
  const placed = new Set(seasons.flatMap(s => s.clips.map(c => c.id)));
  return highlights.filter(h => !placed.has(h.id));
};

/** How far the latest card sits below the peak; 0 when the latest is the peak. */
export const dropFromPeak = (seasons: RatedSeason[]): number => {
  const peak = seasons.find(s => s.phase === 'peak');
  const last = seasons[seasons.length - 1];
  return peak && last ? peak.ovr - last.ovr : 0;
};
