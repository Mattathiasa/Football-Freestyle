import React from 'react';
import { CardTier } from '../../types';
import { FACE_STATS, RatedSeason } from '../../lib/seasonRatings';
import { CARD_NAME } from '../../data/seasonCards';
import { HIGHLIGHTS } from '../../constants';

/** Card skins. Kept here (not in Tailwind) because they are multi-stop gradients. */
export const TIER_SKIN: Record<CardTier, { bg: string; ink: string; muted: string; rule: string; label: string }> = {
  bronze: {
    bg: 'linear-gradient(160deg, #e3ad7c 0%, #b97a4c 45%, #7c4a2b 100%)',
    ink: '#2a160a',
    muted: 'rgba(42,22,10,0.72)',
    rule: 'rgba(42,22,10,0.25)',
    label: 'Bronze',
  },
  silver: {
    bg: 'linear-gradient(160deg, #f1f4f6 0%, #b9c2ca 45%, #7d8893 100%)',
    ink: '#1b2229',
    muted: 'rgba(27,34,41,0.72)',
    rule: 'rgba(27,34,41,0.22)',
    label: 'Silver',
  },
  gold: {
    bg: 'linear-gradient(160deg, #fbe7a1 0%, #e2b84c 45%, #a37624 100%)',
    ink: '#2b1d03',
    muted: 'rgba(43,29,3,0.72)',
    rule: 'rgba(43,29,3,0.22)',
    label: 'Gold',
  },
  peak: {
    bg: 'radial-gradient(120% 90% at 50% 0%, #2b3a05 0%, #0d1200 55%, #050505 100%)',
    ink: '#CCFF00',
    muted: 'rgba(255,255,255,0.78)',
    rule: 'rgba(204,255,0,0.35)',
    label: 'Prime',
  },
};

/** FIFA-style shield: flat top corners cut, pointed base. */
const SHIELD =
  'polygon(12% 0, 88% 0, 100% 7%, 100% 82%, 50% 100%, 0 82%, 0 7%)';

interface SeasonCardFaceProps {
  season: RatedSeason;
  /** 'sm' for the timeline row, 'lg' for the detail view. */
  size?: 'sm' | 'lg';
}

const SeasonCardFace: React.FC<SeasonCardFaceProps> = ({ season, size = 'sm' }) => {
  const { card, ovr, face, tier } = season;
  const skin = TIER_SKIN[tier];
  const portraitId = card.portraitClipId ?? season.clips[0]?.id;
  const portrait = HIGHLIGHTS.find(h => h.id === portraitId)?.thumbnail;
  const lg = size === 'lg';

  return (
    <div
      className={`relative select-none ${lg ? 'w-[260px] sm:w-[300px]' : 'w-[200px] sm:w-[220px]'} aspect-[2/3]`}
      style={{ filter: tier === 'peak' ? 'drop-shadow(0 0 24px rgba(204,255,0,0.35))' : 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))' }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: SHIELD, background: skin.bg }}>
        {/* Portrait */}
        {portrait ? (
          <img
            src={portrait}
            alt=""
            loading="lazy"
            className="absolute right-0 top-[5%] w-[70%] h-[45%] object-cover"
            style={{
              maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
            }}
          />
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute right-[6%] top-[9%] w-[56%] h-[38%]"
            style={{ color: skin.rule }}
          >
            <circle cx="50" cy="32" r="18" fill="currentColor" />
            <path d="M14 100c0-22 16-38 36-38s36 16 36 38z" fill="currentColor" />
          </svg>
        )}

        {/* Sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 45%, transparent 60%)' }}
        />

        {/* Rating block */}
        <div className="absolute left-[9%] top-[9%] flex flex-col items-center leading-none" style={{ color: skin.ink }}>
          <span className={`font-display font-black not-italic ${lg ? 'text-6xl' : 'text-5xl'}`}>{ovr}</span>
          <span className={`font-display font-bold not-italic mt-1 ${lg ? 'text-xl' : 'text-lg'}`}>{card.position}</span>
          <span className="h-[1px] w-8 my-2" style={{ background: skin.rule }} />
          <span className="font-mono font-bold text-[11px] tracking-widest">'{String(card.year).slice(2)}</span>
        </div>

        {/* Name + stats */}
        <div className="absolute left-0 right-0 top-[49%] px-[12%]" style={{ color: skin.ink }}>
          <div className={`font-display font-black text-center tracking-wide not-italic ${lg ? 'text-2xl' : 'text-xl'}`}>
            {CARD_NAME}
          </div>
          <div className="h-[1px] my-1.5" style={{ background: skin.rule }} />
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {FACE_STATS.map(stat => (
              <div key={stat} className="flex items-baseline justify-center gap-1.5">
                <span className={`font-display font-black not-italic ${lg ? 'text-xl' : 'text-lg'}`}>{face[stat]}</span>
                <span className="font-mono font-bold text-[11px]" style={{ color: skin.muted }}>
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonCardFace;
