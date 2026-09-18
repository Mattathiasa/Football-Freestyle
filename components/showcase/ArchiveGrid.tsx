import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Highlight } from '../../types';
import ArchiveCard from './ArchiveCard';
import { usePrefersReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PAGE_SIZE = 12;

interface ArchiveGridProps {
  clips: Highlight[];
  onOpen: (clip: Highlight) => void;
}

type SortBy = 'default' | 'date' | 'rating';

const pillLabel = (name: string, count: number) =>
  `${name.replace(/\s+/g, '_')}_${count}`;

const ArchiveGrid: React.FC<ArchiveGridProps> = ({ clips, onOpen }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewsEnabled, setPreviewsEnabled] = useState(true);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Filter pills derived from data so they always match the actual archive
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    clips.forEach(c => counts.set(c.category, (counts.get(c.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [clips]);

  const filtered = filter === 'All' ? clips : clips.filter(c => c.category === filter);

  const sorted = useMemo(() => {
    if (sortBy === 'default') return filtered;
    return [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortOrder === 'desc' ? diff : -diff;
      }
      if (!a.rating && !b.rating) return 0;
      if (!a.rating) return 1;
      if (!b.rating) return -1;
      const diff = (b.rating ?? 0) - (a.rating ?? 0);
      return sortOrder === 'desc' ? diff : -diff;
    });
  }, [filtered, sortBy, sortOrder]);

  const visible = sorted.slice(0, visibleCount);
  const remaining = sorted.length - visible.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, sortBy, sortOrder]);

  // Staggered scroll-reveal for cards that haven't been revealed yet.
  // Initial hidden state is applied via GSAP (not CSS) so reduced-motion
  // users always see cards immediately.
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>('.archive-card:not([data-revealed])')
    ) as HTMLElement[];
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 24 });
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        once: true,
        onEnter: batch => {
          batch.forEach(el => (el as HTMLElement).setAttribute('data-revealed', 'true'));
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.06,
            overwrite: true,
            // leave no inline transform behind so the CSS hover scale still applies
            clearProps: 'transform,opacity',
          });
        },
      });
    }, grid);

    return () => ctx.revert();
  }, [filter, sortBy, sortOrder, visibleCount, reducedMotion]);

  const sortButton = (value: SortBy, label: string) => (
    <button
      key={value}
      onClick={() => setSortBy(value)}
      className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-500 border ${
        sortBy === value
          ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]'
          : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="py-20 md:py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 md:mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="w-8 md:w-12 h-[2px] bg-[#CCFF00]" />
              <span className="text-[#CCFF00] font-mono tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold uppercase">
                Tactical Feed
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
              Video <br />
              <span className="text-white/20">Archive</span>
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-6 md:w-8 h-[1px] bg-[#CCFF00]" />
              <span className="text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">
                {clips.length}_Units_Logged{filter !== 'All' ? ` // Channel: ${filter}` : ''}
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mr-2">
                Sort
              </span>
              {sortButton('default', 'Default')}
              {sortButton('date', 'Date')}
              {sortButton('rating', 'Rating')}
              {sortBy !== 'default' && (
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest transition-all duration-500 border bg-white/5 border-white/10 text-white/50 hover:text-[#CCFF00] hover:border-[#CCFF00]/50"
                >
                  {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
                </button>
              )}
              <button
                onClick={() => setPreviewsEnabled(!previewsEnabled)}
                aria-pressed={previewsEnabled}
                className={`ml-auto lg:ml-4 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                  previewsEnabled
                    ? 'bg-[#CCFF00]/10 border-[#CCFF00]/40 text-[#CCFF00]'
                    : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
                }`}
              >
                Previews: {previewsEnabled ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 lg:gap-2 lg:justify-end">
              <button
                onClick={() => setFilter('All')}
                aria-pressed={filter === 'All'}
                className={`px-3 py-1.5 font-mono text-[10px] lg:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                  filter === 'All'
                    ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]'
                    : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
                }`}
              >
                {pillLabel('All', clips.length)}
              </button>
              {categories.map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
className={`px-3 py-1.5 font-mono text-[10px] lg:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                    filter === cat
                      ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]'
                      : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
                  }`}
                >
                  {pillLabel(cat, count)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visible.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {visible.map(clip => (
              <ArchiveCard
                key={clip.id}
                clip={clip}
                previewsEnabled={previewsEnabled}
                isPreviewing={previewingId === clip.id}
                onPreviewStart={id => setPreviewingId(id)}
                onPreviewEnd={id => setPreviewingId(prev => (prev === id ? null : prev))}
                onOpen={() => onOpen(clip)}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl py-20 flex flex-col items-center gap-6">
            <span className="font-mono text-xs text-white/40 uppercase tracking-[0.3em]">
              No_Signals_In_This_Channel
            </span>
            <button
              onClick={() => setFilter('All')}
              className="px-6 py-3 bg-[#CCFF00] text-black font-mono text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(204,255,0,0.5)] transition-shadow"
            >
              Reset_Filters
            </button>
          </div>
        )}

        {remaining > 0 && (
          <div className="mt-12 md:mt-16 flex flex-col items-center gap-3">
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="px-10 py-4 glass border-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#CCFF00] hover:text-black transition-all duration-300"
            >
              Load_+{Math.min(PAGE_SIZE, remaining)}
            </button>
            <span className="font-mono text-[10px] text-white/25 uppercase tracking-[0.3em]">
              {visible.length} / {sorted.length} Units
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveGrid;
