import React, { useEffect, useRef, useState } from 'react';
import { Highlight } from '../../types';
import { videoCache } from '../../videoCache';
import StarRating from '../StarRating';

interface ReelCardProps {
  clip: Highlight;
  index: number;
  isActive: boolean;
  isNear: boolean;
  playing: boolean;
  snap: boolean;
  onOpen: () => void;
}

// Landscape 16:9 poster at reel-card resolution; clip.thumbnail is portrait-cropped for the grid.
const getReelPosterUrl = (url: string): string => {
  if (!url.includes('cloudinary.com')) return url;
  const params = 'w_1000,h_563,c_fill,g_auto,q_auto,f_auto,so_3.0';
  const jpg = url.replace('.mp4', '.jpg');
  if (jpg.includes('/upload/v')) return jpg.replace('/upload/v', `/upload/${params}/v`);
  return jpg.replace('/upload/', `/upload/${params}/`);
};

const ReelCard: React.FC<ReelCardProps> = ({ clip, index, isActive, isNear, playing, snap, onOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const previewSrc = videoCache.getOptimizedUrl(clip.videoUrl, 'fullscreen', 'landscape');
  const posterSrc = getReelPosterUrl(clip.videoUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive && playing && !videoError) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, playing, isNear, videoError]);

  const showVideo = isActive && playing && videoReady && !videoError;
  const dateLabel = clip.date
    ? new Date(clip.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div
      data-reel-card
      className={`relative shrink-0 ${
        snap ? 'snap-center w-[85vw] sm:w-[65vw]' : 'w-[72vw] max-w-[1000px]'
      } transition-[transform,opacity] duration-500 ease-out ${
        isActive ? 'scale-100 opacity-100' : 'scale-[0.88] opacity-40'
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute -top-8 md:-top-14 right-3 font-display font-black italic text-7xl md:text-9xl text-outline select-none pointer-events-none leading-none"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <button
        type="button"
        onClick={onOpen}
        aria-label={`${isActive ? 'Play' : 'Go to'} ${clip.title}`}
        className={`group relative block w-full aspect-video glass rounded-2xl md:rounded-3xl overflow-hidden text-left cursor-pointer bg-black transition-shadow duration-500 ${
          isActive ? 'glow-green' : ''
        }`}
      >
        {/* Oversized media layer so the scroll-driven parallax never reveals edges */}
        <div data-reel-media className="absolute inset-[-8%]">
          <img
            src={posterSrc}
            alt={clip.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              showVideo ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {isNear && !videoError && (
            <video
              ref={videoRef}
              src={previewSrc}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                showVideo ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onLoadedData={() => setVideoReady(true)}
              onError={() => setVideoError(true)}
            />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

        <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />
        </div>

        <div className="absolute top-4 md:top-6 left-4 md:left-6 flex items-center gap-3">
          <span className="px-2 py-1 bg-[#CCFF00] text-black font-mono text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
            {clip.category}
          </span>
          {dateLabel && (
            <span className="text-white/40 font-mono text-[8px] md:text-[9px] uppercase tracking-widest">
              {dateLabel}
            </span>
          )}
          {clip.rating && <StarRating rating={clip.rating} size="sm" />}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-5 md:p-8">
          <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-black italic text-white leading-none mb-3 md:mb-4">
            {clip.title}
          </h3>
          <div className="flex items-end justify-between gap-4">
            <div className="flex gap-4 md:gap-6">
              {clip.stats && (
                <>
                  {([['Pwr', clip.stats.power], ['Spd', clip.stats.speed], ['Ctl', clip.stats.control]] as const).map(
                    ([label, value]) => (
                      <div key={label} className="flex flex-col">
                        <span className="text-[7px] md:text-[8px] font-mono text-white/50 uppercase">{label}</span>
                        <span className="text-[11px] md:text-sm font-mono font-bold text-[#CCFF00]">{value}</span>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
            <span
              className={`flex items-center gap-2 px-3 py-1.5 glass border-[#CCFF00]/30 text-[#CCFF00] font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play_Full
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ReelCard;
