import React from 'react';
import { PLAYER_NAME } from '../constants';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/mattathiasa', icon: 'IG' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@mattathiasa', icon: 'TT' },
    { name: 'GitHub', url: 'https://github.com/mattathiasa', icon: 'GH' }
  ];

  return (
    <footer id="footer" className="bg-obsidian py-32 px-6 relative border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div 
            onClick={scrollToTop}
            className="group cursor-pointer mb-12 relative"
          >
            <div className="w-24 h-24 glass flex items-center justify-center text-[#CCFF00] font-display font-black text-4xl italic transition-all duration-500 group-hover:glow-green group-hover:scale-110">
              MA
              <div className="corner-tl opacity-50" /> <div className="corner-br opacity-50" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[#CCFF00] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Back to Start
            </div>
          </div>
          
          <h2 className="font-display text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter italic">{PLAYER_NAME}</h2>
          <p className="text-white/20 font-mono mb-20 tracking-[0.5em] uppercase text-[9px]">Status: Global_Broadcast_Active</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-32">
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="glass p-10 flex flex-col items-center gap-6 group hover:glow-green transition-all duration-500 border-white/5"
              >
                <span className="text-[#CCFF00] font-mono text-xl font-black italic">{social.icon}</span>
                <div className="h-[1px] w-12 bg-white/10 group-hover:w-full group-hover:bg-[#CCFF00]/50 transition-all duration-700" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/30 group-hover:text-white transition-colors">{social.name}</span>
              </a>
            ))}
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center text-white/10 text-[8px] font-mono uppercase tracking-[0.6em] pt-12 border-t border-white/5">
             <p>© 2024 SYSTEM_MATTATHIAS. ALL_RIGHTS_RESERVED.</p>
             <div className="flex gap-8 mt-6 md:mt-0">
                <span className="hover:text-white transition-colors">PRIVACY_PROTOCOL</span>
                <span className="hover:text-white transition-colors">DATA_TERMS</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;