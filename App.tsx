import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';
import { PLAYER_NAME } from './constants';

const App: React.FC = () => {
  const scrollToFooter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('footer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian selection:bg-[#39FF14] selection:text-black">
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        
        {/* The Story Section - Redesigned as Tactical Intelligence */}
        <section id="story" className="py-32 md:py-60 px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-hex opacity-20 pointer-events-none" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center relative z-10">
            <div className="relative order-2 lg:order-1">
               <div className="absolute -inset-20 bg-[#39FF14]/5 rounded-full blur-[150px] animate-pulse" />
               <div className="relative aspect-square glass rounded-sm overflow-hidden p-2 group">
                  <div className="absolute inset-0 z-20 pointer-events-none">
                     <div className="corner-tl" /> <div className="corner-tr" /> <div className="corner-bl" /> <div className="corner-br" />
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                    alt="Tactical Journey"
                  />
                  <div className="absolute bottom-8 left-8 z-30">
                     <span className="font-mono text-[9px] text-[#39FF14] block mb-2 uppercase tracking-[0.4em]">Subsystem_Heart.exe</span>
                     <h3 className="font-display text-4xl font-black text-white uppercase italic tracking-tighter">Inner Core</h3>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-8 h-8 rounded-full border border-[#39FF14] flex items-center justify-center text-[#39FF14] font-mono text-[10px]">01</div>
                  <span className="text-[#39FF14] font-mono tracking-[0.5em] text-[10px] font-bold uppercase">Intelligence_Profile</span>
               </div>
               
               <h2 className="text-6xl md:text-9xl font-display font-black mb-12 leading-[0.8] tracking-tighter uppercase italic">
                  Vision <br />
                  <span className="text-white/10">Engine</span>
               </h2>
               
               <div className="space-y-10 text-white/40 font-mono text-sm md:text-base leading-relaxed max-w-xl">
                  <p className="border-l-2 border-[#39FF14]/20 pl-8">
                    [LOG_START] Football is the calculation of space and the execution of intent. For Mattathias, the pitch is a canvas where physics meets passion. 
                  </p>
                  <p className="border-l-2 border-[#39FF14]/20 pl-8">
                    This archive serves as a live telemetry feed of my progression. From technical drills to the heat of the match, every clip is a data point in a journey defined by relentless refinement.
                  </p>
               </div>

               <div className="mt-16 flex items-center gap-8 group cursor-pointer">
                  <div className="w-20 h-20 rounded-sm glass flex items-center justify-center text-[#39FF14] transition-all group-hover:glow-green group-hover:scale-110">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-white font-display font-bold text-2xl uppercase italic tracking-tighter group-hover:text-[#39FF14] transition-colors">High Frequency</div>
                    <div className="text-white/20 text-[9px] uppercase font-mono tracking-widest mt-1">Status: Optimized</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <StatsBar />
        <VideoGrid />

        {/* Global Connection / Final HUD */}
        <section className="py-40 md:py-60 px-6 text-center relative overflow-hidden bg-obsidian border-t border-white/5">
          <div className="absolute inset-0 z-0 bg-hex opacity-5" />
          <div className="relative z-10 max-w-4xl mx-auto">
             <div className="inline-block px-6 py-2 glass border-[#39FF14]/20 text-[#39FF14] font-mono text-[9px] uppercase tracking-[0.5em] mb-12">
                Initiate_Network_Sync
             </div>
             <h3 className="font-display text-5xl md:text-8xl font-black mb-10 uppercase italic tracking-tighter leading-none">Connect To <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-white">The Grid</span></h3>
             <p className="text-white/30 mb-16 text-lg font-mono uppercase tracking-widest max-w-2xl mx-auto">Streaming skills, tactical breakdowns, and behind-the-scenes data daily.</p>
             <div className="flex justify-center gap-6">
               <a 
                href="#footer" 
                onClick={scrollToFooter}
                className="px-16 py-6 glass bg-white/5 border-white/20 text-white font-display font-black italic uppercase text-lg tracking-[0.2em] hover:bg-[#39FF14] hover:text-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] no-underline group flex items-center gap-4"
               >
                <span>OPEN HUD</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] group-hover:bg-black group-hover:animate-ping" />
               </a>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;