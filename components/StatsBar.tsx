import React from 'react';
import { MILESTONES } from '../constants';

const StatsBar: React.FC = () => {
  return (
    <section id="skills" className="py-24 md:py-48 bg-obsidian relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="grid grid-cols-12 h-full">
            {Array.from({length: 12}).map((_, i) => <div key={i} className="border-r border-white/5" />)}
         </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-10">
           <div className="max-w-2xl">
              <span className="text-[#39FF14] font-mono tracking-[0.5em] text-[10px] font-bold uppercase mb-4 block">System Metrics</span>
              <h2 className="font-display text-5xl md:text-9xl font-black uppercase tracking-tighter italic italic">Performance <br /><span className="text-white/10">Parameters</span></h2>
           </div>
           <div className="pb-4">
              <div className="w-20 h-[2px] bg-[#39FF14]" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Execution Time", val: MILESTONES.hoursTrained, desc: "Training Load Output" },
            { label: "Ability Unlocked", val: MILESTONES.skillsMastered, desc: "Technical Database" },
            { label: "Data Broadcast", val: MILESTONES.clipsShared, desc: "Global Footprint" },
            { label: "Core Integrity", val: MILESTONES.passionLevel, desc: "Drive Level" },
          ].map((item, i) => (
            <div key={i} className="group p-10 glass border-white/10 relative overflow-hidden transition-all duration-500 hover:glow-green hover:translate-y-[-10px]">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#39FF14]/20 group-hover:bg-[#39FF14] transition-colors" />
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-10">{item.label}</div>
              <div className="text-5xl md:text-7xl font-display font-black text-white mb-4 italic tracking-tighter group-hover:text-[#39FF14] transition-colors">
                {item.val}
              </div>
              <div className="h-[1px] w-full bg-white/5 mb-4" />
              <div className="text-white/20 text-[9px] font-mono uppercase tracking-widest">{item.desc}</div>
              
              {/* Futuristic progress dots */}
              <div className="flex gap-1 mt-6">
                {Array.from({length: 8}).map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx < 6 ? 'bg-[#39FF14]' : 'bg-white/10'} opacity-50`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;