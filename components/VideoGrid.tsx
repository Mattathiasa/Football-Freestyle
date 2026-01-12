
import React, { useState, useEffect, useRef } from 'react';
import { HIGHLIGHTS } from '../constants';
import { Highlight } from '../types';
import { videoCache } from '../videoCache';

const ITEMS_PER_PAGE = 9;

const VideoCard: React.FC<{ clip: Highlight, onClick: (url: string) => void }> = ({ clip, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // We use the normalized URL immediately to prevent "waiting for blob"
  const videoSrc = clip.videoUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com') + (clip.videoUrl.includes('?') ? '&raw=1' : '?raw=1');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Trigger high priority cache for visible items
          videoCache.prefetch(clip.videoUrl, 'high');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [clip.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && isVisible) {
      if (isHovering) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [isHovering, isVisible]);

  return (
    <div 
      ref={containerRef}
      className="group relative aspect-[9/11] overflow-hidden cursor-pointer rounded-2xl md:rounded-3xl glass transition-all duration-700 hover:scale-[1.02] hover:glow-green bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onClick(videoSrc)}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {isVisible && (
          <>
            <video
              src={`${videoSrc}#t=0.1`}
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl transition-all duration-700"
              muted playsInline preload="metadata"
              crossOrigin="anonymous"
              loop
            />
            <video
              ref={videoRef}
              src={`${videoSrc}#t=0.1`}
              className="relative w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-all duration-700"
              muted loop playsInline preload="auto"
              crossOrigin="anonymous"
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      </div>

      <div className="corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-bl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-br opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-6 left-6 z-20 flex flex-col gap-1">
        <span className="text-[#39FF14] font-mono text-[9px] tracking-tighter uppercase">{clip.category}</span>
        <span className="text-white/30 font-mono text-[9px] tracking-tighter uppercase">UNIT: {clip.id.split('-').pop()}</span>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 z-20">
         <div className="h-[1px] w-full bg-white/10 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#39FF14] w-0 group-hover:w-full transition-all duration-1000" />
         </div>
         <h3 className="font-display text-2xl md:text-3xl font-black italic text-white mb-2 leading-none">{clip.title}</h3>
         <div className="flex gap-4 opacity-40 group-hover:opacity-100 transition-all">
            {clip.stats && (
              <>
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-white/50 uppercase">Pwr</span>
                  <span className="text-xs font-mono font-bold text-[#39FF14]">{clip.stats.power}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-white/50 uppercase">Spd</span>
                  <span className="text-xs font-mono font-bold text-[#39FF14]">{clip.stats.speed}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-white/50 uppercase">Ctl</span>
                  <span className="text-xs font-mono font-bold text-[#39FF14]">{clip.stats.control}</span>
                </div>
              </>
            )}
         </div>
      </div>
    </div>
  );
};

const VideoGrid: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVideoSrc, setModalVideoSrc] = useState<string>('');
  const [isModalReady, setIsModalReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Recap', 'Match', '1v1', 'Skills', 'Pingball', 'Warmup', 'Training'];
  
  const filteredHighlights = filter === 'All' 
    ? HIGHLIGHTS 
    : HIGHLIGHTS.filter(h => h.category === filter);

  const totalPages = Math.ceil(filteredHighlights.length / ITEMS_PER_PAGE);
  const paginatedHighlights = filteredHighlights.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Background prefetch
  useEffect(() => {
    paginatedHighlights.forEach(h => videoCache.prefetch(h.videoUrl, 'high'));
    HIGHLIGHTS.forEach(h => videoCache.prefetch(h.videoUrl, 'low'));
  }, [currentPage, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const openModal = (highlight: Highlight, finalUrl: string) => {
    setActiveHighlight(highlight);
    setIsModalReady(false);
    setModalVideoSrc(finalUrl);
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      const vid = modalVideoRef.current;
      if (vid && isFinite(vid.duration) && vid.duration > 0) {
        setProgress((vid.currentTime / vid.duration) * 100);
      }
    };
    const vid = modalVideoRef.current;
    if (vid) vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => vid?.removeEventListener('timeupdate', handleTimeUpdate);
  }, [modalVideoSrc]);

  useEffect(() => {
    document.body.style.overflow = activeHighlight ? 'hidden' : 'auto';
    if (!activeHighlight) {
      setModalVideoSrc('');
      setIsModalReady(false);
    }
  }, [activeHighlight]);

  return (
    <section id="highlights" className="py-24 md:py-40 px-6 bg-obsidian relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#39FF14]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-[2px] bg-[#39FF14]" />
               <span className="text-[#39FF14] font-mono tracking-[0.4em] text-xs font-bold uppercase">Tactical Feed</span>
            </div>
            <h2 className="font-display text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
              Video <br />
              <span className="text-white/20">Archive</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-500 rounded-sm border ${
                  filter === cat 
                  ? 'bg-[#39FF14] border-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]' 
                  : 'bg-white/5 border-white/10 text-white/30 hover:text-[#39FF14]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedHighlights.map((clip) => (
            <VideoCard key={clip.id} clip={clip} onClick={(url) => openModal(clip, url)} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 flex items-center justify-center font-mono text-[10px] border transition-all duration-500 ${
                    currentPage === i + 1 
                    ? 'bg-[#39FF14] border-[#39FF14] text-black font-black shadow-[0_0_15px_#39FF14]' 
                    : 'bg-white/5 border-white/10 text-white/20 hover:border-[#39FF14]'
                  }`}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {activeHighlight && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 z-0" onClick={() => setActiveHighlight(null)} />
          <div ref={playerContainerRef} className="relative w-full h-full flex flex-col items-center justify-center z-10 overflow-hidden">
            <div className="absolute top-8 right-8 z-[120]">
              <button 
                onClick={() => setActiveHighlight(null)} 
                className="w-14 h-14 bg-white/10 hover:bg-[#39FF14] hover:text-black rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="w-full h-full flex items-center justify-center bg-black relative">
              {!isModalReady && (
                <div className="flex flex-col items-center gap-4 z-20">
                   <div className="w-16 h-16 border-2 border-[#39FF14]/20 border-t-[#39FF14] rounded-full animate-spin" />
                   <span className="text-[10px] font-mono text-[#39FF14] uppercase tracking-[0.5em] animate-pulse">Syncing Stream...</span>
                </div>
              )}
              {modalVideoSrc && (
                <video 
                  ref={modalVideoRef} 
                  className="w-full h-full object-contain z-0" 
                  autoPlay 
                  loop
                  controls={false} 
                  playsInline 
                  preload="auto" 
                  crossOrigin="anonymous"
                  onCanPlay={() => setIsModalReady(true)}
                  onClick={() => {
                    const video = modalVideoRef.current;
                    if (video) video.paused ? video.play().catch(() => {}) : video.pause();
                  }}
                >
                  <source src={modalVideoSrc} type="video/mp4" />
                </video>
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-[110] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none">
              <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pointer-events-auto">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-[#39FF14] text-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-tighter italic">{activeHighlight.category}</span>
                      <div className="w-32 h-[1px] bg-white/20" />
                      <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em]">UNIT_{activeHighlight.id.split('-').pop()}</span>
                    </div>
                    
                    <h4 className="font-display text-4xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none mb-8 drop-shadow-2xl">{activeHighlight.title}</h4>
                    
                    <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group/progress mb-4" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickedPos = (e.clientX - rect.left) / rect.width;
                      if (modalVideoRef.current && isFinite(modalVideoRef.current.duration)) {
                        modalVideoRef.current.currentTime = clickedPos * modalVideoRef.current.duration;
                      }
                    }}>
                       <div className="absolute top-0 left-0 h-full bg-[#39FF14] shadow-[0_0_20px_#39FF14]" style={{ width: `${progress}%` }} />
                    </div>
                    
                    <div className="flex justify-between font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">
                       <span>00:{Math.floor((modalVideoRef.current?.currentTime || 0)).toString().padStart(2, '0')}</span>
                       <span className="text-[#39FF14]/50 hidden sm:inline">HIGH_SPEED_BUFFER // ACTIVE</span>
                       <span>00:{Math.floor((modalVideoRef.current?.duration || 0)).toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  {activeHighlight.stats && (
                    <div className="flex gap-8 p-6 glass border-white/10 backdrop-blur-md">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-white/40 uppercase mb-1">Power</span>
                        <span className="text-xl font-display font-black text-[#39FF14] italic">{activeHighlight.stats.power}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-white/40 uppercase mb-1">Speed</span>
                        <span className="text-xl font-display font-black text-[#39FF14] italic">{activeHighlight.stats.speed}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-white/40 uppercase mb-1">Control</span>
                        <span className="text-xl font-display font-black text-[#39FF14] italic">{activeHighlight.stats.control}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 pointer-events-none z-[115] opacity-20">
              <div className="corner-tl border-l border-t border-[#39FF14] w-20 h-20 m-4" />
              <div className="corner-tr border-r border-t border-[#39FF14] w-20 h-20 m-4" />
              <div className="corner-bl border-l border-b border-[#39FF14] w-20 h-20 m-4" />
              <div className="corner-br border-r border-b border-[#39FF14] w-20 h-20 m-4" />
              <div className="scanline" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoGrid;
