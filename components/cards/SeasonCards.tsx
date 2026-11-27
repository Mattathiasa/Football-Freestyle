import React, { useMemo, useRef, useState } from 'react';
import { HIGHLIGHTS } from '../../constants';
import { SEASON_CARDS } from '../../data/seasonCards';
import { dropFromPeak, rateSeasons, RatedSeason, unplacedClips } from '../../lib/seasonRatings';
import SeasonCardFace from './SeasonCardFace';
import CareerArc from './CareerArc';
import SeasonDetail from './SeasonDetail';
import { usePrefersReducedMotion } from '../showcase/useReducedMotion';

const Ribbon: React.FC<{ season: RatedSeason }> = ({ season }) => {
  const { phase, delta } = season;
  if (phase === 'peak') {
    return <span className="px-2 py-0.5 bg-[#CCFF00] text-black font-mono text-[10px] font-bold uppercase tracking-widest">Peak</span>;
  }
  if (phase === 'current') {
    return <span className="px-2 py-0.5 bg-white text-black font-mono text-[10px] font-bold uppercase tracking-widest">Now</span>;
  }
  if (delta === null) {
    return <span className="px-2 py-0.5 border border-white/20 text-white/60 font-mono text-[10px] uppercase tracking-widest">Debut</span>;
  }
  const up = delta > 0;
  return (
    <span className={`px-2 py-0.5 border font-mono text-[10px] font-bold uppercase tracking-widest ${up ? 'border-[#CCFF00]/40 text-[#CCFF00]' : 'border-[#FF6B6B]/50 text-[#FF6B6B]'}`}>
      {up ? '▲' : '▼'} {Math.abs(delta)}
    </span>
  );
};

const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: string }> = ({ label, value, sub }) => (
  <div className="glass rounded-2xl px-5 py-4">
    <div className="font-mono text-[10px] text-white/55 uppercase tracking-[0.3em] mb-2">{label}</div>
    <div className="font-display text-4xl md:text-5xl font-black text-white leading-none">{value}</div>
    {sub && <div className="font-mono text-[11px] text-white/55 uppercase tracking-widest mt-2">{sub}</div>}
  </div>
);

const SeasonCards: React.FC = () => {
  const seasons = useMemo(() => rateSeasons(SEASON_CARDS, HIGHLIGHTS), []);
  const undated = useMemo(() => unplacedClips(seasons, HIGHLIGHTS), [seasons]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  if (seasons.length === 0) return null;

  const peak = seasons.find(s => s.phase === 'peak')!;
  const now = seasons[seasons.length - 1];
  const drop = dropFromPeak(seasons);

  const scrollRow = (dir: 1 | -1) =>
    rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.8, behavior: reducedMotion ? 'auto' : 'smooth' });

  return (
    <section id="cards" className="relative bg-obsidian border-t border-white/5 py-20 md:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-hex opacity-5 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="w-8 md:w-12 h-[2px] bg-[#CCFF00]" />
          <span className="text-[#CCFF00] font-mono tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold uppercase">
            Ultimate Team
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white mb-6">
          Season <br />
          <span className="text-white/40">Cards</span>
        </h2>
        <p className="text-white/65 max-w-2xl text-base md:text-lg mb-12">
          One card per year, {seasons[0].card.year} to {now.card.year}. The rise, the peak, the dip and where it stands now.
          Open a card for every attribute and the footage from that season.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
          <Stat label="Peak" value={peak.ovr} sub={`${peak.card.year} · ${peak.card.headline}`} />
          <Stat label="Now" value={now.ovr} sub={`${now.card.year} · ${now.card.headline}`} />
          <Stat label="Off peak" value={drop > 0 ? `−${drop}` : '0'} sub={drop > 0 ? 'Overall points' : 'At the peak'} />
          <Stat label="Seasons" value={seasons.length} sub={`${seasons[0].ovr} → ${peak.ovr} → ${now.ovr}`} />
        </div>

        <div className="glass rounded-3xl p-4 md:p-8 mb-14">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="font-display text-xl md:text-2xl font-black text-white">Overall by season</h3>
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest hidden sm:inline">Dashed = after the peak</span>
          </div>
          <CareerArc seasons={seasons} onSelect={setOpenIndex} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-2xl md:text-3xl font-black text-white">The collection</h3>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scrollRow(-1)} aria-label="Scroll cards left" className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors">←</button>
            <button onClick={() => scrollRow(1)} aria-label="Scroll cards right" className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors">→</button>
          </div>
        </div>

        <div
          ref={rowRef}
          className="no-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 flex gap-5 md:gap-7 overflow-x-auto snap-x snap-mandatory pb-6 pt-2"
        >
          {seasons.map((season, i) => (
            <button
              key={season.card.year}
              onClick={() => setOpenIndex(i)}
              aria-label={`${season.card.year} card, overall ${season.ovr}, ${season.phase}. Open details`}
              className="snap-start shrink-0 flex flex-col items-center gap-3 group rounded-xl transition-transform duration-300 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <SeasonCardFace season={season} />
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-black text-white">{season.card.year}</span>
                <Ribbon season={season} />
              </div>
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                {season.clips.length} clip{season.clips.length === 1 ? '' : 's'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <SeasonDetail
          seasons={seasons}
          index={openIndex}
          undated={undated}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
};

export default SeasonCards;
