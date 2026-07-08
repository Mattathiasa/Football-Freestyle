import { Highlight } from '../../types';

/**
 * Picks the clips for the cinematic featured reel.
 * Prefers explicitly flagged clips; falls back to rating >= 4 so the reel
 * never breaks if the flags are edited away in constants.tsx.
 * Ranked by rating (then recency) to pick, then re-sorted chronologically
 * because a reel reads better as a timeline.
 */
export function getFeaturedClips(all: Highlight[], max = 8): Highlight[] {
  const flagged = all.filter(h => h.featured);
  const pool = flagged.length >= 6 ? flagged : all.filter(h => (h.rating ?? 0) >= 4);

  return pool
    .slice()
    .sort(
      (a, b) =>
        (b.rating ?? 0) - (a.rating ?? 0) ||
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
    )
    .slice(0, max)
    .sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime());
}
