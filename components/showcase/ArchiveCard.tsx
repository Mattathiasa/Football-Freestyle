import React, { useEffect, useRef, useState } from 'react';
import { Highlight } from '../../types';
import { videoCache } from '../../videoCache';
import StarRating from '../StarRating';

interface ArchiveCardProps {
  clip: Highlight;
  previewsEnabled: boolean;
  isPreviewing: boolean;
  onPreviewStart: (id: string) => void;
  onPreviewEnd: (id: string) => void;
  onOpen: () => void;
}

const ArchiveCard: React.FC<ArchiveCardProps> = ({
  clip,
  previewsEnabled,
  isPreviewing,
  onPreviewStart,
  onPreviewEnd,
  onOpen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasHovered, setHasHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const hoverSrc = videoCache.getOptimizedUrl(clip.videoUrl, 'hover', 'portrait');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPreviewing && previewsEnabled && !videoError) {
      video.currentTime = 0;
      video.play().catch(() => setVideoError(true));
    } else {
      video.pause();
    }
  }, [isPreviewing, previewsEnabled, videoError, hasHovered]);

  const showVideo = isPreviewing && previewsEnabled && videoReady && !videoError;
  const dateLabel = clip.date
    ? new Date(clip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Play ${clip.title}`}
      className="archive-card group relative aspect-[9/11] overflow-hidden cursor-pointer rounded-2xl md:rounded-3xl glass bg-black transition-[transform,box-shadow] duration-500 hover:scale-[1.02] hover:glow-green"
      onMouseEnter={() => {
        setHasHovered(true);
        onPreviewStart(clip.id);
      }}
      onMouseLeave={() => onPreviewEnd(clip.id)}
      onClick={onOpen}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <img
        src={clip.thumbnail}
        alt={clip.title}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          showVideo ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {hasHovered && previewsEnabled && !videoError && (
        <video
          ref={videoRef}
          src={hoverSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
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

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="scanline" />
      </div>

      <div className="corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-bl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="corner-br opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-3 md:top-5 left-3 md:left-5 right-3 md:right-5 z-10 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <span className="self-start px-2 py-0.5 bg-[#CCFF00] text-black font-mono text-[11px] md:text-xs font-bold uppercase tracking-widest">
            {clip.category}
          </span>
          {dateLabel && (
            <span className="text-white/40 font-mono text-[10px] md:text-[11px] uppercase tracking-widest">
              {dateLabel}
            </span>
          )}
        </div>
        {clip.rating && <StarRating rating={clip.rating} size="sm" />}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-10">
        <div className="h-[1px] w-full bg-white/10 mb-3 md:mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-[#CCFF00] w-0 group-hover:w-full transition-all duration-1000" />
        </div>
        <h3 className="font-display text-lg sm:text-xl md:text-2xl font-black italic text-white mb-2 leading-none">
          {clip.title}
        </h3>
        {clip.stats && (
          <div className="flex gap-3 md:gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
            {([['Pwr', clip.stats.power], ['Spd', clip.stats.speed], ['Ctl', clip.stats.control]] as const).map(
              ([label, value]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-mono text-white/50 uppercase">{label}</span>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-[#CCFF00]">{value}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveCard;
