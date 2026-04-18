import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PLAYER_NAME, PLAYER_TAGLINE, MILESTONES } from '../constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point3D { x: number; y: number; z: number; }
interface Beat    { id: string; start: number; end: number; }

// ─── Config ───────────────────────────────────────────────────────────────────

const ACCENT     = 'rgba(204,255,0,1)';
const ACCENT_RGB = '204, 255, 0';
const BG         = '#050505';
const SCROLL_VH  = 700;

const PHOTO_URL =
  'https://res.cloudinary.com/dg1xa7q5c/image/upload/v1770104603/IMG_20260203_104103_lksr5s.png';

const BEATS: Beat[] = [
  { id: 'intro',       start: 0.00, end: 0.16 },
  { id: 'about',       start: 0.20, end: 0.35 },
  { id: 'skills',      start: 0.40, end: 0.54 },
  { id: 'performance', start: 0.58, end: 0.72 },
  { id: 'analytics',   start: 0.76, end: 0.89 },
  { id: 'cta',         start: 0.93, end: 1.00 },
];

const SKILLS = [
  { label: 'Ball Control', value: 96 },
  { label: 'Technique',    value: 92 },
  { label: 'Vision',       value: 88 },
  { label: 'Movement',     value: 85 },
  { label: 'Creativity',   value: 94 },
];

// Derived from performanceData (overallScore per year)
const YEAR_DATA = [
  { year: '2020', label: 'Foundation',  score: 81  },
  { year: '2021', label: 'Development', score: 89  },
  { year: '2022', label: 'Refinement',  score: 94  },
  { year: '2023', label: 'Peak Form',   score: 98  },
  { year: '2024', label: 'Mastery',     score: 100 },
  { year: '2025', label: 'Expanding',   score: 95  },
];

const PERF_STATS = [
  { value: MILESTONES.hoursTrained,  label: 'Hours',    sub: 'Trained'    },
  { value: MILESTONES.skillsMastered, label: 'Skills',   sub: 'Mastered'   },
  { value: MILESTONES.clipsShared,   label: 'Videos',   sub: 'Documented' },
  { value: MILESTONES.passionLevel,  label: 'Passion',  sub: 'Level'      },
];

// Pentagon face centres of truncated icosahedron on unit sphere
const PENTAGONS: Point3D[] = [
  { x:  0.000, y: -1.000, z:  0.000 },
  { x:  0.894, y: -0.447, z:  0.000 },
  { x:  0.276, y: -0.447, z: -0.851 },
  { x: -0.724, y: -0.447, z: -0.526 },
  { x: -0.724, y: -0.447, z:  0.526 },
  { x:  0.276, y: -0.447, z:  0.851 },
  { x:  0.724, y:  0.447, z: -0.526 },
  { x: -0.276, y:  0.447, z: -0.851 },
  { x: -0.894, y:  0.447, z:  0.000 },
  { x: -0.276, y:  0.447, z:  0.851 },
  { x:  0.724, y:  0.447, z:  0.526 },
  { x:  0.000, y:  1.000, z:  0.000 },
];

// ─── Math helpers ─────────────────────────────────────────────────────────────

const clamp    = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp     = (a: number, b: number, t: number)   => a + (b - a) * clamp(t, 0, 1);
const easeOut3 = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const smooth   = (s: number, e: number, t: number)   => clamp((t - s) / (e - s), 0, 1);

function rotateY(p: Point3D, angle: number): Point3D {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function bOpacity(prog: number, beat: Beat): number {
  const { start, end } = beat;
  if (prog <= start || prog >= end) return 0;
  const fade = (end - start) * 0.18;
  if (prog < start + fade) return (prog - start) / fade;
  if (prog > end   - fade) return (end - prog) / fade;
  return 1;
}

function bY(prog: number, beat: Beat): number {
  const { start, end } = beat;
  if (prog <= start || prog >= end) return 20;
  const fade = (end - start) * 0.18;
  if (prog < start + fade) return 20 * (1 - (prog - start) / fade);
  if (prog > end   - fade) return -20 * (1 - (end - prog) / fade);
  return 0;
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function tracePentagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = rot + (i * Math.PI * 2) / 5;
    i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
            : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath();
}

// ─── Canvas render ────────────────────────────────────────────────────────────

function renderFrame(
  ctx:      CanvasRenderingContext2D,
  vw:       number,
  vh:       number,
  progress: number,
  elapsed:  number,
) {
  ctx.clearRect(0, 0, vw, vh);

  // Ball horizontal shift for side-panel beats (desktop only)
  let shiftX = 0;
  if (vw >= 768) {
    const aboutIn  = smooth(0.20, 0.26, progress) * (1 - smooth(0.32, 0.35, progress));
    const skillsIn = smooth(0.40, 0.46, progress) * (1 - smooth(0.51, 0.54, progress));
    shiftX = aboutIn * (vw * 0.14) - skillsIn * (vw * 0.14);
  }

  // Ball shift up for analytics beat
  let shiftY = 0;
  if (vw >= 768) {
    const analyticsIn = smooth(0.76, 0.82, progress) * (1 - smooth(0.86, 0.89, progress));
    shiftY = -analyticsIn * vh * 0.10;
  }

  const cx = vw / 2 + shiftX;
  const cy = vh / 2 + shiftY;
  const R  = Math.min(vw, vh) * 0.22;

  // Phase windows (map to canvas phases)
  const ballFade    = clamp(progress / 0.06, 0, 1);
  const assemblePct = clamp(progress / 0.33, 0, 1);
  const rotatePct   = clamp((progress - 0.28) / 0.32, 0, 1);
  const dataPct     = clamp((progress - 0.56) / 0.38, 0, 1);
  const rotAngle    = elapsed * 0.26 + rotatePct * Math.PI * 1.6;

  // ── Ambient glow ──────────────────────────────────────────────────────────
  if (dataPct > 0) {
    const gr = ctx.createRadialGradient(cx, cy, R, cx, cy, R * (1.9 + dataPct * 0.4));
    gr.addColorStop(0, `rgba(${ACCENT_RGB},${dataPct * 0.10})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Shadow ─────────────────────────────────────────────────────────────────
  {
    const sg = ctx.createRadialGradient(cx, cy + R * 1.1, 0, cx, cy + R * 1.1, R * 0.65);
    sg.addColorStop(0, `rgba(0,0,0,${0.45 * ballFade})`);
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.ellipse(cx, cy + R * 1.08, R * 0.65, R * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Ball sphere ────────────────────────────────────────────────────────────
  {
    const bg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.08, cx, cy, R);
    bg.addColorStop(0.00, `rgba(255,255,255,${ballFade})`);
    bg.addColorStop(0.45, `rgba(208,208,208,${ballFade})`);
    bg.addColorStop(0.82, `rgba(112,112,112,${ballFade})`);
    bg.addColorStop(1.00, `rgba(26,26,26,${ballFade})`);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Pentagon patches ───────────────────────────────────────────────────────
  if (assemblePct > 0 && ballFade > 0) {
    const rotated = PENTAGONS.map(p => rotateY(p, rotAngle));
    const FOV = 2.6;

    [...rotated.keys()]
      .sort((a, b) => rotated[a].z - rotated[b].z)
      .forEach(idx => {
        const rp = rotated[idx];
        if (rp.z < -0.92) return;

        const appearAt = (idx / PENTAGONS.length) * 0.75;
        const pAppear  = easeOut3(clamp((assemblePct - appearAt) / 0.1, 0, 1));
        if (pAppear <= 0) return;

        const persp = FOV / (FOV + rp.z * 0.38);
        const sx = cx + rp.x * R * 0.88 * persp;
        const sy = cy + rp.y * R * 0.88 * persp;

        const flyX = lerp(cx + (sx - cx) * 2.8, sx, pAppear);
        const flyY = lerp(cy + (sy - cy) * 2.8, sy, pAppear);

        const isFront = rp.z <= 0.15;
        const alpha = (isFront
          ? clamp(0.88 - rp.z * 0.55, 0.5, 0.92)
          : clamp(0.28 - rp.z * 0.30, 0.00, 0.28)) * ballFade * pAppear;
        const shade = Math.round(18 + 14 * Math.max(0, 1 - alpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
        ctx.clip();
        tracePentagon(ctx, flyX, flyY, R * 0.185 * persp, rotAngle * 1.8 + idx * 0.9);
        ctx.fillStyle = `rgba(${shade},${shade},${shade},${alpha})`;
        ctx.fill();
        if (isFront && pAppear > 0.6) {
          ctx.strokeStyle = `rgba(255,255,255,${0.06 * pAppear * ballFade})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
        ctx.restore();
      });
  }

  // ── Specular highlight ─────────────────────────────────────────────────────
  {
    const sg = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.28, 0, cx - R * 0.28, cy - R * 0.28, R * 0.52);
    sg.addColorStop(0, `rgba(255,255,255,${0.30 * ballFade})`);
    sg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Motion trail ──────────────────────────────────────────────────────────
  if (rotatePct > 0.05 && rotatePct < 0.82) {
    const trailA = rotatePct * (1 - rotatePct * 1.22) * 1.8;
    for (let t = 0; t < 10; t++) {
      const f = t / 10;
      ctx.fillStyle = `rgba(${ACCENT_RGB},${trailA * (1 - f) * 0.26})`;
      ctx.beginPath();
      ctx.arc(
        cx + Math.cos(rotAngle - f * 0.9) * R * 0.48,
        cy + Math.sin(rotAngle - f * 0.9) * R * 0.28,
        R * 0.055 * (1 - f), 0, Math.PI * 2,
      );
      ctx.fill();
    }
  }

  // ── Data rings ─────────────────────────────────────────────────────────────
  if (dataPct > 0) {
    for (let i = 0; i < 3; i++) {
      const rp = easeOut3(clamp((dataPct - i * 0.13) / 0.45, 0, 1));
      if (rp <= 0) continue;
      const ringR = R * (1.45 + i * 0.38);
      const dir   = i % 2 === 0 ? 1 : -1;

      ctx.save();
      ctx.strokeStyle = `rgba(${ACCENT_RGB},${rp * 0.20})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 9]);
      ctx.lineDashOffset = -elapsed * 22 * dir + i * 18;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const dotCount = 6 + i * 5;
      for (let d = 0; d < dotCount; d++) {
        const da = (d / dotCount) * Math.PI * 2 + elapsed * 0.11 * dir;
        ctx.fillStyle = `rgba(${ACCENT_RGB},${rp * 0.6})`;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(da) * ringR, cy + Math.sin(da) * ringR, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // HUD brackets
    const bSize  = R * 0.22;
    const bDist  = R * (1.96 + easeOut3(dataPct) * 0.12);
    const bAlpha = clamp(dataPct * 2.2, 0, 1);

    ctx.strokeStyle = `rgba(${ACCENT_RGB},${bAlpha * 0.80})`;
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([]);

    ([ [cx - bDist, cy - bDist,  1,  1],
       [cx + bDist, cy - bDist, -1,  1],
       [cx - bDist, cy + bDist,  1, -1],
       [cx + bDist, cy + bDist, -1, -1],
    ] as [number, number, number, number][]).forEach(([bx, by, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(bx, by + dy * bSize);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + dx * bSize, by);
      ctx.stroke();
    });

    if (dataPct > 0.45) {
      const la  = clamp((dataPct - 0.45) / 0.28, 0, 1);
      const fSz = Math.round(clamp(R * 0.09, 8, 12));
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(${ACCENT_RGB},${la * 0.70})`;
      ctx.font = `${fSz}px 'JetBrains Mono', monospace`;
      ctx.fillText('SUBJECT_LOCKED', cx, cy - bDist - 14);
      ctx.fillStyle = `rgba(255,255,255,${la * 0.25})`;
      ctx.font = `${fSz - 1}px 'JetBrains Mono', monospace`;
      ctx.fillText(`VELOCITY: ${(88.2 + Math.sin(elapsed * 2.8) * 1.4).toFixed(1)} km/h`, cx, cy + bDist + 22);
    }
  }
}

// ─── Shared overlay styles ────────────────────────────────────────────────────

const eyebrow = (n: number, label: string, align: 'left' | 'center' | 'right' = 'left') => (
  <div className={`flex items-center gap-3 mb-5 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}>
    {align !== 'right'  && <div className="w-6 h-px" style={{ background: ACCENT }} />}
    <span className="font-mono text-[9px] uppercase tracking-[0.55em]" style={{ color: ACCENT }}>
      Chapter_0{n}
    </span>
    {align !== 'left' && <div className="w-6 h-px" style={{ background: ACCENT }} />}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const FootballScrollSequence: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rawProg    = useRef(0);
  const smoothProg = useRef(0);
  const rafRef     = useRef<number>(0);
  const lastTs     = useRef(0);
  const startTs    = useRef<number | null>(null);

  const [dp, setDp] = useState(0); // display progress (throttled for React)

  const handleResize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width        = window.innerWidth  * dpr;
    c.height       = window.innerHeight * dpr;
    c.style.width  = `${window.innerWidth}px`;
    c.style.height = `${window.innerHeight}px`;
  }, []);

  const handleScroll = useCallback(() => {
    const w = wrapperRef.current;
    if (!w) return;
    rawProg.current = clamp(-w.getBoundingClientRect().top / (w.offsetHeight - window.innerHeight), 0, 1);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const tick = (ts: number) => {
      if (!startTs.current) startTs.current = ts;
      const elapsed = (ts - startTs.current) / 1000;
      const dt      = Math.min((ts - lastTs.current) / 1000, 0.05);
      lastTs.current = ts;

      smoothProg.current += (rawProg.current - smoothProg.current) * (1 - Math.exp(-9 * dt));
      const q = Math.round(smoothProg.current * 300) / 300;
      setDp(prev => Math.abs(prev - q) > 0.002 ? q : prev);

      const c = canvasRef.current;
      if (c) {
        const ctx = c.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          renderFrame(ctx, c.width / dpr, c.height / dpr, smoothProg.current, elapsed);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleResize, handleScroll]);

  // Helper: get opacity + y for a beat
  const vis = (id: string) => {
    const b = BEATS.find(x => x.id === id)!;
    return { opacity: bOpacity(dp, b), y: bY(dp, b) };
  };

  const skillBeat = BEATS.find(b => b.id === 'skills')!;
  const skillsVisible = bOpacity(dp, skillBeat) > 0.4;

  return (
    <section
      ref={wrapperRef}
      id="journey"
      style={{ height: `${SCROLL_VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: BG }}>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'transparent' }}
        />

        {/* ── Beat 1: INTRO ──────────────────────────────────────────────────── */}
        {(() => { const { opacity, y } = vis('intro'); return opacity > 0.01 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
            style={{ opacity, transform: `translateY(${y}px)` }}
          >
            {eyebrow(1, 'The Beautiful Game', 'center')}
            <h2
              className="font-display font-black uppercase italic leading-none tracking-tighter text-white/92 mb-6"
              style={{ fontSize: 'clamp(3.2rem, 9.5vw, 8.5rem)' }}
            >
              THE<br />BEAUTIFUL<br />GAME
            </h2>
            <p className="font-mono uppercase tracking-[0.3em] text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Played without compromise.
            </p>
          </div>
        ); })()}

        {/* ── Beat 2: ABOUT ──────────────────────────────────────────────────── */}
        {(() => { const { opacity, y } = vis('about'); return opacity > 0.01 && (
          <>
            {/* Desktop: left panel */}
            <div
              className="absolute top-1/2 left-[5%] -translate-y-1/2 hidden md:flex flex-col pointer-events-none"
              style={{ opacity, transform: `translateY(calc(-50% + ${y}px))`, maxWidth: '28vw' }}
            >
              {eyebrow(2, 'Player Profile')}
              <h2
                className="font-display font-black uppercase italic leading-none tracking-tighter mb-4"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', color: 'rgba(255,255,255,0.92)' }}
              >
                {PLAYER_NAME.split(' ')[0]}<br />
                <span style={{ color: 'rgba(255,255,255,0.18)' }}>{PLAYER_NAME.split(' ')[1]}</span>
              </h2>

              <div className="relative w-28 h-28 mb-5 flex-shrink-0">
                <div className="absolute inset-0 rounded-sm overflow-hidden border border-white/10">
                  <img src={PHOTO_URL} alt={PLAYER_NAME} className="w-full h-full object-cover object-top grayscale brightness-60" />
                </div>
                <div className="corner-tl" style={{ width: 10, height: 10 }} />
                <div className="corner-br" style={{ width: 10, height: 10 }} />
              </div>

              <p className="font-mono text-white/35 text-xs uppercase tracking-[0.2em] mb-6 leading-relaxed max-w-xs">
                [ {PLAYER_TAGLINE} ]
              </p>
              <p className="font-mono text-white/35 text-xs leading-relaxed mb-6 max-w-xs border-l-2 border-[#CCFF00]/20 pl-4">
                Solo football — touch, control, creativity and precision. No shortcuts. Just the ball and the work.
              </p>
              <div className="flex gap-3 flex-wrap">
                {[['Origin', 'Addis Ababa'], ['Est.', '2020'], ['Videos', '50+']].map(([k, v]) => (
                  <div key={k} className="glass border-white/5 px-3 py-2">
                    <div className="font-mono text-[8px] text-white/25 uppercase tracking-widest">{k}</div>
                    <div className="font-display font-black italic tracking-tight" style={{ fontSize: '1rem', color: ACCENT }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: top panel */}
            <div
              className="absolute top-[6%] left-4 right-4 flex flex-col items-center text-center md:hidden pointer-events-none"
              style={{ opacity, transform: `translateY(${y}px)` }}
            >
              {eyebrow(2, 'Player Profile', 'center')}
              <h2
                className="font-display font-black uppercase italic leading-none tracking-tighter mb-3"
                style={{ fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', color: 'rgba(255,255,255,0.92)' }}
              >
                {PLAYER_NAME.split(' ')[0]}&nbsp;
                <span style={{ color: 'rgba(255,255,255,0.18)' }}>{PLAYER_NAME.split(' ')[1]}</span>
              </h2>
              <p className="font-mono text-white/35 text-[10px] uppercase tracking-[0.25em]">
                [ {PLAYER_TAGLINE} ]
              </p>
              <div className="flex gap-2 mt-3">
                {[['Addis Ababa'], ['Est. 2020'], ['50+ Videos']].map(([v]) => (
                  <div key={v} className="glass px-2 py-1 border-white/5">
                    <span className="font-mono text-[9px]" style={{ color: ACCENT }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ); })()}

        {/* ── Beat 3: SKILL MATRIX ───────────────────────────────────────────── */}
        {(() => { const { opacity, y } = vis('skills'); return opacity > 0.01 && (
          <>
            {/* Desktop: right panel */}
            <div
              className="absolute top-1/2 right-[5%] -translate-y-1/2 hidden md:flex flex-col pointer-events-none"
              style={{ opacity, transform: `translateY(calc(-50% + ${y}px))`, minWidth: '26vw', maxWidth: '30vw' }}
            >
              {eyebrow(3, 'Skill Matrix', 'right')}
              <h2
                className="font-display font-black uppercase italic leading-none tracking-tighter mb-8 text-right"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', color: 'rgba(255,255,255,0.92)' }}
              >
                SKILL<br /><span style={{ color: 'rgba(255,255,255,0.18)' }}>MATRIX</span>
              </h2>
              <div className="flex flex-col gap-5">
                {SKILLS.map((sk, i) => (
                  <div key={sk.label}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{sk.label}</span>
                      <span className="font-display font-black italic text-lg" style={{ color: ACCENT }}>{sk.value}</span>
                    </div>
                    <div className="h-[3px] bg-white/8 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          background: `rgb(${ACCENT_RGB})`,
                          width: skillsVisible ? `${sk.value}%` : '0%',
                          transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: bottom panel */}
            <div
              className="absolute bottom-[6%] left-4 right-4 flex flex-col md:hidden pointer-events-none"
              style={{ opacity, transform: `translateY(${y}px)` }}
            >
              {eyebrow(3, 'Skill Matrix')}
              <div className="grid grid-cols-2 gap-3">
                {SKILLS.map((sk) => (
                  <div key={sk.label} className="glass px-3 py-2 border-white/5">
                    <div className="font-mono text-[8px] text-white/30 uppercase tracking-widest mb-1">{sk.label}</div>
                    <div className="font-display font-black italic text-xl" style={{ color: ACCENT }}>{sk.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ); })()}

        {/* ── Beat 4: PERFORMANCE PARAMETERS ────────────────────────────────── */}
        {(() => { const { opacity, y } = vis('performance'); return opacity > 0.01 && (
          <div
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center"
            style={{ opacity, transform: `translateY(${y}px)` }}
          >
            {eyebrow(4, 'Performance Parameters', 'center')}
            <h2
              className="font-display font-black uppercase italic leading-none tracking-tighter mb-12 text-center"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'rgba(255,255,255,0.92)' }}
            >
              PERFORMANCE<br /><span style={{ color: 'rgba(255,255,255,0.18)' }}>PARAMETERS</span>
            </h2>

            {/* Flanking stat grid — 2×2 around the ball on desktop, simple grid on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-16 w-full max-w-4xl px-6">
              {PERF_STATS.map((s, i) => (
                <div
                  key={i}
                  className="glass p-5 md:p-6 border-white/5 flex flex-col items-center text-center group hover:border-[#CCFF00]/30 transition-colors"
                  style={{
                    opacity: opacity > 0.3 ? 1 : 0,
                    transform: `translateY(${opacity > 0.3 ? 0 : 20}px)`,
                    transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                  }}
                >
                  <div
                    className="font-display font-black italic tracking-tighter leading-none mb-1"
                    style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: ACCENT }}
                  >
                    {s.value}
                  </div>
                  <div className="h-px w-8 my-2" style={{ background: `rgba(${ACCENT_RGB},0.3)` }} />
                  <div className="font-mono text-white/60 text-[10px] uppercase tracking-widest">{s.label}</div>
                  <div className="font-mono text-white/25 text-[8px] uppercase tracking-widest mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        ); })()}

        {/* ── Beat 5: DATA ANALYTICS ─────────────────────────────────────────── */}
        {(() => { const { opacity, y } = vis('analytics'); return opacity > 0.01 && (
          <div
            className="absolute inset-0 pointer-events-none flex flex-col items-center"
            style={{ opacity, transform: `translateY(${y}px)` }}
          >
            {/* Top label */}
            <div className="pt-[10vh] flex flex-col items-center">
              {eyebrow(5, 'Data Analytics', 'center')}
              <h2
                className="font-display font-black uppercase italic leading-none tracking-tighter text-center"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: 'rgba(255,255,255,0.92)' }}
              >
                5 YEARS<br /><span style={{ color: 'rgba(255,255,255,0.18)' }}>DOCUMENTED</span>
              </h2>
            </div>

            {/* Timeline bars - bottom half */}
            <div
              className="absolute bottom-[8%] left-4 right-4 md:left-[8%] md:right-[8%] flex flex-col gap-3"
              style={{ maxWidth: '680px', margin: '0 auto', left: 0, right: 0, position: 'absolute', bottom: '8%' }}
            >
              {YEAR_DATA.map((row, i) => {
                const revealed = opacity > 0.25;
                return (
                  <div key={row.year} className="flex items-center gap-3 md:gap-4">
                    <span className="font-mono text-[9px] md:text-[10px] text-white/35 w-9 md:w-10 text-right tracking-widest flex-shrink-0">
                      {row.year}
                    </span>
                    <div className="flex-1 h-[6px] md:h-[7px] bg-white/5 overflow-hidden">
                      <div
                        style={{
                          height: '100%',
                          background: `linear-gradient(to right, rgba(${ACCENT_RGB},0.9), rgba(${ACCENT_RGB},0.5))`,
                          width: revealed ? `${row.score}%` : '0%',
                          transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
                        }}
                      />
                    </div>
                    <div className="flex items-baseline gap-2 flex-shrink-0">
                      <span className="font-display font-black italic text-sm md:text-base" style={{ color: ACCENT }}>{row.score}</span>
                      <span className="font-mono text-[8px] text-white/25 uppercase tracking-widest hidden sm:inline">{row.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ); })()}

        {/* ── Beat 6: CTA ────────────────────────────────────────────────────── */}
        {(() => { const { opacity, y } = vis('cta'); return opacity > 0.01 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{ opacity, transform: `translateY(${y}px)` }}
          >
            {eyebrow(6, 'The Archive', 'center')}
            <h2
              className="font-display font-black uppercase italic leading-none tracking-tighter mb-6"
              style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', color: 'rgba(255,255,255,0.92)' }}
            >
              EXPLORE<br /><span style={{ color: 'rgba(255,255,255,0.16)' }}>THE JOURNEY</span>
            </h2>
            <p className="font-mono uppercase tracking-[0.25em] text-xs mb-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
              50+ highlights. Every touch documented.
            </p>
            <a
              href="#highlights"
              onClick={e => { e.preventDefault(); document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="font-display font-black italic uppercase tracking-[0.3em] border no-underline transition-colors duration-300"
              style={{
                pointerEvents: 'auto',
                padding: '1.1rem 2.8rem',
                fontSize: 'clamp(0.65rem, 1.1vw, 0.8rem)',
                color: ACCENT,
                borderColor: `rgba(${ACCENT_RGB},0.35)`,
                background: `rgba(${ACCENT_RGB},0.04)`,
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.color = BG; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `rgba(${ACCENT_RGB},0.04)`; el.style.color = ACCENT; }}
            >
              WATCH HIGHLIGHTS
            </a>
          </div>
        ); })()}

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none select-none"
          style={{ opacity: clamp(1 - dp / 0.06, 0, 1) }}
        >
          <span className="font-mono uppercase tracking-[0.55em]" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)' }}>
            Scroll to Explore
          </span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, rgba(${ACCENT_RGB},0.45), transparent)` }} />
        </div>

        {/* Progress dots */}
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
          {BEATS.map(b => {
            const active = dp >= b.start && dp <= b.end;
            const passed = dp > b.end;
            return (
              <div
                key={b.id}
                className="rounded-full transition-all duration-500"
                style={{
                  width:  active ? 6 : 3,
                  height: active ? 6 : 3,
                  background: active ? ACCENT : passed ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.15)',
                  boxShadow: active ? `0 0 8px ${ACCENT}` : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FootballScrollSequence;
