import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PerformanceData } from '../../types';

interface PrimeYearsCurveProps {
  data: PerformanceData[];
}

const PrimeYearsCurve: React.FC<PrimeYearsCurveProps> = ({ data }) => {
  // Find peak performance
  const peakPerformance = data.reduce((max, current) => 
    current.overallScore > max.overallScore ? current : max
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-4 border border-[#CCFF00]/20 backdrop-blur-md">
          <div className="text-[#CCFF00] font-mono text-xs font-bold uppercase tracking-widest mb-2">
            Age {label} ({data.year})
          </div>
          <div className="text-white font-display text-lg font-black italic mb-3">
            Score: {data.overallScore}/100
          </div>
          <div className="space-y-1 text-white/60 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <span>Goals:</span>
              <span className="text-[#CCFF00]">{data.goals}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Assists:</span>
              <span className="text-[#CCFF00]">{data.assists}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Dribbles:</span>
              <span className="text-[#CCFF00]">{data.successfulDribbles}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Minutes:</span>
              <span className="text-[#CCFF00]">{data.minutesPlayed}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Rating:</span>
              <span className="text-[#CCFF00]">{data.matchRating}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="age" 
            stroke="rgba(255,255,255,0.4)"
            fontSize={10}
            fontFamily="monospace"
            tick={{ fill: 'rgba(255,255,255,0.4)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.4)"
            fontSize={10}
            fontFamily="monospace"
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.4)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Peak performance reference line */}
          <ReferenceLine 
            x={peakPerformance.age} 
            stroke="#CCFF00" 
            strokeDasharray="2 2"
            strokeWidth={1}
          />
          
          <Line 
            type="monotone" 
            dataKey="overallScore" 
            stroke="#CCFF00"
            strokeWidth={2}
            dot={{ fill: '#CCFF00', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#CCFF00', stroke: '#000', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Peak indicator overlay */}
      <div className="absolute top-4 right-4 glass p-3 border border-[#CCFF00]/20">
        <div className="text-[#CCFF00] font-mono text-[8px] uppercase tracking-[0.3em] mb-1">
          Prime Detected
        </div>
        <div className="text-white font-display font-black italic text-sm">
          Age {peakPerformance.age}
        </div>
        <div className="text-white/60 font-mono text-xs">
          {peakPerformance.overallScore}/100
        </div>
      </div>
    </div>
  );
};

export default PrimeYearsCurve;