import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Highlight } from '../types';
import StarRating from './StarRating';

interface VideoPlayerProps {
  highlight: Highlight;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ highlight, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  }, [isPlaying]);

  // Show/hide controls logic
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    setLastMouseMove(Date.now());
    
    // Clear existing timeout
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Set new timeout to hide controls after 3 seconds
    const newTimeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(newTimeout);
  }, [controlsTimeout]);

  // Handle mouse movement
  const handleMouseMove = useCallback(() => {
    setLastMouseMove(Date.now());
    if (!showControls) {
      showControlsTemporarily();
    } else {
      // Reset timeout if controls are already visible
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      const newTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(newTimeout);
    }
  }, [showControls, showControlsTemporarily, controlsTimeout]);

  // Handle video container click - only show controls, don't toggle play/pause
  const handleVideoContainerClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger if clicking on controls
    if ((e.target as HTMLElement).closest('.video-controls')) {
      return;
    }
    
    // Only show controls when clicking video area
    if (!showControls) {
      showControlsTemporarily();
    }
  }, [showControls, showControlsTemporarily]);

  // Hide controls when video starts playing (after 3 seconds)
  useEffect(() => {
    if (isPlaying && showControls) {
      // Clear any existing timeout
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      // Set timeout to hide controls after 3 seconds of playing
      const newTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(newTimeout);
    }
  }, [isPlaying, controlsTimeout]);

  // Show controls when video is paused and clear timeout
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        setControlsTimeout(null);
      }
    }
  }, [isPlaying, controlsTimeout]);

  // Hide navigation when video player is mounted
  useEffect(() => {
    // Hide navigation
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.display = 'none';
    }
    
    // Show navigation when component unmounts
    return () => {
      if (nav) {
        nav.style.display = 'flex';
      }
    };
  }, []);

  // Mouse movement tracking
  useEffect(() => {
    const handleGlobalMouseMove = () => {
      handleMouseMove();
    };

    // Add mouse move listener to the entire video player
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [handleMouseMove]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Seek to specific time
  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  }, []);

  // Handle timeline click
  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect || !duration) return;
    
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
    showControlsTemporarily();
  }, [duration, seekTo, showControlsTemporarily]);

  // Step frame by frame
  const stepFrame = useCallback((direction: 'forward' | 'backward') => {
    const video = videoRef.current;
    if (!video) return;
    
    const step = 1 / 30; // Assuming 30fps
    const newTime = direction === 'forward' 
      ? Math.min(video.currentTime + step, duration)
      : Math.max(video.currentTime - step, 0);
    
    seekTo(newTime);
  }, [duration, seekTo]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          // Show controls and toggle play/pause
          showControlsTemporarily();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          showControlsTemporarily();
          stepFrame('backward');
          break;
        case 'ArrowRight':
          e.preventDefault();
          showControlsTemporarily();
          stepFrame('forward');
          break;
        case 'KeyM':
          showControlsTemporarily();
          setIsMuted(prev => !prev);
          break;
        case 'KeyF':
          showControlsTemporarily();
          toggleFullscreen();
          break;
        case 'KeyL':
          showControlsTemporarily();
          setIsLooping(prev => !prev);
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause, stepFrame, toggleFullscreen, onClose, showControlsTemporarily]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isLooping]);

  // Update video properties
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = isMuted ? 0 : volume;
    video.playbackRate = playbackRate;
    video.loop = isLooping;
  }, [volume, isMuted, playbackRate, isLooping]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center video-player-container ${
      showControls ? 'controls-visible' : 'controls-hidden'
    }`}>
      {/* Close button */}
      <button 
        onClick={onClose}
        className={`absolute top-4 md:top-8 right-4 md:right-8 z-[120] w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Info toggle */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className={`absolute top-4 md:top-8 left-4 md:left-8 z-[120] w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Info panel */}
      {showInfo && showControls && (
        <div className="absolute top-16 md:top-24 left-4 md:left-8 z-[120] bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 md:p-6 max-w-xs md:max-w-sm transition-all duration-300">
          <h3 className="text-[#CCFF00] font-mono text-xs md:text-sm font-bold mb-2 md:mb-3">{highlight.title}</h3>
          <div className="space-y-1 md:space-y-2 text-[10px] md:text-xs text-white/70 font-mono">
            <div>Category: <span className="text-white">{highlight.category}</span></div>
            <div>Duration: <span className="text-white">{formatTime(duration)}</span></div>
            {highlight.skillType && (
              <div>Skill Type: <span className="text-white">{highlight.skillType}</span></div>
            )}
            {highlight.surface && (
              <div>Surface: <span className="text-white">{highlight.surface}</span></div>
            )}
            {highlight.progressTag && (
              <div>Progress: <span className={`${
                highlight.progressTag === 'Recent' ? 'text-[#CCFF00]' : 
                highlight.progressTag === 'Mid' ? 'text-yellow-400' : 'text-white/60'
              }`}>{highlight.progressTag}</span></div>
            )}
            {highlight.date && (
              <div>Date: <span className="text-white">
                {new Date(highlight.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span></div>
            )}
            {highlight.rating && (
              <div className="flex items-center gap-2">
                <span>Rating:</span>
                <StarRating rating={highlight.rating} size="sm" />
              </div>
            )}
            {highlight.description && (
              <div className="mt-2 md:mt-3 text-white/50 text-[9px] md:text-[10px]">{highlight.description}</div>
            )}
          </div>
        </div>
      )}

      {/* Video container */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleVideoContainerClick}
        onMouseMove={handleMouseMove}
      >
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-2 border-[#CCFF00]/20 border-t-[#CCFF00] rounded-full animate-spin" />
              <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-[0.5em] animate-pulse">Loading...</span>
            </div>
          </div>
        )}
        
        <video 
          ref={videoRef}
          className="w-full h-full object-contain"
          src={highlight.videoUrl}
          preload="metadata"
        />
      </div>

      {/* Controls */}
      <div className={`video-controls absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-3 md:p-6 lg:p-8 z-[110] transition-all duration-500 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
      }`}>
        {/* Timeline */}
        <div 
          ref={progressRef}
          className="w-full h-1 md:h-2 bg-white/20 rounded-full cursor-pointer mb-3 md:mb-6 relative overflow-hidden group"
          onClick={handleTimelineClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#CCFF00] transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#CCFF00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            style={{ left: `calc(${progressPercentage}% - 6px)` }}
          />
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile: Top Row - Play/Pause and Time */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlayPause}
                className="w-10 h-10 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <div className="text-white font-mono text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <button 
              onClick={toggleFullscreen}
              className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Mobile: Second Row - Frame Controls and Speed */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              <button 
                onClick={() => stepFrame('backward')}
                className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => stepFrame('forward')}
                className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-1">
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackRate(speed)}
                  className={`px-2 py-1 text-[10px] font-mono rounded transition-all duration-300 ${
                    playbackRate === speed 
                      ? 'bg-[#CCFF00] text-black' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: Third Row - Volume and Loop */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (newVolume > 0) setIsMuted(false);
                }}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <button 
              onClick={() => setIsLooping(!isLooping)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${
                isLooping ? 'bg-[#CCFF00] text-black' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button 
                onClick={togglePlayPause}
                className="w-12 h-12 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Frame step buttons */}
              <div className="flex gap-1">
                <button 
                  onClick={() => stepFrame('backward')}
                  className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
                  title="Step backward (←)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => stepFrame('forward')}
                  className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
                  title="Step forward (→)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Time display */}
              <div className="text-white font-mono text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Center controls */}
            <div className="flex items-center gap-3">
              {/* Playback speed */}
              <div className="flex items-center gap-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackRate(speed)}
                    className={`px-2 py-1 text-xs font-mono rounded transition-all duration-300 ${
                      playbackRate === speed 
                        ? 'bg-[#CCFF00] text-black' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Loop toggle */}
              <button 
                onClick={() => setIsLooping(!isLooping)}
                className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${
                  isLooping ? 'bg-[#CCFF00] text-black' : 'bg-white/10 hover:bg-white/20'
                }`}
                title="Loop (L)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-4">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
                  title="Mute (M)"
                >
                  {isMuted || volume === 0 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12 8a1 1 0 011.414 0L15 9.586l1.586-1.586A1 1 0 0118 9.414L16.414 11 18 12.586A1 1 0 0116.586 14L15 12.414 13.414 14A1 1 0 0112 12.586L13.586 11 12 9.414A1 1 0 0112 8z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (newVolume > 0) setIsMuted(false);
                  }}
                  className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Fullscreen */}
              <button 
                onClick={toggleFullscreen}
                className="w-8 h-8 bg-white/10 hover:bg-[#CCFF00] hover:text-black rounded flex items-center justify-center transition-all duration-300"
                title="Fullscreen (F)"
              >
                {isFullscreen ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-2 md:mt-4 text-center">
          <div className="text-white/30 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-[0.2em]">
            <span className="hidden md:inline">Space: Play/Pause • ←/→: Frame Step • M: Mute • F: Fullscreen • L: Loop • Esc: Close</span>
            <span className="md:hidden">Tap to show controls • Use buttons to control playback</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;