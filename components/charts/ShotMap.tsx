import React from 'react';
import { ShotData } from '../../types';

interface ShotMapProps {
  data: ShotData[];
}

const ShotMap: React.FC<ShotMapProps> = ({ data }) => {
  const pitchWidth = 350;
  const pitchHeight = 250; // Half pitch for shots
  
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'goal': return '#CCFF00'; // Neon green
      case 'on-target': return 'rgba(204, 255, 0, 0.6)'; // Semi-transparent green
      case 'miss': return 'rgba(255, 255, 255, 0.3)'; // Light white
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };

  const getMarkerSize = (xG: number) => {
    return 6 + (xG * 12); // Size based on xG value
  };

  // Calculate statistics
  const totalShots = data.length;
  const goals = data.filter(shot => shot.outcome === 'goal').length;
  const onTarget = data.filter(shot => shot.outcome === 'on-target').length;
  const leftFootShots = data.filter(shot => shot.foot === 'left').length;
  const rightFootShots = data.filter(shot => shot.foot === 'right').length;
  const leftFootGoals = data.filter(shot => shot.foot === 'left' && shot.outcome === 'goal').length;
  const rightFootGoals = data.filter(shot => shot.foot === 'right' && shot.outcome === 'goal').length;

  const TriangleMarker = ({ cx, cy, size, color }: any) => {
    const points = `${cx},${cy - size} ${cx - size},${cy + size} ${cx + size},${cy + size}`;
    return <polygon points={points} fill={color} stroke="rgba(0,0,0,0.5)" strokeWidth="1" />;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <svg width={pitchWidth} height={pitchHeight} className="border border-white/20 rounded-lg">
          {/* Half pitch background */}
          <rect 
            width={pitchWidth} 
            height={pitchHeight} 
            fill="rgba(0, 0, 0, 0.3)" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          
          {/* Penalty area */}
          <rect 
            x="70" 
            y={pitchHeight - 80} 
            width="210" 
            height="80" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          
          {/* Goal area */}
          <rect 
            x="130" 
            y={pitchHeight - 30} 
            width="90" 
            height="30" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          
          {/* Goal line */}
          <line 
            x1="0" 
            y1={pitchHeight} 
            x2={pitchWidth} 
            y2={pitchHeight} 
            stroke="#CCFF00" 
            strokeWidth="2"
          />
          
          {/* Shot markers */}
          {data.map((shot, index) => {
            const x = (shot.x / 100) * pitchWidth;
            const y = (shot.y / 100) * pitchHeight;
            const size = getMarkerSize(shot.xG);
            const color = getOutcomeColor(shot.outcome);
            
            return (
              <g key={index} className="transition-all duration-300 hover:opacity-100">
                {shot.foot === 'right' ? (
                  <circle
                    cx={x}
                    cy={y}
                    r={size}
                    fill={color}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="1"
                    opacity={0.8}
                  />
                ) : (
                  <TriangleMarker cx={x} cy={y} size={size} color={color} />
                )}
                
                {/* xG value label for high-value chances */}
                {shot.xG > 0.4 && (
                  <text
                    x={x}
                    y={y + 2}
                    textAnchor="middle"
                    fontSize="6"
                    fill="#000"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {shot.xG.toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Statistics */}
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-[#CCFF00] font-display font-black text-lg italic">{((goals / totalShots) * 100).toFixed(1)}%</div>
            <div className="text-white/40 font-mono text-[8px] uppercase tracking-[0.3em]">Conversion</div>
          </div>
          <div className="text-center">
            <div className="text-[#CCFF00] font-display font-black text-lg italic">{(((goals + onTarget) / totalShots) * 100).toFixed(1)}%</div>
            <div className="text-white/40 font-mono text-[8px] uppercase tracking-[0.3em]">On Target</div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center py-1 border-b border-white/10">
            <span className="text-white/60 font-mono text-xs flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#CCFF00] opacity-60" />
              Right Foot
            </span>
            <span className="text-[#CCFF00] font-mono text-xs font-bold">
              {rightFootShots > 0 ? ((rightFootGoals / rightFootShots) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-white/60 font-mono text-xs flex items-center gap-2">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#CCFF00] opacity-60" />
              Left Foot
            </span>
            <span className="text-[#CCFF00] font-mono text-xs font-bold">
              {leftFootShots > 0 ? ((leftFootGoals / leftFootShots) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotMap;