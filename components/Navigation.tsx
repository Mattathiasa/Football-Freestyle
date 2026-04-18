import React, { useState, useEffect } from 'react';
import { PLAYER_NAME } from '../constants';
import Logo from './Logo';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const nameParts = (PLAYER_NAME || "MATTATHIAS ABRAHAM").split(' ');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const sections = ['about', 'highlights', 'analytics', 'skills'];
      const scrollPosition = window.scrollY + 100; // Offset for better detection
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-6 lg:px-12 transition-all duration-700 ${
        isScrolled ? 'backdrop-blur-3xl bg-black/80 border-b border-white/5 py-2 md:py-3' : 'bg-transparent py-4 md:py-8'
      }`}>
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer"
        >
          <Logo variant="navigation" size="medium" showText={true} />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 lg:gap-12 text-[10px] lg:text-xs font-mono font-bold uppercase tracking-[0.3em] text-white/30">
          {['about', 'highlights', 'analytics', 'skills'].map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              onClick={(e) => scrollToSection(e, item)}
              className={`hover:text-[#CCFF00] transition-all relative group py-2 ${
                activeSection === item ? 'text-[#CCFF00]' : ''
              }`}
            >
              {item}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#CCFF00] transition-all duration-500 ${
                activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center space-y-1 group mobile-menu-container"
          aria-label="Toggle mobile menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-45 translate-y-2' : 'group-hover:bg-[#CCFF00]'
          }`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-0' : 'group-hover:bg-[#CCFF00]'
          }`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-2' : 'group-hover:bg-[#CCFF00]'
          }`} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Menu Content */}
          <div className="mobile-menu-container absolute top-0 right-0 w-64 h-full bg-black/95 backdrop-blur-xl border-l border-white/10">
            {/* Menu Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-[#CCFF00]" />
                <span className="text-[#CCFF00] font-mono text-[10px] uppercase tracking-[0.4em] font-bold">Menu</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-6 space-y-6">
              {['about', 'highlights', 'analytics', 'skills'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  onClick={(e) => scrollToSection(e, item)}
                  className={`block transition-all duration-300 relative group ${
                    activeSection === item ? 'text-[#CCFF00]' : 'text-white/70 hover:text-[#CCFF00]'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-xs ${
                      activeSection === item ? 'text-[#CCFF00]' : 'text-[#CCFF00]/30'
                    }`}>
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold uppercase tracking-[0.2em]">
                        {item}
                      </span>
                      <span className="text-[10px] text-white/30 font-mono uppercase tracking-[0.3em] mt-1">
                        {item === 'about'     && 'Player Profile'}
                        {item === 'highlights' && 'Video Archive'}
                        {item === 'analytics' && 'Performance Data'}
                        {item === 'skills'    && 'Technical Abilities'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover line */}
                  <div className={`absolute left-8 bottom-0 h-[1px] bg-[#CCFF00] transition-all duration-300 ${
                    activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-white/20 font-mono text-[8px] uppercase tracking-[0.4em] mb-2">
                  Elite Football Portfolio
                </div>
                <div className="text-[#CCFF00]/50 font-mono text-[10px] uppercase tracking-[0.3em]">
                  {PLAYER_NAME}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 right-4 w-16 h-16 border border-[#CCFF00]/10 rotate-45" />
            <div className="absolute bottom-32 left-4 w-12 h-12 border border-[#CCFF00]/5 rotate-12" />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;