
import React, { useState, useEffect, useRef } from 'react';
import { HIGHLIGHTS } from '../constants';
import { Highlight } from '../types';
import { videoCache } from '../videoCache';
import StarRating from './StarRating';
import VideoPlayer from './VideoPlayer';

const ITEMS_PER_PAGE = 9;

const VideoCard: React.FC<{ clip: Highlight, onClick: () => void, videosEnabled: boolean }> = ({ clip, onClick, videosEnabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Simplified video URLs - use original or basic optimization
  const hoverVideoSrc = clip.videoUrl.includes('cloudinary.com') 
    ? clip.videoUrl.replace('/upload/', '/upload/q_auto,f_auto,w_400,h_300,c_fill/')
    : clip.videoUrl;
  const fullVideoSrc = clip.videoUrl;
  
  // Use provided thumbnail or generate simple one
  const thumbnailSrc = clip.thumbnail || (clip.videoUrl.includes('cloudinary.com') 
    ? clip.videoUrl.replace('/upload/', '/upload/w_400,h_488,c_fill,q_auto,f_auto,so_3.0/').replace('.mp4', '.jpg')
    : '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Video segments should already be preloaded from loading screen
          // Just mark as visible for immediate playback
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // Start loading earlier
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    
    if (video && isVisible && videoReady && userInteracted) {
      if (isHovering) {
        // Reset video to start and play
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error: any) => {
            console.warn('Video play failed:', error);
            setVideoError(true);
          });
        }
      } else {
        video.pause();
      }
    }
  }, [isHovering, isVisible, videoReady, userInteracted]);

  // Handle user interaction to enable autoplay
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      console.log(`👆 User interaction detected for ${clip.title}`);
    }
  };

  const handleVideoLoad = () => {
    setVideoReady(true);
    console.log(`✅ Video ready: ${clip.title}`);
  };

  const handleVideoError = (e: any) => {
    const video = e.target;
    console.error(`❌ Video error for ${clip.title}:`, {
      error: video.error,
      code: video.error?.code,
      message: video.error?.message,
      src: video.src,
      networkState: video.networkState,
      readyState: video.readyState
    });
    setVideoError(true);
  };

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  return (
    <div 
      ref={containerRef}
      className="group relative aspect-[9/11] overflow-hidden cursor-pointer rounded-2xl md:rounded-3xl glass transition-all duration-700 hover:scale-[1.02] hover:glow-green bg-black"
      onMouseEnter={() => {
        setIsHovering(true);
        handleUserInteraction();
      }}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => {
        handleUserInteraction();
        onClick();
      }}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {/* Thumbnail Image - Shows immediately, fades out on hover */}
        {thumbnailSrc && (
          <img
            src={thumbnailSrc}
            alt={clip.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ${
              isHovering ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleThumbnailLoad}
            onError={() => console.warn('Thumbnail failed to load:', thumbnailSrc)}
          />
        )}
        
        {/* Video Content - Shows on hover */}
        {isVisible && !videoError && videosEnabled && (
          <video
            ref={videoRef}
            src={hoverVideoSrc}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              isHovering && videoReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectPosition: 'center center'
            }}
            muted 
            loop 
            playsInline 
            preload="metadata"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          />
        )}
        
        {/* Loading state for when neither thumbnail nor video is ready */}
        {!thumbnailLoaded && !videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-8 h-8 border-2 border-[#CCFF00]/20 border-t-[#CCFF00] rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {videoError && videosEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-red-500">⚠️</div>
              <div className="text-xs text-white/50">Video unavailable</div>
            </div>
          </div>
        )}

        {/* Video disabled overlay */}
        {!videosEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 text-[#CCFF00] opacity-50">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div className="text-xs text-white/50 font-mono">Hover disabled</div>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      </div>

      <div className="corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-bl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-br opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-3 md:top-6 left-3 md:left-6 z-20 flex flex-col gap-1">
        <span className="text-[#CCFF00] font-mono text-[8px] md:text-[9px] tracking-tighter uppercase">{clip.category}</span>
        <span className="text-white/30 font-mono text-[7px] md:text-[9px] tracking-tighter uppercase">UNIT: {clip.id.split('-').pop()}</span>
        {clip.date && (
          <span className="text-white/40 font-mono text-[7px] md:text-[8px] tracking-tighter">
            {new Date(clip.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        )}
        {clip.rating && (
          <div className="mt-0.5 md:mt-1">
            <StarRating rating={clip.rating} size="sm" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 lg:p-8 z-20">
         <div className="h-[1px] w-full bg-white/10 mb-3 md:mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#CCFF00] w-0 group-hover:w-full transition-all duration-1000" />
         </div>
         <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-black italic text-white mb-2 leading-none">{clip.title}</h3>
         <div className="flex gap-2 md:gap-4 opacity-40 group-hover:opacity-100 transition-all">
            {clip.stats && (
              <>
                <div className="flex flex-col">
                  <span className="text-[6px] md:text-[7px] font-mono text-white/50 uppercase">Pwr</span>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-[#CCFF00]">{clip.stats.power}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[6px] md:text-[7px] font-mono text-white/50 uppercase">Spd</span>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-[#CCFF00]">{clip.stats.speed}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[6px] md:text-[7px] font-mono text-white/50 uppercase">Ctl</span>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-[#CCFF00]">{clip.stats.control}</span>
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
  const [sortBy, setSortBy] = useState<'default' | 'date' | 'rating'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [videosEnabled, setVideosEnabled] = useState(true); // Enable by default

  const playerContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Recap', 'Match', '1v1', 'Skills', 'Pingball', 'Warmup', 'Training', 'Milestone'];
  
  const filteredHighlights = filter === 'All' 
    ? HIGHLIGHTS 
    : HIGHLIGHTS.filter(h => h.category === filter);

  // Sort highlights based on selected criteria
  const sortedHighlights = [...filteredHighlights].sort((a, b) => {
    if (sortBy === 'date') {
      // Handle missing dates by putting them at the end
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    }
    
    if (sortBy === 'rating') {
      // Handle missing ratings by putting them at the end
      if (!a.rating && !b.rating) return 0;
      if (!a.rating) return 1;
      if (!b.rating) return -1;
      
      return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    }
    
    // Default sorting (original order)
    return 0;
  });

  const totalPages = Math.ceil(sortedHighlights.length / ITEMS_PER_PAGE);
  const paginatedHighlights = sortedHighlights.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Simplified background prefetch
  useEffect(() => {
    // Simple preload for visible videos
    paginatedHighlights.forEach((h, index) => {
      if (index < 6) { // First 6 videos
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.src = h.videoUrl.includes('cloudinary.com') 
          ? h.videoUrl.replace('/upload/', '/upload/q_auto,f_auto,w_400,h_300,c_fill/')
          : h.videoUrl;
        video.load();
      }
    });
  }, [currentPage, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy, sortOrder]);

  const openModal = (highlight: Highlight) => {
    setActiveHighlight(highlight);
    console.log(`🎥 Opening video player for: ${highlight.title}`);
  };

  useEffect(() => {
    document.body.style.overflow = activeHighlight ? 'hidden' : 'auto';
  }, [activeHighlight]);

  return (
    <section id="highlights" className="py-24 md:py-40 px-6 bg-obsidian relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-20 gap-6 lg:gap-10">
          <div className="relative">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
               <div className="w-8 md:w-12 h-[2px] bg-[#CCFF00]" />
               <span className="text-[#CCFF00] font-mono tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold uppercase">Tactical Feed</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
              Video <br />
              <span className="text-white/20">Archive</span>
            </h2>
            {sortBy !== 'default' && (
              <div className="mt-2 md:mt-4 flex items-center gap-2">
                <div className="w-6 md:w-8 h-[1px] bg-[#CCFF00]" />
                <span className="text-[#CCFF00] font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">
                  Sorted by {sortBy} • {
                    sortBy === 'date' 
                      ? (sortOrder === 'desc' ? 'Newest First' : 'Oldest First')
                      : (sortOrder === 'desc' ? 'Highest Rated' : 'Lowest Rated')
                  }
                </span>
              </div>
            )}
          </div>
          <div className="w-full lg:w-auto">
            {/* Mobile: Video Hover Toggle */}
            <button
              onClick={() => setVideosEnabled(!videosEnabled)}
              className={`w-full lg:w-auto px-4 lg:px-6 py-2 lg:py-3 font-mono text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all duration-500 rounded-sm mb-4 ${
                videosEnabled 
                  ? 'bg-[#CCFF00] text-black hover:shadow-[0_0_15px_rgba(204,255,0,0.5)]'
                  : 'bg-white/10 text-white border border-white/20 hover:border-[#CCFF00] hover:text-[#CCFF00]'
              }`}
            >
              {videosEnabled ? 'Disable Hover' : 'Enable Hover'}
            </button>
            
            {/* Mobile: Compact Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-4">
              {/* Sort Controls */}
              <div className="flex flex-col gap-2">
                <span className="text-white/40 font-mono text-[8px] lg:text-[9px] uppercase tracking-[0.2em] lg:tracking-[0.3em]">Sort By</span>
                <div className="flex gap-1 lg:gap-2">
                  <button
                    onClick={() => setSortBy('default')}
                    className={`flex-1 lg:flex-none px-2 lg:px-3 py-1 lg:py-2 font-mono text-[8px] lg:text-[9px] font-bold uppercase tracking-widest transition-all duration-500 rounded-sm border ${
                      sortBy === 'default'
                      ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]' 
                      : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
                    }`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => setSortBy('date')}
                    className={`flex-1 lg:flex-none px-2 lg:px-3 py-1 lg:py-2 font-mono text-[8px] lg:text-[9px] font-bold uppercase tracking-widest transition-all duration-500 rounded-sm border ${
                      sortBy === 'date'
                      ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]' 
                      : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
                    }`}
                  >
                    Date
                  </button>
                  <button
                    onClick={() => setSortBy('rating')}
                    className={`flex-1 lg:flex-none px-2 lg:px-3 py-1 lg:py-2 font-mono text-[8px] lg:text-[9px] font-bold uppercase tracking-widest transition-all duration-500 rounded-sm border ${
                      sortBy === 'rating'
                      ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]' 
                      : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
                    }`}
                  >
                    Rating
                  </button>
                </div>
                
                {/* Sort Order Toggle */}
                {sortBy !== 'default' && (
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="px-2 lg:px-3 py-1 lg:py-2 font-mono text-[8px] lg:text-[9px] font-bold uppercase tracking-widest transition-all duration-500 rounded-sm border bg-white/5 border-white/10 text-white/50 hover:text-[#CCFF00] hover:border-[#CCFF00]/50"
                  >
                    {sortBy === 'date' 
                      ? (sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest')
                      : (sortOrder === 'desc' ? '↓ Highest' : '↑ Lowest')
                    }
                  </button>
                )}
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-col gap-2">
                <span className="text-white/40 font-mono text-[8px] lg:text-[9px] uppercase tracking-[0.2em] lg:tracking-[0.3em]">Filter</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:flex lg:flex-wrap gap-1 lg:gap-2 pointer-events-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-2 lg:px-4 py-1 lg:py-2 font-mono text-[8px] lg:text-[10px] font-bold uppercase tracking-widest transition-all duration-500 rounded-sm border ${
                        filter === cat 
                        ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]' 
                        : 'bg-white/5 border-white/10 text-white/30 hover:text-[#CCFF00]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {paginatedHighlights.map((clip) => (
            <VideoCard key={clip.id} clip={clip} onClick={() => openModal(clip)} videosEnabled={videosEnabled} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 md:mt-20 flex flex-col items-center gap-4 md:gap-6">
            <div className="flex gap-1 md:gap-2 flex-wrap justify-center">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono text-[9px] md:text-[10px] border transition-all duration-500 ${
                    currentPage === i + 1 
                    ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-black shadow-[0_0_15px_#CCFF00]' 
                    : 'bg-white/5 border-white/10 text-white/20 hover:border-[#CCFF00]'
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
        <VideoPlayer 
          highlight={activeHighlight} 
          onClose={() => setActiveHighlight(null)} 
        />
      )}
    </section>
  );
};

export default VideoGrid;
