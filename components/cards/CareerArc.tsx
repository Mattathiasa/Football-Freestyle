import React, { useEffect, useRef, useState } from 'react';
import { RatedSeason } from '../../lib/seasonRatings';

interface CareerArcProps {
  seasons: RatedSeason[];
  onSelect: (index: number) => void;
}

const PAD = { top: 36, right: 28, bottom: 36, left: 34 };

/**
 * Overall rating per season. One series, so no legend: the line is solid up
 * to the peak and dashed after it, so the decline reads without relying on
 * colour. Only the peak and the current season carry direct labels.
 */
const CareerArc: React.FC<CareerArcProps> = ({ seasons, onSelect }) => {
  const [hover, setHover] = useState<number | null>(null);
  // Draw at the real pixel width instead of scaling a fixed viewBox, so the
  // 11px labels stay 11px on a 320px phone rather than shrinking to ~4px.
  const figRef = useRef<HTMLElement>(null);
  const [W, setW] = useState(960);
  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  if (seasons.length < 2) return null;

  const H = W < 520 ? 220 : 260;
  const step = (W - PAD.left - PAD.right) / (seasons.length - 1);
  const shortYears = step < 46;

  const ovrs = seasons.map(s => s.ovr);
  const lo = Math.floor((Math.min(...ovrs) - 5) / 5) * 5;
  const hi = Math.ceil((Math.max(...ovrs) + 3) / 5) * 5;
  const x = (i: number) => PAD.left + (i * (W - PAD.left - PAD.right)) / (seasons.length - 1);
  const y = (v: number) => PAD.top + ((hi - v) * (H - PAD.top - PAD.bottom)) / (hi - lo);
  const peakIndex = seasons.findIndex(s => s.phase === 'peak');
  const last = seasons.length - 1;

  const path = (from: number, to: number) =>
    seasons
      .slice(from, to + 1)
      .map((s, k) => `${k === 0 ? 'M' : 'L'}${x(from + k)},${y(s.ovr)}`)
      .join(' ');

  const gridLines: number[] = [];
  for (let v = lo; v <= hi; v += 5) gridLines.push(v);

  const tip = hover !== null ? seasons[hover] : null;

  return (
    <figure ref={figRef} className="relative w-full">
      <figcaption className="sr-only">Overall rating by season, {seasons[0].card.year} to {seasons[last].card.year}</figcaption>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-hidden="true">
        {gridLines.map(v => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PAD.left - 10} y={y(v) + 4} textAnchor="end" className="font-mono" fontSize={11} fill="rgba(255,255,255,0.55)">
              {v}
            </text>
          </g>
        ))}

        {seasons.map((s, i) => (
          <text key={s.card.year} x={x(i)} y={H - 10} textAnchor="middle" className="font-mono" fontSize={11} fill="rgba(255,255,255,0.55)">
            {shortYears ? `'${String(s.card.year).slice(2)}` : s.card.year}
          </text>
        ))}

        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={PAD.top - 10} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
        )}

        <path d={path(0, peakIndex)} fill="none" stroke="#CCFF00" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {peakIndex < last && (
          <path d={path(peakIndex, last)} fill="none" stroke="#CCFF00" strokeWidth={2} strokeDasharray="6 5" strokeLinecap="round" />
        )}

        {seasons.map((s, i) => (
          <circle
            key={s.card.year}
            cx={x(i)}
            cy={y(s.ovr)}
            r={i === peakIndex || i === last || hover === i ? 6 : 4}
            fill={i === peakIndex ? '#CCFF00' : '#050505'}
            stroke="#CCFF00"
            strokeWidth={2}
          />
        ))}

        {[peakIndex, last].filter((v, k, a) => a.indexOf(v) === k).map(i => (
          <text
            key={`label-${i}`}
            x={x(i)}
            y={y(seasons[i].ovr) - 14}
            textAnchor={i === last ? 'end' : 'middle'}
            className="font-mono"
            fontSize={12}
            fontWeight={700}
            fill="#ffffff"
          >
            {i === peakIndex ? `PEAK ${seasons[i].ovr}` : `NOW ${seasons[i].ovr}`}
          </text>
        ))}

        {/* Hit targets: full-height column per season, wider than the dot */}
        {seasons.map((s, i) => {
          const half = step / 2;
          return (
            <rect
              key={`hit-${s.card.year}`}
              x={x(i) - half}
              y={0}
              width={half * 2}
              height={H}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(i)}
            />
          );
        })}
      </svg>

      {tip && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 glass bg-black/80 border-white/10 px-3 py-2 rounded-lg font-mono text-[11px] text-white whitespace-nowrap"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            // keep the tooltip on screen at either end of a narrow chart
            transform: `translateX(${hover <= 1 ? '-15%' : hover >= last - 1 ? '-85%' : '-50%'})`,
          }}
        >
          <div className="font-bold">{tip.card.year} · {tip.card.headline}</div>
          <div className="text-white/70">
            OVR {tip.ovr}
            {tip.delta !== null && ` (${tip.delta > 0 ? '+' : ''}${tip.delta})`} · {tip.clips.length} clip{tip.clips.length === 1 ? '' : 's'}
          </div>
        </div>
      )}

      <table className="sr-only">
        <caption>Overall rating by season</caption>
        <thead>
          <tr><th>Season</th><th>Overall</th><th>Change</th><th>Phase</th></tr>
        </thead>
        <tbody>
          {seasons.map(s => (
            <tr key={s.card.year}>
              <td>{s.card.year}</td>
              <td>{s.ovr}</td>
              <td>{s.delta ?? '-'}</td>
              <td>{s.phase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

export default CareerArc;
