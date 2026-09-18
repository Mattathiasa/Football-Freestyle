import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Highlight } from '../../types';
import ReelCard from './ReelCard';
import { useMediaQuery, usePrefersReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedReelProps {
  clips: Highlight[];
  onOpen: (clip: Highlight) => void;
}

const FeaturedReel: React.FC<FeaturedReelProps> = ({ clips, onOpen }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  // ScrollTrigger geometry captured on refresh, used to map card index -> scroll position.
  // snapPoints[i] is the progress at which card i sits dead-center in the viewport.
  const stRef = useRef<{ start: number; distance: number; snapPoints: number[] } | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [scrollHintDone, setScrollHintDone] = useState(false);

  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // Single gate shared by JSX and GSAP so the two can never disagree
  const enablePin = isDesktop && !reducedMotion;

  // Desktop: pinned horizontal scrub
  useLayoutEffect(() => {
    if (!enablePin || clips.length === 0) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      // Measured (offsetLeft ignores transforms), not derived from index math,
      // so gaps and spacers can't drift the card-center mapping.
      const getSnapPoints = () => {
        const d = getDistance() || 1;
        return (Array.from(track.querySelectorAll('[data-reel-card]')) as HTMLElement[]).map(card =>
          gsap.utils.clamp(0, 1, (card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2) / d)
        );
      };
      const nearestIndex = (progress: number, points: number[]) => {
        let best = 0;
        points.forEach((p, i) => {
          if (Math.abs(p - progress) < Math.abs(points[best] - progress)) best = i;
        });
        return best;
      };

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: pinRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          snap: {
            snapTo: value => {
              const points = stRef.current?.snapPoints ?? getSnapPoints();
              return points[nearestIndex(value, points)];
            },
            duration: { min: 0.2, max: 0.6 },
            ease: 'power1.inOut',
            delay: 0.1,
          },
          onRefresh: self => {
            stRef.current = { start: self.start, distance: getDistance(), snapPoints: getSnapPoints() };
          },
          onUpdate: self => {
            const points = stRef.current?.snapPoints ?? getSnapPoints();
            const idx = nearestIndex(self.progress, points);
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
            if (self.progress > 0.05) setScrollHintDone(true);
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
          onEnter: () => setPlaying(true),
          onEnterBack: () => setPlaying(true),
          onLeave: () => setPlaying(false),
          onLeaveBack: () => setPlaying(false),
        },
      });

      // Inner-media parallax as each card crosses the pinned viewport
      track.querySelectorAll<HTMLElement>('[data-reel-media]').forEach(media => {
        const card = media.closest('[data-reel-card]');
        if (!card) return;
        gsap.fromTo(
          media,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: card as HTMLElement,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, [enablePin, clips.length]);

  // Mobile / reduced-motion: snap carousel with IntersectionObserver center detection
  useEffect(() => {
    if (enablePin) return;
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll('[data-reel-card]')) as Element[];

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const idx = cards.indexOf(entry.target);
          if (idx >= 0 && idx !== activeIndexRef.current) {
            activeIndexRef.current = idx;
            setActiveIndex(idx);
            if (idx > 0) setScrollHintDone(true);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    cards.forEach(card => io.observe(card));
    return () => io.disconnect();
  }, [enablePin, clips.length]);

  // Mobile: only preview while the reel is on screen
  useEffect(() => {
    if (enablePin) {
      return; // pinned mode drives `playing` from ScrollTrigger enter/leave
    }
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enablePin]);

  const scrollToIndex = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(i, clips.length - 1));
      if (enablePin && stRef.current && clips.length > 1) {
        const { start, distance, snapPoints } = stRef.current;
        window.scrollTo({
          top: start + (snapPoints[clamped] ?? 0) * distance,
          behavior: 'smooth',
        });
      } else {
        const card = trackRef.current?.querySelectorAll('[data-reel-card]')[clamped];
        card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    },
    [enablePin, clips.length]
  );

  const handleCardClick = (i: number, clip: Highlight) => {
    if (i === activeIndexRef.current) {
      onOpen(clip);
    } else {
      scrollToIndex(i);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndexRef.current + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndexRef.current - 1);
    }
  };

  if (clips.length === 0) return null;

  const fallbackProgress = clips.length > 1 ? activeIndex / (clips.length - 1) : 1;

  return (
    <div ref={sectionRef} className="relative">
      <div
        ref={pinRef}
        className={
          enablePin
            ? 'h-screen overflow-hidden flex flex-col justify-center relative pt-[var(--nav-height)]'
            : 'relative py-20 md:py-28 overflow-hidden'
        }
      >
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="px-6 md:px-16 mb-8 md:mb-10 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 md:w-12 h-[2px] bg-[#CCFF00]" />
            <span className="text-[#CCFF00] font-mono tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold uppercase">
              Featured_Reel // Best_Transmissions
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
            The <span className="text-white/40">Showcase</span>
          </h2>
        </div>

        <div
          ref={trackRef}
          role="region"
          aria-label="Featured highlights reel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={
            enablePin
              ? 'flex items-center gap-8 md:gap-12 will-change-transform outline-none'
              : 'flex items-center gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar outline-none'
          }
        >
          {/* Lead/tail spacers center the first and last cards in the viewport */}
          <div
            aria-hidden="true"
            className={enablePin ? 'shrink-0 w-[max(14vw,(100vw-1000px)/2)]' : 'shrink-0 w-[7.5vw]'}
          />
          {clips.map((clip, i) => (
            <ReelCard
              key={clip.id}
              clip={clip}
              index={i}
              isActive={i === activeIndex}
              isNear={Math.abs(i - activeIndex) <= 1}
              playing={playing && !reducedMotion}
              snap={!enablePin}
              onOpen={() => handleCardClick(i, clip)}
            />
          ))}
          <div
            aria-hidden="true"
            className={enablePin ? 'shrink-0 w-[max(14vw,(100vw-1000px)/2)]' : 'shrink-0 w-[7.5vw]'}
          />
        </div>

        <div
          aria-hidden="true"
          className="px-6 md:px-16 mt-8 md:mt-10 relative z-10 flex items-center gap-5 md:gap-8"
        >
          <span className="font-mono text-xs md:text-sm text-white tracking-widest tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')}
            <span className="text-white/50"> / {String(clips.length).padStart(2, '0')}</span>
          </span>
          <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute inset-0 bg-[#CCFF00] origin-left"
              style={
                enablePin
                  ? { transform: 'scaleX(0)' }
                  : { transform: `scaleX(${fallbackProgress})`, transition: 'transform 0.4s ease-out' }
              }
            />
          </div>
          <span
            className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#CCFF00] transition-opacity duration-700 ${
              scrollHintDone ? 'opacity-0' : 'opacity-60'
            }`}
            style={{ animation: scrollHintDone ? 'none' : 'pulse 2s ease-in-out infinite' }}
          >
            {enablePin ? 'Scroll →' : 'Swipe →'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedReel;
