import React, { useState, useEffect, useRef } from 'react';
import { PLAYER_NAME } from '../constants';
import Logo from './Logo';

const NAV_ITEMS = [
  { id: 'journey',    label: 'Journey',    sub: 'The Story'      },
  { id: 'highlights', label: 'Highlights', sub: 'Video Archive'  },
  { id: 'connect',    label: 'Connect',    sub: 'Get In Touch'   },
];

const Navigation: React.FC = () => {
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection,    setActiveSection]    = useState('');

  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const scrollPos = window.scrollY + 100;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(item.id);
          return;
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (isMobileMenuOpen && !t.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMobileMenuOpen]);

  // Focus management for the mobile menu: initial focus, Escape and Tab trap
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusables: HTMLElement[] = Array.from(
      drawer.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])')
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    window.setTimeout(() => first?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      if (!focusables.length) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    // 'connect' maps to the footer section
    const targetId = id === 'connect' ? 'footer' : id;
    const el = document.getElementById(targetId);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleLogoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── Desktop / base nav ─────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 lg:px-12 transition-all duration-700 ${
          isScrolled
            ? 'backdrop-blur-3xl bg-black/80 border-b border-white/5 py-2 md:py-3'
            : 'bg-transparent py-4 md:py-8'
        }`}
      >
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onKeyDown={handleLogoKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Back to top"
          className="cursor-pointer"
        >
          <Logo variant="navigation" size="medium" showText={true} />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 lg:gap-12 items-center">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={e => scrollTo(e, item.id)}
              aria-current={activeSection === item.id ? 'true' : undefined}
              className={`relative group py-2 font-mono font-bold uppercase tracking-[0.3em] text-xs lg:text-sm transition-all ${
                activeSection === item.id ? 'text-[#CCFF00]' : 'text-white/30 hover:text-white/80'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-[#CCFF00] transition-all duration-500 ${
                  activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </a>
          ))}

          {/* CTA pill */}
          <a
            href="#highlights"
            onClick={e => scrollTo(e, 'highlights')}
            className="hidden lg:flex items-center gap-2.5 px-5 py-2.5 border border-[#CCFF00]/25 text-[#CCFF00] font-mono font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#CCFF00] hover:text-black transition-all duration-300 no-underline"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping" />
            Highlights
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          onClick={() => setIsMobileMenuOpen(v => !v)}
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 group mobile-menu-container"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-drawer"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : 'group-hover:bg-[#CCFF00]'}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'group-hover:bg-[#CCFF00]'}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : 'group-hover:bg-[#CCFF00]'}`} />
        </button>
      </nav>

      {/* ── Mobile menu overlay ─────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <div
            ref={drawerRef}
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="mobile-menu-container absolute top-0 right-0 w-72 h-full bg-black/96 backdrop-blur-xl border-l border-white/8 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/8 flex items-center gap-3">
              <div className="w-7 h-[2px] bg-[#CCFF00]" />
              <span className="text-[#CCFF00] font-mono text-xs uppercase tracking-[0.4em] font-bold">Navigation</span>
            </div>

            {/* Links */}
            <div className="flex-1 p-6 space-y-2">
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={e => scrollTo(e, item.id)}
                  aria-current={activeSection === item.id ? 'true' : undefined}
                  className={`flex items-center gap-4 p-4 transition-all duration-300 no-underline group rounded-sm ${
                    activeSection === item.id
                      ? 'bg-[#CCFF00]/8 border-l-2 border-[#CCFF00]'
                      : 'hover:bg-white/4 border-l-2 border-transparent hover:border-[#CCFF00]/40'
                  }`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <span className={`font-mono text-xs w-5 ${activeSection === item.id ? 'text-[#CCFF00]' : 'text-[#CCFF00]/35'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col">
                    <span className={`font-mono text-sm font-bold uppercase tracking-[0.2em] ${activeSection === item.id ? 'text-[#CCFF00]' : 'text-white/70 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                    <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.3em] mt-0.5">
                      {item.sub}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Footer info */}
            <div className="p-6 border-t border-white/8">
              <div className="text-white/40 font-mono text-[11px] uppercase tracking-[0.4em] mb-1">Football Portfolio</div>
              <div className="text-[#CCFF00]/50 font-mono text-xs uppercase tracking-[0.3em]">{PLAYER_NAME}</div>
            </div>

            {/* Decorative */}
            <div className="absolute top-24 right-4 w-16 h-16 border border-[#CCFF00]/8 rotate-45 pointer-events-none" />
            <div className="absolute bottom-40 left-4 w-10 h-10 border border-[#CCFF00]/5 rotate-12 pointer-events-none" />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
