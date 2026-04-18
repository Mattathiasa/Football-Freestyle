import React, { useRef, useEffect, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point3D { x: number; y: number; z: number; }

interface TextBeat {
  start: number; end: number;
  title: string; subtitle: string;
  align: 'left' | 'center' | 'right';
  isCTA?: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ACCENT_RGB = '204, 255, 0';
const BG         = '#050505';
const SCROLL_VH  = 400;

const BEATS: TextBeat[] = [
  {
    start: 0.00, end: 0.20,
    title: 'THE BEAUTIFUL GAME',
    subtitle: 'Played without compromise.',
    align: 'center',
  },
  {
    start: 0.25, end: 0.45,
    title: 'TECHNIQUE',
    subtitle: 'Thousands of touches. Every one deliberate.',
    align: 'left',
  },
  {
    start: 0.50, end: 0.70,
    title: 'VISION',
    subtitle: 'Reading the game before it unfolds.',
    align: 'right',
  },
  {
    start: 0.75, end: 0.95,
    title: 'EXPLORE THE JOURNEY',
    subtitle: '2 years. Every touch documented.',
    align: 'center',
    isCTA: true,
  },
];

// Pentagon face centres of a truncated icosahedron projected onto the unit sphere
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

function rotateY(p: Point3D, angle: number): Point3D {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function beatOpacity(progress: number, beat: TextBeat): number {
  const { start, end } = beat;
  if (progress <= start || progress >= end) return 0;
  const fade = (end - start) * 0.15;
  if (progress < start + fade) return (progress - start) / fade;
  if (progress > end   - fade) return (end - progress) / fade;
  return 1;
}

function beatY(progress: number, beat: TextBeat): number {
  const { start, end } = beat;
  if (progress <= start || progress >= end) return 20;
  const fade = (end - start) * 0.15;
  if (progress < start + fade) return 20 * (1 - (progress - start) / fade);
  if (progress > end   - fade) return -20 * (1 - (end - progress) / fade);
  return 0;
}

// ─── Canvas pentagon helper ───────────────────────────────────────────────────

function tracePentagon(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number, rotation: number,
) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = rotation + (i * Math.PI * 2) / 5;
    i === 0
      ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
      : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath();
}

// ─── Core render function ─────────────────────────────────────────────────────

function renderFrame(
  ctx:      CanvasRenderingContext2D,
  vw:       number,
  vh:       number,
  progress: number,
  elapsed:  number,
) {
  ctx.clearRect(0, 0, vw, vh);

  const cx = vw / 2;
  const cy = vh / 2;
  const R  = Math.min(vw, vh) * 0.24;

  // Phase windows
  const ballFade    = clamp(progress / 0.08, 0, 1);
  const assemblePct = clamp(progress / 0.42, 0, 1);
  const rotatePct   = clamp((progress - 0.35) / 0.35, 0, 1);
  const dataPct     = clamp((progress - 0.60) / 0.35, 0, 1);
  const rotAngle    = elapsed * 0.28 + rotatePct * Math.PI * 1.4;

  // ── Ambient CCFF00 glow ────────────────────────────────────────────────────
  if (dataPct > 0) {
    const gr = ctx.createRadialGradient(cx, cy, R, cx, cy, R * (1.8 + dataPct * 0.4));
    gr.addColorStop(0, `rgba(${ACCENT_RGB},${dataPct * 0.12})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Ground shadow ──────────────────────────────────────────────────────────
  {
    const sg = ctx.createRadialGradient(cx, cy + R * 1.1, 0, cx, cy + R * 1.1, R * 0.65);
    sg.addColorStop(0, `rgba(0,0,0,${0.45 * ballFade})`);
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.ellipse(cx, cy + R * 1.08, R * 0.65, R * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Ball sphere gradient ───────────────────────────────────────────────────
  {
    const bg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.08, cx, cy, R);
    bg.addColorStop(0.00, `rgba(255,255,255,${ballFade})`);
    bg.addColorStop(0.45, `rgba(208,208,208,${ballFade})`);
    bg.addColorStop(0.82, `rgba(115,115,115,${ballFade})`);
    bg.addColorStop(1.00, `rgba(28,28,28,${ballFade})`);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Pentagon patches ───────────────────────────────────────────────────────
  if (assemblePct > 0 && ballFade > 0) {
    const rotated = PENTAGONS.map(p => rotateY(p, rotAngle));
    const FOV = 2.6;

    // Painter's algorithm: back → front
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
        const pr = R * 0.185 * persp;

        // Fly in from outside
        const flyX = lerp(cx + (sx - cx) * 2.8, sx, pAppear);
        const flyY = lerp(cy + (sy - cy) * 2.8, sy, pAppear);

        const isFront = rp.z <= 0.15;
        const alpha   = (isFront
          ? clamp(0.88 - rp.z * 0.55, 0.5, 0.92)
          : clamp(0.28 - rp.z * 0.30, 0.00, 0.28))
          * ballFade * pAppear;
        const shade = Math.round(18 + 14 * Math.max(0, 1 - alpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
        ctx.clip();

        tracePentagon(ctx, flyX, flyY, pr, rotAngle * 1.8 + idx * 0.9);
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
    sg.addColorStop(0, `rgba(255,255,255,${0.32 * ballFade})`);
    sg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Motion trail ──────────────────────────────────────────────────────────
  if (rotatePct > 0.05 && rotatePct < 0.85) {
    const trailA = rotatePct * (1 - rotatePct * 1.18) * 1.8;
    for (let t = 0; t < 10; t++) {
      const f  = t / 10;
      const ta = rotAngle - f * 0.9;
      const tx = cx + Math.cos(ta) * R * 0.48;
      const ty = cy + Math.sin(ta) * R * 0.28;
      ctx.fillStyle = `rgba(${ACCENT_RGB},${trailA * (1 - f) * 0.28})`;
      ctx.beginPath();
      ctx.arc(tx, ty, R * 0.055 * (1 - f), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Data rings ─────────────────────────────────────────────────────────────
  if (dataPct > 0) {
    for (let i = 0; i < 3; i++) {
      const rp = easeOut3(clamp((dataPct - i * 0.14) / 0.45, 0, 1));
      if (rp <= 0) continue;

      const ringR = R * (1.45 + i * 0.38);
      const dir   = i % 2 === 0 ? 1 : -1;

      ctx.save();
      ctx.strokeStyle = `rgba(${ACCENT_RGB},${rp * 0.22})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 9]);
      ctx.lineDashOffset = -elapsed * 22 * dir + i * 18;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const dotCount = 6 + i * 5;
      for (let d = 0; d < dotCount; d++) {
        const da = (d / dotCount) * Math.PI * 2 + elapsed * 0.12 * dir;
        ctx.fillStyle = `rgba(${ACCENT_RGB},${rp * 0.65})`;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(da) * ringR, cy + Math.sin(da) * ringR, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // HUD corner brackets
    const bSize  = R * 0.22;
    const bDist  = R * (1.98 + easeOut3(dataPct) * 0.12);
    const bAlpha = clamp(dataPct * 2.2, 0, 1);

    ctx.strokeStyle = `rgba(${ACCENT_RGB},${bAlpha * 0.85})`;
    ctx.lineWidth = 1.5;
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

    // HUD text labels
    if (dataPct > 0.48) {
      const la  = clamp((dataPct - 0.48) / 0.28, 0, 1);
      const fSz = Math.round(clamp(R * 0.095, 9, 13));
      ctx.textAlign = 'center';

      ctx.fillStyle = `rgba(${ACCENT_RGB},${la * 0.75})`;
      ctx.font = `${fSz}px 'JetBrains Mono', monospace`;
      ctx.fillText('SUBJECT_LOCKED', cx, cy - bDist - 14);

      ctx.fillStyle = `rgba(255,255,255,${la * 0.28})`;
      ctx.font = `${fSz - 1}px 'JetBrains Mono', monospace`;
      ctx.fillText(`VELOCITY: ${(88.2 + Math.sin(elapsed * 2.8) * 1.4).toFixed(1)} km/h`, cx, cy + bDist + 22);
    }
  }
}

// ─── React component ──────────────────────────────────────────────────────────

const FootballScrollSequence: React.FC = () => {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rawProg     = useRef(0);
  const smoothProg  = useRef(0);
  const rafRef      = useRef<number>(0);
  const lastTs      = useRef(0);
  const startTs     = useRef<number | null>(null);
  const [dispProg, setDispProg] = useState(0);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width        = window.innerWidth  * dpr;
    canvas.height       = window.innerHeight * dpr;
    canvas.style.width  = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, []);

  const handleScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const scrollable = wrapper.offsetHeight - window.innerHeight;
    const scrolled   = -wrapper.getBoundingClientRect().top;
    rawProg.current  = clamp(scrolled / scrollable, 0, 1);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (ts: number) => {
      if (startTs.current === null) startTs.current = ts;
      const elapsed = (ts - startTs.current) / 1000;
      const dt      = Math.min((ts - lastTs.current) / 1000, 0.05);
      lastTs.current = ts;

      // Spring-like smooth (stiffness≈100 / damping≈30 in practice)
      smoothProg.current += (rawProg.current - smoothProg.current) * (1 - Math.exp(-9 * dt));

      // Throttle React re-renders — text overlays don't need 60fps
      const q = Math.round(smoothProg.current * 250) / 250;
      setDispProg(prev => Math.abs(prev - q) > 0.003 ? q : prev);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          renderFrame(ctx, canvas.width / dpr, canvas.height / dpr, smoothProg.current, elapsed);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleResize, handleScroll]);

  return (
    <section
      ref={wrapperRef}
      id="scroll-sequence"
      style={{ height: `${SCROLL_VH}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: BG }}>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'transparent' }}
        />

        {/* Text beats */}
        {BEATS.map((beat, i) => {
          const opacity = beatOpacity(dispProg, beat);
          const yPx     = beatY(dispProg, beat);
          if (opacity < 0.005) return null;

          const posClass =
            beat.align === 'center'
              ? 'items-center justify-center text-center'
              : beat.align === 'left'
                ? 'items-start justify-center text-left'
                : 'items-end justify-center text-right';

          const padClass =
            beat.align === 'left'  ? 'pl-[8vw] md:pl-[10vw]' :
            beat.align === 'right' ? 'pr-[8vw] md:pr-[10vw]' : '';

          return (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col ${posClass} ${padClass}`}
              style={{ opacity, transform: `translateY(${yPx}px)`, pointerEvents: 'none' }}
            >
              {/* Chapter eyebrow */}
              <div className="flex items-center gap-3 mb-5" style={{ opacity: 0.65 }}>
                {beat.align !== 'right' && (
                  <div className="w-7 h-px" style={{ background: `rgb(${ACCENT_RGB})` }} />
                )}
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.55em]"
                  style={{ color: `rgb(${ACCENT_RGB})` }}
                >
                  Chapter_0{i + 1}
                </span>
                {beat.align !== 'left' && (
                  <div className="w-7 h-px" style={{ background: `rgb(${ACCENT_RGB})` }} />
                )}
              </div>

              {/* Headline */}
              <h2
                className="font-display font-black uppercase italic leading-none tracking-tighter"
                style={{
                  fontSize: 'clamp(2.6rem, 8.5vw, 7.5rem)',
                  color: 'rgba(255,255,255,0.92)',
                  maxWidth: beat.align === 'center' ? '90vw' : '52vw',
                }}
              >
                {beat.title.split(' ').map((word, wi, arr) => (
                  <React.Fragment key={wi}>
                    <span>{word}</span>
                    {wi < arr.length - 1 && (
                      beat.align === 'center' && arr.length > 2 ? <br /> : ' '
                    )}
                  </React.Fragment>
                ))}
              </h2>

              {/* Subtitle */}
              <p
                className="mt-5 font-mono uppercase tracking-widest leading-relaxed"
                style={{
                  fontSize: 'clamp(0.58rem, 1.05vw, 0.78rem)',
                  color: 'rgba(255,255,255,0.38)',
                  maxWidth: '36rem',
                }}
              >
                {beat.subtitle}
              </p>

              {/* CTA button */}
              {beat.isCTA && (
                <a
                  href="#highlights"
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-9 font-display font-black italic uppercase tracking-[0.3em] border transition-colors duration-300 no-underline"
                  style={{
                    pointerEvents: 'auto',
                    padding: '1.1rem 2.5rem',
                    fontSize: 'clamp(0.6rem, 1.05vw, 0.75rem)',
                    color: `rgb(${ACCENT_RGB})`,
                    borderColor: `rgba(${ACCENT_RGB},0.35)`,
                    background: `rgba(${ACCENT_RGB},0.04)`,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = `rgb(${ACCENT_RGB})`;
                    el.style.color = BG;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = `rgba(${ACCENT_RGB},0.04)`;
                    el.style.color = `rgb(${ACCENT_RGB})`;
                  }}
                >
                  WATCH HIGHLIGHTS
                </a>
              )}
            </div>
          );
        })}

        {/* Scroll-to-explore indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none select-none"
          style={{ opacity: clamp(1 - dispProg / 0.07, 0, 1) }}
        >
          <span
            className="font-mono uppercase tracking-[0.55em]"
            style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)' }}
          >
            Scroll to Explore
          </span>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: `linear-gradient(to bottom, rgba(${ACCENT_RGB},0.45), transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default FootballScrollSequence;
