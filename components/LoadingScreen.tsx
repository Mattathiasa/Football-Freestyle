import React, { useState, useEffect } from 'react';
import { HIGHLIGHTS } from '../constants';

interface LoadingScreenProps {
  visible: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ visible, onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing...');
  const [loadedThumbnails, setLoadedThumbnails] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const totalTasks = HIGHLIGHTS.length;
    let completedTasks = 0;
    let cancelled = false;

    setCurrentTask('Warming thumbnails...');

    const warmThumbnails = async () => {
      const thumbnailPromises = HIGHLIGHTS.map(async (highlight) => {
        const thumbnailSrc = highlight.thumbnail || (highlight.videoUrl.includes('cloudinary.com')
          ? highlight.videoUrl.replace('/upload/', '/upload/w_400,h_488,c_fill,q_auto,f_auto,so_3.0/').replace('.mp4', '.jpg')
          : '');

        if (thumbnailSrc) {
          try {
            await new Promise<void>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => reject();
              img.src = thumbnailSrc;
            });
          } catch {
            // Thumbnail failed - continue without it
          }
        }
        completedTasks++;
        if (!cancelled) {
          setProgress(Math.round((completedTasks / totalTasks) * 100));
          setLoadedThumbnails(completedTasks);
        }
      });

      await Promise.all(thumbnailPromises);
      if (!cancelled) {
        setProgress(100);
        setCurrentTask('Ready');
      }
    };

    warmThumbnails().catch(() => {});

    // Start the fade on a fixed grace period rather than gating it behind
    // thumbnail warming, so the hero is revealed promptly even on a slow
    // connection. The warming continues in the background either way.
    const graceTimeout = setTimeout(onLoadingComplete, 1200);
    const maxTimeout = setTimeout(onLoadingComplete, 8000);

    return () => {
      cancelled = true;
      clearTimeout(graceTimeout);
      clearTimeout(maxTimeout);
    };
  }, [visible, onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#CCFF00]/3 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-6">

        {/* Logo/Title */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">
            Matty<br />
            <span className="text-[#CCFF00]">Archive</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-[2px] bg-[#CCFF00]" />
            <span className="text-[#CCFF00] font-mono tracking-[0.4em] text-xs font-bold uppercase">Loading</span>
            <div className="w-8 h-[2px] bg-[#CCFF00]" />
          </div>
        </div>

        {/* Progress Circle */}
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#CCFF00"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-out"
              style={{
                filter: 'drop-shadow(0 0 8px #CCFF00)'
              }}
            />
          </svg>

          {/* Progress percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold text-[#CCFF00]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Current Task */}
        <div className="text-center mb-8">
          <p className="text-white font-mono text-sm mb-2">{currentTask}</p>
          <div className="flex items-center justify-center gap-4 text-xs text-white/50 font-mono">
            <span>Videos: {HIGHLIGHTS.length} archived</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#CCFF00]/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#CCFF00]/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#CCFF00]/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#CCFF00]/30" />
    </div>
  );
};

export default LoadingScreen;