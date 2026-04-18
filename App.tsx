import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FootballScrollSequence from './components/FootballScrollSequence';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  const scrollToFooter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-obsidian selection:bg-[#CCFF00] selection:text-black">
      <Navigation />

      <main className="relative z-10">
        {/* 1 ─ Hero: full-screen video intro */}
        <Hero />

        {/* 2 ─ Scroll journey: About / Skills / Performance / Analytics / CTA */}
        <FootballScrollSequence />

        {/* 3 ─ Highlights: video archive */}
        <VideoGrid />

        {/* 4 ─ Connect CTA */}
        <section id="connect" className="py-40 md:py-60 px-6 text-center relative overflow-hidden bg-obsidian border-t border-white/5">
          <div className="absolute inset-0 z-0 bg-hex opacity-5" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-block px-6 py-2 glass border-[#CCFF00]/20 text-[#CCFF00] font-mono text-[9px] uppercase tracking-[0.5em] mb-12">
              Initiate_Network_Sync
            </div>
            <h3 className="font-display text-5xl md:text-8xl font-black mb-10 uppercase italic tracking-tighter leading-none">
              Connect To<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-white">
                The Grid
              </span>
            </h3>
            <p className="text-white/30 mb-16 text-lg font-mono uppercase tracking-widest max-w-2xl mx-auto">
              Streaming skills, tactical breakdowns, and behind-the-scenes data daily.
            </p>
            <a
              href="#footer"
              onClick={scrollToFooter}
              className="inline-flex items-center gap-4 px-16 py-6 glass bg-white/5 border-white/20 text-white font-display font-black italic uppercase text-lg tracking-[0.2em] hover:bg-[#CCFF00] hover:text-black transition-all duration-300 no-underline group"
            >
              <span>OPEN HUD</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] group-hover:bg-black group-hover:animate-ping" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
