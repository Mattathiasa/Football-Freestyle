import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FootballScrollSequence from './components/FootballScrollSequence';
import Pitch from './components/Pitch';
import StatsBar from './components/StatsBar';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import PerformanceDashboard from './components/PerformanceDashboard';
import { PLAYER_NAME } from './constants';
import { performanceData, heatmapData, shotData, footEfficiencyData } from './data/performanceData';
import './styles/performance-dashboard.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const scrollToFooter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('footer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show loading screen while content is being preloaded
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-obsidian selection:bg-[#CCFF00] selection:text-black animate-in fade-in duration-1000">
      <Navigation />
      
      <main className="relative z-10">
        <Hero />

        <FootballScrollSequence />

        <Pitch />
        
        {/* The Story Section - Redesigned as Tactical Intelligence */}
        <section id="story" className="py-32 md:py-60 px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-hex opacity-20 pointer-events-none" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center relative z-10">
            <div className="relative order-2 lg:order-1">
               <div className="absolute -inset-20 bg-[#CCFF00]/5 rounded-full blur-[150px] animate-pulse" />
               <div className="relative aspect-square glass rounded-sm overflow-hidden p-2 group">
                  <div className="absolute inset-0 z-20 pointer-events-none">
                     <div className="corner-tl" /> <div className="corner-tr" /> <div className="corner-bl" /> <div className="corner-br" />
                  </div>
                  <img 
                    src="https://res.cloudinary.com/dg1xa7q5c/image/upload/v1770104603/IMG_20260203_104103_lksr5s.png" 
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                    alt="Tactical Journey"
                  />
                  <div className="absolute bottom-8 left-8 z-30">
                     <span className="font-mono text-[9px] text-[#CCFF00] block mb-2 uppercase tracking-[0.4em]">Subsystem_Heart.exe</span>
                     <h3 className="font-display text-4xl font-black text-white uppercase italic tracking-tighter">Inner Core</h3>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-8 h-8 rounded-full border border-[#CCFF00] flex items-center justify-center text-[#CCFF00] font-mono text-[10px]">01</div>
                  <span className="text-[#CCFF00] font-mono tracking-[0.5em] text-[10px] font-bold uppercase">Intelligence_Profile</span>
               </div>
               
               <h2 className="text-6xl md:text-9xl font-display font-black mb-12 leading-[0.8] tracking-tighter uppercase italic">
                  Vision <br />
                  <span className="text-white/10">Engine</span>
               </h2>
               
               <div className="space-y-10 text-white/40 font-mono text-sm md:text-base leading-relaxed max-w-xl">
                  <p className="border-l-2 border-[#CCFF00]/20 pl-8">
                    Built alone. Refined daily.
                  </p>
                  <p className="border-l-2 border-[#CCFF00]/20 pl-8">
                    This is my solo football work — touch, control, creativity, and precision. No crowds, no shortcuts. Just the ball, the space, and the work.
                  </p>
               </div>

               <div className="mt-16 flex items-center gap-8 group cursor-pointer">
                  <div className="w-20 h-20 rounded-sm glass flex items-center justify-center text-[#CCFF00] transition-all group-hover:glow-green group-hover:scale-110">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-white font-display font-bold text-2xl uppercase italic tracking-tighter group-hover:text-[#CCFF00] transition-colors">High Frequency</div>
                    <div className="text-white/20 text-[9px] uppercase font-mono tracking-widest mt-1">Status: Optimized</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <StatsBar />
        
        {/* Performance Analytics Dashboard */}
        <section id="analytics" className="relative">
          <PerformanceDashboard 
            performanceData={performanceData}
            heatmapData={heatmapData}
            shotData={shotData}
            footEfficiencyData={footEfficiencyData}
          />
        </section>
        
        <VideoGrid />

        {/* Global Connection / Final HUD */}
        <section className="py-40 md:py-60 px-6 text-center relative overflow-hidden bg-obsidian border-t border-white/5">
          <div className="absolute inset-0 z-0 bg-hex opacity-5" />
          <div className="relative z-10 max-w-4xl mx-auto">
             <div className="inline-block px-6 py-2 glass border-[#CCFF00]/20 text-[#CCFF00] font-mono text-[9px] uppercase tracking-[0.5em] mb-12">
                Initiate_Network_Sync
             </div>
             <h3 className="font-display text-5xl md:text-8xl font-black mb-10 uppercase italic tracking-tighter leading-none">Connect To <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-white">The Grid</span></h3>
             <p className="text-white/30 mb-16 text-lg font-mono uppercase tracking-widest max-w-2xl mx-auto">Streaming skills, tactical breakdowns, and behind-the-scenes data daily.</p>
             <div className="flex justify-center gap-6">
               <a 
                href="#footer" 
                onClick={scrollToFooter}
                className="px-16 py-6 glass bg-white/5 border-white/20 text-white font-display font-black italic uppercase text-lg tracking-[0.2em] hover:bg-[#CCFF00] hover:text-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] no-underline group flex items-center gap-4"
               >
                <span>OPEN HUD</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] group-hover:bg-black group-hover:animate-ping" />
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