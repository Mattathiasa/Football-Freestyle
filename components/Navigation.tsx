import React, { useState, useEffect } from 'react';
import { PLAYER_NAME } from '../constants';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const nameParts = (PLAYER_NAME || "MATTATHIAS ABRAHAM").split(' ');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 transition-all duration-700 ${
      isScrolled ? 'backdrop-blur-3xl bg-black/80 border-b border-white/5 py-3' : 'bg-transparent py-8'
    }`}>
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-4 group cursor-pointer"
      >
        <div className="relative w-10 h-10 md:w-12 md:h-12 bg-black flex items-center justify-center text-[#39FF14] font-display font-bold text-xl md:text-2xl transition-all duration-500 border border-white/10 group-hover:border-[#39FF14] group-hover:glow-green">
          MA
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#39FF14] group-hover:animate-ping" />
        </div>
        <span className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase italic">
          {nameParts[0]} <span className="text-white/20">{nameParts[1]}</span>
        </span>
      </div>
      
      <div className="flex gap-6 md:gap-12 text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.3em] text-white/30">
        {['highlights', 'skills', 'story'].map((item) => (
          <a 
            key={item}
            href={`#${item}`} 
            onClick={(e) => scrollToSection(e, item)}
            className="hover:text-[#39FF14] transition-all relative group py-2"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#39FF14] transition-all duration-500 group-hover:w-full" />
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;