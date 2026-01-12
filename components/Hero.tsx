import React, { useRef, useEffect } from 'react';
import { PLAYER_NAME, PLAYER_TITLE, PLAYER_TAGLINE } from '../constants';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.1; // Speed it up for excitement
    }
  }, []);

  const scrollToHighlights = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-40 brightness-75 grayscale group-hover:grayscale-0 transition-all duration-1000"
        autoPlay loop muted playsInline
      >
        <source src="https://dl.dropboxusercontent.com/scl/fi/ne8m29g7pfndga8h6w4p3/Matty-Summer-2K19.mp4?rlkey=43cqv8mv5qpz8u47rc5mvpv2p&st=gs9iclqp&raw=1" type="video/mp4" />
      </video>

      {/* Futuristic Tactical Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
         <div className="absolute top-[20%] left-[10%] w-[1px] h-[40%] bg-[#39FF14]" />
         <div className="absolute top-[10%] right-[10%] w-[20%] h-[1px] bg-[#39FF14]" />
         <div className="absolute bottom-[20%] left-[5%] text-[#39FF14] font-mono text-[8px] flex flex-col gap-1">
            <span>// ANALYZING_FLUIDITY...</span>
            <span>// TRACKING_POSITION_X: 104.22</span>
            <span>// TRACKING_POSITION_Y: 88.01</span>
         </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

      <div className="relative z-20 text-center px-6 max-w-6xl">
        <div className="mb-12 flex flex-col items-center animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-[1px] bg-[#39FF14]" />
             <span className="text-[#39FF14] font-mono tracking-[0.5em] text-[10px] font-bold uppercase">Elite Profile v3.1</span>
             <div className="w-10 h-[1px] bg-[#39FF14]" />
          </div>
          <h2 className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em] mb-2">Protocol: {PLAYER_TITLE}</h2>
        </div>
        
        <h1 className="font-display font-black text-7xl sm:text-9xl md:text-[13rem] mb-10 tracking-tighter leading-[0.8] uppercase italic">
          {PLAYER_NAME.split(' ')[0]}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] via-white to-white/10 drop-shadow-[0_0_30px_rgba(57,255,20,0.3)]">
            {PLAYER_NAME.split(' ')[1]}
          </span>
        </h1>
        
        <p className="text-sm md:text-2xl font-light text-white/50 mb-16 tracking-widest italic font-mono uppercase">
          [ {PLAYER_TAGLINE} ]
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a 
            href="#highlights"
            onClick={scrollToHighlights}
            className="w-full sm:w-auto px-12 py-6 bg-[#39FF14] text-black font-display font-bold text-2xl italic hover:bg-white transition-all duration-500 rounded-sm shadow-[0_0_50px_rgba(57,255,20,0.4)] flex items-center gap-4 group no-underline"
          >
            <span>INITIALIZE FEED</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:translate-x-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
          
          <div className="hidden sm:flex items-center gap-6 py-6 px-10 rounded-sm border border-white/10 backdrop-blur-xl glass">
            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
            <span className="text-white font-mono text-[10px] font-bold uppercase tracking-widest">Live: Skill Sync Active</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#39FF14] to-transparent animate-pulse" />
        <span className="text-[8px] font-mono uppercase tracking-[0.5em] font-bold text-[#39FF14]">Data Stream</span>
      </div>
    </section>
  );
};

export default Hero;