import React from 'react';
import { PerformanceData, HeatmapData, ShotData, FootEfficiency } from '../types';
import PrimeYearsCurve from './charts/PrimeYearsCurve';
import PositionHeatmap from './charts/PositionHeatmap';
import ShotMap from './charts/ShotMap';
import FootEfficiencyRadar from './charts/FootEfficiencyRadar';

interface PerformanceDashboardProps {
  performanceData: PerformanceData[];
  heatmapData: HeatmapData[];
  shotData: ShotData[];
  footEfficiencyData: FootEfficiency[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  performanceData,
  heatmapData,
  shotData,
  footEfficiencyData
}) => {
  return (
    <section id="analytics" className="py-24 md:py-40 px-6 bg-obsidian relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-hex opacity-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[30%] left-[5%] w-[300px] h-[300px] bg-[#CCFF00]/3 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Tactical Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
        <div className="absolute top-[15%] left-[8%] w-[1px] h-[30%] bg-[#CCFF00]" />
        <div className="absolute top-[10%] right-[15%] w-[25%] h-[1px] bg-[#CCFF00]" />
        <div className="absolute bottom-[25%] right-[8%] text-[#CCFF00] font-mono text-[8px] flex flex-col gap-1">
          <span>// ANALYZING_PERFORMANCE_DATA...</span>
          <span>// PRIME_YEARS_DETECTED: TRUE</span>
          <span>// TACTICAL_INTELLIGENCE: 94.7%</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#CCFF00]" />
            <span className="text-[#CCFF00] font-mono tracking-[0.4em] text-xs font-bold uppercase">Performance Matrix</span>
          </div>
          <h2 className="font-display text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white mb-8">
            Data <br />
            <span className="text-white/20">Analytics</span>
          </h2>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest max-w-2xl">
            [ TACTICAL INTELLIGENCE BREAKDOWN // PERFORMANCE METRICS // ELITE ANALYSIS ]
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-16">
          {/* Prime Years Performance Curve */}
          <div className="group relative glass rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:glow-green">
            <div className="corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-bl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-br opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-[#CCFF00] text-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-tighter italic">Prime Analysis</span>
                <div className="w-16 h-[1px] bg-white/20" />
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em]">UNIT_01</span>
              </div>
              
              <h3 className="font-display text-2xl md:text-4xl font-black italic text-white mb-4 leading-none">
                Peak Years <br />
                <span className="text-[#CCFF00]">Curve</span>
              </h3>
              
              <p className="text-white/30 font-mono text-xs mb-8 uppercase tracking-widest">
                Performance trajectory analysis // Prime detection algorithm
              </p>
              
              <div className="h-[300px] relative">
                <PrimeYearsCurve data={performanceData} />
              </div>
              
              <div className="h-[1px] w-full bg-white/10 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#CCFF00] w-0 group-hover:w-full transition-all duration-1000" />
              </div>
            </div>
          </div>

          {/* Position Heatmap */}
          <div className="group relative glass rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:glow-green">
            <div className="corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-bl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-br opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-[#CCFF00] text-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-tighter italic">Zone Map</span>
                <div className="w-16 h-[1px] bg-white/20" />
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em]">UNIT_02</span>
              </div>
              
              <h3 className="font-display text-2xl md:text-4xl font-black italic text-white mb-4 leading-none">
                Tactical <br />
                <span className="text-[#CCFF00]">Heatmap</span>
              </h3>
              
              <p className="text-white/30 font-mono text-xs mb-8 uppercase tracking-widest">
                Field presence analysis // Zone dominance metrics
              </p>
              
              <div className="h-[300px] relative">
                <PositionHeatmap data={heatmapData} />
              </div>
              
              <div className="h-[1px] w-full bg-white/10 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#CCFF00] w-0 group-hover:w-full transition-all duration-1000" />
              </div>
            </div>
          </div>

          {/* Shot Map */}
          <div className="group relative glass rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:glow-green">
            <div className="corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-bl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-br opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-[#CCFF00] text-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-tighter italic">Shot Analysis</span>
                <div className="w-16 h-[1px] bg-white/20" />
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em]">UNIT_03</span>
              </div>
              
              <h3 className="font-display text-2xl md:text-4xl font-black italic text-white mb-4 leading-none">
                Clinical <br />
                <span className="text-[#CCFF00]">Finishing</span>
              </h3>
              
              <p className="text-white/30 font-mono text-xs mb-8 uppercase tracking-widest">
                Shot map by foot // xG integration // Efficiency metrics
              </p>
              
              <div className="h-[300px] relative">
                <ShotMap data={shotData} />
              </div>
              
              <div className="h-[1px] w-full bg-white/10 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#CCFF00] w-0 group-hover:w-full transition-all duration-1000" />
              </div>
            </div>
          </div>

          {/* Foot Efficiency Radar */}
          <div className="group relative glass rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:glow-green">
            <div className="corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-bl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-br opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-[#CCFF00] text-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-tighter italic">Foot Radar</span>
                <div className="w-16 h-[1px] bg-white/20" />
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em]">UNIT_04</span>
              </div>
              
              <h3 className="font-display text-2xl md:text-4xl font-black italic text-white mb-4 leading-none">
                Dual Foot <br />
                <span className="text-[#CCFF00]">Efficiency</span>
              </h3>
              
              <p className="text-white/30 font-mono text-xs mb-8 uppercase tracking-widest">
                Left vs Right comparison // Power & accuracy analysis
              </p>
              
              <div className="h-[300px] relative">
                <FootEfficiencyRadar data={footEfficiencyData} />
              </div>
              
              <div className="h-[1px] w-full bg-white/10 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#CCFF00] w-0 group-hover:w-full transition-all duration-1000" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass p-6 text-center transition-all duration-500 hover:glow-green">
            <div className="text-3xl md:text-4xl font-display font-black text-[#CCFF00] italic mb-2">98</div>
            <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.3em]">Peak Score</div>
          </div>
          <div className="glass p-6 text-center transition-all duration-500 hover:glow-green">
            <div className="text-3xl md:text-4xl font-display font-black text-[#CCFF00] italic mb-2">22</div>
            <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.3em]">Prime Age</div>
          </div>
          <div className="glass p-6 text-center transition-all duration-500 hover:glow-green">
            <div className="text-3xl md:text-4xl font-display font-black text-[#CCFF00] italic mb-2">78%</div>
            <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.3em]">Shot Accuracy</div>
          </div>
          <div className="glass p-6 text-center transition-all duration-500 hover:glow-green">
            <div className="text-3xl md:text-4xl font-display font-black text-[#CCFF00] italic mb-2">167</div>
            <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.3em]">Zone Touches</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceDashboard;