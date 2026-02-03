import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { FootEfficiency } from '../../types';

interface FootEfficiencyRadarProps {
  data: FootEfficiency[];
}

const FootEfficiencyRadar: React.FC<FootEfficiencyRadarProps> = ({ data }) => {
  // Transform data for radar chart
  const leftFoot = data.find(d => d.foot === 'left');
  const rightFoot = data.find(d => d.foot === 'right');

  const radarData = [
    {
      metric: 'Accuracy',
      leftFoot: leftFoot?.shotAccuracy || 0,
      rightFoot: rightFoot?.shotAccuracy || 0,
      fullMark: 100
    },
    {
      metric: 'Conversion',
      leftFoot: leftFoot?.goalConversion || 0,
      rightFoot: rightFoot?.goalConversion || 0,
      fullMark: 100
    },
    {
      metric: 'Power',
      leftFoot: leftFoot?.power || 0,
      rightFoot: rightFoot?.power || 0,
      fullMark: 100
    },
    {
      metric: 'Curve',
      leftFoot: leftFoot?.curve || 0,
      rightFoot: rightFoot?.curve || 0,
      fullMark: 100
    },
    {
      metric: 'First Touch',
      leftFoot: leftFoot?.firstTouchShots || 0,
      rightFoot: rightFoot?.firstTouchShots || 0,
      fullMark: 100
    }
  ];

  // Calculate overall foot preference
  const leftFootAvg = radarData.reduce((sum, item) => sum + item.leftFoot, 0) / radarData.length;
  const rightFootAvg = radarData.reduce((sum, item) => sum + item.rightFoot, 0) / radarData.length;
  const strongerFoot = leftFootAvg > rightFootAvg ? 'Left' : 'Right';
  const footDifference = Math.abs(leftFootAvg - rightFootAvg);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid 
              stroke="rgba(255,255,255,0.1)" 
              gridType="polygon"
            />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ 
                fontSize: 10, 
                fill: 'rgba(255,255,255,0.6)',
                fontFamily: 'monospace'
              }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ 
                fontSize: 8, 
                fill: 'rgba(255,255,255,0.4)',
                fontFamily: 'monospace'
              }}
              tickCount={5}
            />
            
            <Radar
              name="Left Foot"
              dataKey="leftFoot"
              stroke="rgba(204, 255, 0, 0.8)"
              fill="rgba(204, 255, 0, 0.1)"
              strokeWidth={2}
            />
            
            <Radar
              name="Right Foot"
              dataKey="rightFoot"
              stroke="rgba(255, 255, 255, 0.8)"
              fill="rgba(255, 255, 255, 0.1)"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Foot Analysis */}
      <div className="mt-4 space-y-3">
        <div className="text-center glass p-3 border border-[#CCFF00]/20">
          <div className="text-[#CCFF00] font-mono text-[8px] uppercase tracking-[0.3em] mb-1">
            Dominant Foot
          </div>
          <div className="text-white font-display font-black italic text-sm">
            {strongerFoot}
          </div>
          <div className="text-white/60 font-mono text-xs">
            +{footDifference.toFixed(1)}% advantage
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-[1px] bg-[#CCFF00]" />
              <span className="text-white/60 font-mono text-xs">Left</span>
            </div>
            <span className="text-[#CCFF00] font-mono text-xs font-bold">
              {leftFootAvg.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-[1px] bg-white/60" />
              <span className="text-white/60 font-mono text-xs">Right</span>
            </div>
            <span className="text-white/60 font-mono text-xs font-bold">
              {rightFootAvg.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootEfficiencyRadar;