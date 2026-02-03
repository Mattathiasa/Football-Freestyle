import React from 'react';
import { HeatmapData } from '../../types';

interface PositionHeatmapProps {
  data: HeatmapData[];
}

const PositionHeatmap: React.FC<PositionHeatmapProps> = ({ data }) => {
  // Football pitch dimensions (scaled)
  const pitchWidth = 350;
  const pitchHeight = 500;
  
  // Find max values for intensity scaling
  const maxTouches = Math.max(...data.map(d => d.touches));
  const maxPasses = Math.max(...data.map(d => d.passes));
  const maxDribbles = Math.max(...data.map(d => d.dribbles));

  const getIntensity = (touches: number, passes: number, dribbles: number) => {
    const touchesNorm = touches / maxTouches;
    const passesNorm = passes / maxPasses;
    const dribblesNorm = dribbles / maxDribbles;
    return (touchesNorm + passesNorm + dribblesNorm) / 3;
  };

  const getHeatColor = (intensity: number) => {
    if (intensity > 0.8) return '#CCFF00'; // Bright green
    if (intensity > 0.6) return '#39FF14'; // Neon green
    if (intensity > 0.4) return 'rgba(204, 255, 0, 0.7)'; // Semi-transparent green
    if (intensity > 0.2) return 'rgba(204, 255, 0, 0.4)'; // Light green
    return 'rgba(255, 255, 255, 0.1)'; // Very light
  };

  // Top zones for display
  const topZones = data
    .sort((a, b) => b.touches - a.touches)
    .slice(0, 3);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <svg width={pitchWidth} height={pitchHeight} className="border border-white/20 rounded-lg">
          {/* Football pitch background */}
          <rect 
            width={pitchWidth} 
            height={pitchHeight} 
            fill="rgba(0, 0, 0, 0.3)" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          
          {/* Center circle */}
          <circle 
            cx={pitchWidth / 2} 
            cy={pitchHeight / 2} 
            r="40" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          
          {/* Center line */}
          <line 
            x1="0" 
            y1={pitchHeight / 2} 
            x2={pitchWidth} 
            y2={pitchHeight / 2} 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          
          {/* Penalty areas */}
          <rect 
            x="70" 
            y="0" 
            width="210" 
            height="80" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1" 
          />
          <rect 
            x="70" 
            y={pitchHeight - 80} 
            width="210" 
            height="80" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1" 
          />
          
          {/* Goal areas */}
          <rect 
            x="130" 
            y="0" 
            width="90" 
            height="30" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1" 
          />
          <rect 
            x="130" 
            y={pitchHeight - 30} 
            width="90" 
            height="30" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1" 
          />
          
          {/* Heatmap data points */}
          {data.map((point, index) => {
            const intensity = getIntensity(point.touches, point.passes, point.dribbles);
            const x = (point.x / 100) * pitchWidth;
            const y = (point.y / 100) * pitchHeight;
            const radius = 12 + (intensity * 20);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={getHeatColor(intensity)}
                  opacity={0.7}
                  className="transition-all duration-300 hover:opacity-100"
                />
                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#000"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {point.touches}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Zone Analysis */}
      <div className="mt-4 space-y-2">
        <div className="text-[#CCFF00] font-mono text-[8px] uppercase tracking-[0.3em] mb-2">
          Zone Dominance
        </div>
        {topZones.map((zone, index) => (
          <div key={index} className="flex justify-between items-center py-1 border-b border-white/10">
            <span className="text-white/60 font-mono text-xs">{zone.zone}</span>
            <div className="flex items-center gap-2">
              <span className="text-[#CCFF00] font-mono text-xs font-bold">{zone.touches}</span>
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositionHeatmap;