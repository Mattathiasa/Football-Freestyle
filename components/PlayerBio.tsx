import React, { useEffect, useRef, useState } from 'react';
import { PLAYER_NAME, PLAYER_TAGLINE } from '../constants';

const PHOTO_URL =
  'https://res.cloudinary.com/dg1xa7q5c/image/upload/v1770104603/IMG_20260203_104103_lksr5s.png';

const FACTS = [
  { label: 'Origin',   value: 'Addis Ababa' },
  { label: 'Est.',     value: '2020'         },
  { label: 'Videos',  value: '50+'           },
  { label: 'Surfaces', value: 'All'          },
];

const PlayerBio: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToHighlights = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-48 px-6 overflow-hidden bg-obsidian border-t border-white/5"
    >
      {/* Hex grid texture */}
      <div className="absolute inset-0 bg-hex opacity-10 pointer-events-none" />

      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#CCFF00]/4 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: text ─────────────────────────────────────────────── */}
          <div
            style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
            }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-[#CCFF00]" />
              <span className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[0.55em]">
                Player_Profile
              </span>
            </div>

            {/* Name */}
            <h2
              className="font-display font-black uppercase italic leading-none tracking-tighter mb-6"
              style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', color: 'rgba(255,255,255,0.92)' }}
            >
              {PLAYER_NAME.split(' ')[0]}<br />
              <span style={{ color: 'rgba(255,255,255,0.12)' }}>
                {PLAYER_NAME.split(' ')[1]}
              </span>
            </h2>

            {/* Tagline */}
            <p className="font-mono text-white/40 uppercase tracking-[0.25em] text-sm mb-12 max-w-xs leading-relaxed">
              [ {PLAYER_TAGLINE} ]
            </p>

            {/* Bio */}
            <div className="space-y-6 mb-14 max-w-md">
              <p className="border-l-2 border-[#CCFF00]/20 pl-6 font-mono text-white/40 text-sm leading-relaxed">
                Solo football. Built from scratch.
              </p>
              <p className="border-l-2 border-[#CCFF00]/20 pl-6 font-mono text-white/40 text-sm leading-relaxed">
                Every touch, every session, every experiment — documented. No team, no coach, no shortcuts. Just the ball and the work.
              </p>
            </div>

            {/* Fact strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
              {FACTS.map((f, i) => (
                <div
                  key={i}
                  className="glass p-4 border-white/5"
                  style={{
                    opacity:    visible ? 1 : 0,
                    transform:  visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.7s ease ${0.15 + i * 0.08}s, transform 0.7s ease ${0.15 + i * 0.08}s`,
                  }}
                >
                  <div className="font-mono text-[8px] text-white/25 uppercase tracking-widest mb-2">{f.label}</div>
                  <div className="font-display font-black italic text-[#CCFF00] text-xl tracking-tight">{f.value}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#highlights"
              onClick={scrollToHighlights}
              className="inline-flex items-center gap-4 font-display font-black italic uppercase tracking-[0.2em] text-sm no-underline group"
              style={{ color: '#CCFF00' }}
            >
              <span className="border border-[#CCFF00]/30 px-8 py-4 group-hover:bg-[#CCFF00] group-hover:text-black transition-all duration-300">
                WATCH HIGHLIGHTS
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 transition-transform group-hover:translate-x-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>

          {/* ── Right: photo ────────────────────────────────────────────── */}
          <div
            className="relative"
            style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
            }}
          >
            {/* Glow behind photo */}
            <div className="absolute -inset-16 bg-[#CCFF00]/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            <div className="relative aspect-[3/4] glass overflow-hidden p-2 group">
              {/* HUD corners */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="corner-tl" />
                <div className="corner-tr" />
                <div className="corner-bl" />
                <div className="corner-br" />
              </div>

              {/* Scan line */}
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <div className="scanline" />
              </div>

              <img
                src={PHOTO_URL}
                alt={PLAYER_NAME}
                className="w-full h-full object-cover object-top grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000 scale-105 group-hover:scale-100"
              />

              {/* Photo overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

              {/* HUD label */}
              <div className="absolute bottom-8 left-8 z-30">
                <span className="font-mono text-[9px] text-[#CCFF00] block mb-2 uppercase tracking-[0.4em]">
                  Unit_Authenticated
                </span>
                <h3 className="font-display text-3xl font-black text-white uppercase italic tracking-tighter">
                  {PLAYER_NAME.split(' ')[0]}
                </h3>
              </div>

              {/* Live ping */}
              <div className="absolute top-8 right-8 z-30 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping" />
                <span className="font-mono text-[8px] text-[#CCFF00]/60 uppercase tracking-widest">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayerBio;
