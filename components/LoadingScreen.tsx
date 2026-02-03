import React, { useState, useEffect } from 'react';
import { HIGHLIGHTS } from '../constants';
import { videoCache } from '../videoCache';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing...');
  const [loadedThumbnails, setLoadedThumbnails] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const totalThumbnails = HIGHLIGHTS.length;
        const totalTasks = totalThumbnails;
        let completedTasks = 0;

        console.log('🚀 Starting simplified loading process...');

        // Phase 1: Load thumbnails only
        setCurrentTask('Loading thumbnails...');
        
        const thumbnailPromises = HIGHLIGHTS.map(async (highlight, index) => {
          const thumbnailSrc = highlight.thumbnail || (highlight.videoUrl.includes('cloudinary.com') 
            ? highlight.videoUrl.replace('/upload/', '/upload/w_400,h_488,c_fill,q_auto,f_auto,so_3.0/').replace('.mp4', '.jpg')
            : '');
          
          if (thumbnailSrc) {
            try {
              await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = thumbnailSrc;
              });
              
              completedTasks++;
              setLoadedThumbnails(prev => prev + 1);
              setProgress((completedTasks / totalTasks) * 100);
            } catch (error) {
              console.warn(`Failed to load thumbnail for ${highlight.title}`);
              completedTasks++;
              setProgress((completedTasks / totalTasks) * 100);
            }
          } else {
            completedTasks++;
            setProgress((completedTasks / totalTasks) * 100);
          }
        });

        await Promise.all(thumbnailPromises);
        console.log('✅ Thumbnails loaded');

        // Phase 2: Ready for video playback!
        setCurrentTask('Ready for video playback!');
        
        console.log('🚀 Loading complete - videos will load on demand!');
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProgress(100);
        
        // Trigger completion
        setTimeout(() => {
          console.log('🎬 All systems ready - launching app!');
          onLoadingComplete();
        }, 800);

      } catch (error) {
        console.error('❌ Loading process failed:', error);
        // Fallback - launch app anyway after a delay
        setTimeout(() => {
          console.log('🔄 Fallback - launching app despite errors');
          onLoadingComplete();
        }, 2000);
      }
    };

    // Add a maximum timeout as safety net
    const maxTimeout = setTimeout(() => {
      console.warn('⏰ Loading timeout - launching app');
      onLoadingComplete();
    }, 15000); // 15 second max

    loadContent().finally(() => {
      clearTimeout(maxTimeout);
    });

    return () => {
      clearTimeout(maxTimeout);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center">
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
            <span className="text-[#CCFF00] font-mono tracking-[0.4em] text-xs font-bold uppercase">Loading System</span>
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
            <span>Thumbnails: {loadedThumbnails}/{HIGHLIGHTS.length}</span>
            <span>Videos: On-demand loading</span>
          </div>
        </div>

        {/* Skip button for debugging */}
        <div className="mt-8">
          <button
            onClick={() => {
              console.log('🔄 Skipping loading - launching app immediately');
              onLoadingComplete();
            }}
            className="px-6 py-2 text-xs font-mono text-white/50 hover:text-[#CCFF00] border border-white/20 hover:border-[#CCFF00] transition-all duration-300"
          >
            Skip Loading (Debug)
          </button>
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

        {/* Technical Details */}
        <div className="mt-12 text-center">
          <div className="glass border border-white/10 rounded-lg p-4 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-white/40 uppercase tracking-wider">System</span>
                <div className="text-[#CCFF00] font-bold">V4.0</div>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider">Cache</span>
                <div className="text-[#CCFF00] font-bold">Active</div>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider">Quality</span>
                <div className="text-[#CCFF00] font-bold">Adaptive</div>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider">Stream</span>
                <div className="text-[#CCFF00] font-bold">Optimized</div>
              </div>
            </div>
          </div>
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