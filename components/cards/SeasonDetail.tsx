import React, { Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Highlight } from '../../types';
import { ATTRIBUTE_LABELS, FACE_STATS, FACE_STAT_GROUPS, RatedSeason } from '../../lib/seasonRatings';
import SeasonCardFace, { TIER_SKIN } from './SeasonCardFace';
import StarRating from '../StarRating';

const VideoPlayer = React.lazy(() => import('../VideoPlayer'));

const PHASE_LABEL: Record<RatedSeason['phase'], string> = {
  rise: 'Rising',
  peak: 'Peak season',
  decline: 'Decline',
  current: 'Current form',
};

const Delta: React.FC<{ value: number | null }> = ({ value }) => {
  if (value === null || value === 0) {
    return <span className="font-mono text-[11px] text-white/40 w-10 text-right">{value === 0 ? '±0' : ''}</span>;
  }
  const up = value > 0;
  return (
    <span className={`font-mono text-[11px] font-bold w-10 text-right ${up ? 'text-[#CCFF00]' : 'text-[#FF6B6B]'}`}>
      <span aria-hidden="true">{up ? '▲' : '▼'}</span>
      <span className="sr-only">{up ? 'up' : 'down'}</span>
      {Math.abs(value)}
    </span>
  );
};

const ClipTile: React.FC<{ clip: Highlight; onOpen: () => void }> = ({ clip, onOpen }) => (
  <button
    onClick={onOpen}
    className="group relative aspect-[9/11] overflow-hidden rounded-xl bg-black border border-white/10 hover:border-[#CCFF00] transition-colors text-left"
    aria-label={`Play ${clip.title}`}
  >
    <img src={clip.thumbnail} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-2.5">
      <div className="font-mono text-[10px] text-[#CCFF00] uppercase tracking-widest">{clip.category}</div>
      <div className="font-display text-sm font-black text-white leading-tight line-clamp-2">{clip.title}</div>
    </div>
  </button>
);

interface SeasonDetailProps {
  seasons: RatedSeason[];
  index: number;
  undated: Highlight[];
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SeasonDetail: React.FC<SeasonDetailProps> = ({ seasons, index, undated, onIndexChange, onClose }) => {
  const season = seasons[index];
  const prev = index > 0 ? seasons[index - 1] : null;
  const [activeClip, setActiveClip] = useState<Highlight | null>(null);
  const [showUndated, setShowUndated] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset scroll + undated toggle when flipping between seasons
  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 });
    setShowUndated(false);
  }, [index]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      opener?.focus?.();
    };
  }, []);

  // Keyboard: Esc closes, arrows flip seasons, Tab stays inside. All of it is
  // handed to the video player while a clip is open.
  useEffect(() => {
    if (activeClip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1);
      else if (e.key === 'ArrowRight' && index < seasons.length - 1) onIndexChange(index + 1);
      else if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeClip, index, seasons.length, onClose, onIndexChange]);

  const { card } = season;
  const accent = season.tier === 'peak' ? '#CCFF00' : TIER_SKIN[season.tier].bg.match(/#[0-9a-f]{6}/i)?.[0] ?? '#CCFF00';

  // Portalled to <body>: <main> is its own z-10 stacking context, so anything
  // rendered inside it sits under the fixed z-50 nav regardless of z-index.
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${card.year} season card`}
      className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
                {PHASE_LABEL[season.phase]}
              </span>
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest">
                {TIER_SKIN[season.tier].label} card
              </span>
            </div>
            <h3 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
              {card.year} <span className="text-white/40">{card.headline}</span>
            </h3>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close season card"
            className="shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-[#CCFF00] hover:text-black text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14">
          {/* Card + season switcher */}
          <div className="flex flex-col items-center gap-6">
            <SeasonCardFace season={season} size="lg" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => onIndexChange(index - 1)}
                disabled={index === 0}
                aria-label="Previous season"
                className="w-10 h-10 rounded-full border border-white/15 text-white disabled:opacity-25 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
              >
                ←
              </button>
              <span className="font-mono text-xs text-white/60 tracking-widest w-24 text-center">
                {index + 1} / {seasons.length}
              </span>
              <button
                onClick={() => onIndexChange(index + 1)}
                disabled={index === seasons.length - 1}
                aria-label="Next season"
                className="w-10 h-10 rounded-full border border-white/15 text-white disabled:opacity-25 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
              >
                →
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-[300px]">
              <div>
                <dt className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">Skill moves</dt>
                <dd><StarRating rating={card.skillMoves} size="md" /></dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">Weak foot</dt>
                <dd><StarRating rating={card.weakFoot} size="md" /></dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">Overall</dt>
                <dd className="flex items-center gap-2 font-display text-2xl font-black text-white not-italic">
                  {season.ovr} <Delta value={season.delta} />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">Clips</dt>
                <dd className="font-display text-2xl font-black text-white not-italic">{season.clips.length}</dd>
              </div>
            </dl>
          </div>

          {/* Story + attributes */}
          <div>
            <p className="text-white/75 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">{card.story}</p>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
              {FACE_STATS.map(stat => (
                <section key={stat} aria-label={FACE_STAT_GROUPS[stat].label}>
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-2 mb-3">
                    <h4 className="font-display text-lg font-black text-white tracking-wide">
                      {FACE_STAT_GROUPS[stat].label}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-black text-white not-italic">{season.face[stat]}</span>
                      <Delta value={prev ? season.face[stat] - prev.face[stat] : null} />
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {FACE_STAT_GROUPS[stat].keys.map(key => {
                      const v = card.attributes[key];
                      return (
                        <li key={key} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                          <div>
                            <div className="flex justify-between font-mono text-[11px] uppercase tracking-wider text-white/70 mb-1">
                              <span>{ATTRIBUTE_LABELS[key]}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-[#CCFF00]" style={{ width: `${v}%` }} />
                            </div>
                          </div>
                          <span className="font-mono text-sm font-bold text-white w-7 text-right">{v}</span>
                          <Delta value={prev ? v - prev.card.attributes[key] : null} />
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>

            {/* Clips */}
            <section className="mt-14" aria-label={`${card.year} clips`}>
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
                <h4 className="font-display text-2xl md:text-3xl font-black text-white">
                  {card.year} footage <span className="text-white/40">({season.clips.length})</span>
                </h4>
                {undated.length > 0 && (
                  <button
                    onClick={() => setShowUndated(v => !v)}
                    aria-expanded={showUndated}
                    className="font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white/15 text-white/70 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
                  >
                    {showUndated ? 'Hide' : 'Show'} undated clips ({undated.length})
                  </button>
                )}
              </div>

              {season.clips.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {season.clips.map(clip => (
                    <ClipTile key={clip.id} clip={clip} onOpen={() => setActiveClip(clip)} />
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  No dated footage from {card.year} in the archive yet.
                </p>
              )}

              {showUndated && (
                <div className="mt-8">
                  <p className="font-mono text-[11px] text-white/50 uppercase tracking-widest mb-4">
                    Clips without a recorded date
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {undated.map(clip => (
                      <ClipTile key={clip.id} clip={clip} onOpen={() => setActiveClip(clip)} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {activeClip && (
        <Suspense fallback={null}>
          <VideoPlayer highlight={activeClip} onClose={() => setActiveClip(null)} />
        </Suspense>
      )}
    </div>,
    document.body
  );
};

export default SeasonDetail;
