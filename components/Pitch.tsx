import React, { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface PitchButtonProps {
  id: string;
  label: string;
  position: Position;
  onPositionChange: (id: string, position: Position) => void;
  onClick: () => void;
  isDraggable: boolean;
}

const PitchButton: React.FC<PitchButtonProps> = ({ id, label, position, onPositionChange, onClick, isDraggable }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !buttonRef.current) return;
    
    const container = buttonRef.current.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newX = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const newY = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    onPositionChange(id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save positions to localStorage
      const allButtons = document.querySelectorAll('[data-button-id]');
      const positions: Record<string, Position> = {};
      allButtons.forEach((btn) => {
        const btnId = btn.getAttribute('data-button-id');
        const style = (btn as HTMLElement).style;
        if (btnId && style.left && style.top) {
          positions[btnId] = {
            x: parseFloat(style.left),
            y: parseFloat(style.top)
          };
        }
      });
      localStorage.setItem('pitchButtonPositions', JSON.stringify(positions));
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging && !isDraggable) {
      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      data-button-id={id}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={`absolute group transition-all duration-500 z-10 ${
        isDraggable ? 'cursor-move' : 'cursor-pointer'
      } ${isDragging ? 'scale-110 z-50' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      aria-label={label}
    >
      {/* Invisible button - only shows on hover */}
      <div className="relative w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full opacity-0 hover:opacity-20 bg-[#CCFF00] transition-opacity duration-300" />
    </button>
  );
};

const Pitch: React.FC = () => {
  const [isDragMode, setIsDragMode] = useState(false);
  
  // Default positions (percentage-based)
  const defaultPositions: Record<string, Position> = {
    'gk': { x: 50, y: 92 },
    'def1': { x: 12, y: 80 },
    'def2': { x: 35, y: 77 },
    'def3': { x: 65, y: 77 },
    'def4': { x: 88, y: 80 },
    'mid1': { x: 18, y: 60 },
    'mid2': { x: 50, y: 57 },
    'mid3': { x: 82, y: 60 },
    'striker': { x: 50, y: 38 },
    'coach': { x: 97, y: 50 }
  };

  const [positions, setPositions] = useState<Record<string, Position>>(defaultPositions);

  // Load saved positions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pitchButtonPositions');
    if (saved) {
      try {
        const savedPositions = JSON.parse(saved);
        setPositions({ ...defaultPositions, ...savedPositions });
      } catch (e) {
        console.error('Failed to load saved positions', e);
      }
    }
  }, []);

  const handlePositionChange = (id: string, position: Position) => {
    setPositions(prev => ({
      ...prev,
      [id]: position
    }));
  };

  const handleNavigation = (section: string) => {
    if (!isDragMode) {
      let targetId = '';
      
      // Map button actions to section IDs
      switch(section) {
        case 'about':
          targetId = 'story'; // About Me -> Story section
          break;
        case 'defense-clips':
          targetId = 'highlights'; // Defense Clips -> Video highlights
          break;
        case 'skills':
          targetId = 'skills'; // Skills -> Skills/Stats section
          break;
        case 'analytics':
          targetId = 'analytics'; // Analytics -> Performance Analytics
          break;
        case 'social':
          targetId = 'footer'; // Social Media -> Footer with social links
          break;
        case 'tactics':
          targetId = 'analytics'; // Tactics/Training -> Performance Analytics
          break;
        default:
          targetId = section;
      }
      
      // Smooth scroll to the target section
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80; // Account for fixed navigation
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const resetPositions = () => {
    setPositions(defaultPositions);
    localStorage.removeItem('pitchButtonPositions');
  };

  // Clear localStorage on mount to ensure fresh positions (temporary fix)
  useEffect(() => {
    // Uncomment this line if you want to force reset positions on every page load
    // localStorage.removeItem('pitchButtonPositions');
  }, []);

  return (
    <section id="pitch" className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/pitch.jpg)',
          filter: 'brightness(0.8) contrast(1.1)',
        }}
      />
      
      {/* Overlay gradient - lighter */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      
      {/* Top Navigation Bar - All Hidden */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6 opacity-0 pointer-events-none">
        {/* Back Button - Hidden */}
        <button 
          className="flex items-center gap-2 px-4 py-2 glass border border-white/20 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-mono text-xs uppercase tracking-wider">Back</span>
        </button>
        
        {/* Edit Mode Toggle & Reset Buttons - Hidden */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDragMode(!isDragMode)}
            className={`px-4 py-2 glass border transition-all font-mono text-xs uppercase tracking-wider ${
              isDragMode 
                ? 'border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/10' 
                : 'border-white/20 text-white'
            }`}
          >
            {isDragMode ? '✓ Done' : '✎ Edit Layout'}
          </button>
          
          {isDragMode && (
            <button 
              onClick={resetPositions}
              className="px-4 py-2 glass border border-red-500/50 text-red-400"
            >
              ↺ Reset
            </button>
          )}
        </div>
        
        {/* User Profile Icon - Hidden */}
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full glass border border-white/20 flex items-center justify-center text-white">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>

      {/* Drag Mode Instructions */}
      {isDragMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 glass border border-[#CCFF00]/50 bg-[#CCFF00]/10 backdrop-blur-xl">
          <p className="text-[#CCFF00] font-mono text-xs md:text-sm uppercase tracking-wider text-center">
            🖱️ Drag buttons to reposition • Positions auto-save
          </p>
        </div>
      )}

      {/* Main Content - Interactive Pitch */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
        <div className="relative w-full max-w-6xl aspect-[4/3]">
          
          {/* Title at top */}
          <div className="absolute -top-24 md:-top-28 left-1/2 -translate-x-1/2 text-center w-full">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black uppercase italic text-white mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(204,255,0,0.6)]">
              The Pitch
            </h2>
            <p className="text-white/50 font-mono text-xs md:text-sm uppercase tracking-widest">
              {isDragMode ? 'Drag to reposition buttons' : 'Tap any position to explore'}
            </p>
          </div>
          
          {/* Goalkeeper */}
          <PitchButton
            id="gk"
            label="About Me"
            position={positions.gk}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('about')}
            isDraggable={isDragMode}
          />
          
          {/* Defenders */}
          <PitchButton
            id="def1"
            label="Highlights"
            position={positions.def1}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('defense-clips')}
            isDraggable={isDragMode}
          />
          <PitchButton
            id="def2"
            label="Highlights"
            position={positions.def2}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('defense-clips')}
            isDraggable={isDragMode}
          />
          <PitchButton
            id="def3"
            label="Highlights"
            position={positions.def3}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('defense-clips')}
            isDraggable={isDragMode}
          />
          <PitchButton
            id="def4"
            label="Highlights"
            position={positions.def4}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('defense-clips')}
            isDraggable={isDragMode}
          />
          
          {/* Midfielders */}
          <PitchButton
            id="mid1"
            label="Skills"
            position={positions.mid1}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('skills')}
            isDraggable={isDragMode}
          />
          <PitchButton
            id="mid2"
            label="Analytics"
            position={positions.mid2}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('analytics')}
            isDraggable={isDragMode}
          />
          <PitchButton
            id="mid3"
            label="Skills"
            position={positions.mid3}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('skills')}
            isDraggable={isDragMode}
          />
          
          {/* Striker */}
          <PitchButton
            id="striker"
            label="Social"
            position={positions.striker}
            onPositionChange={handlePositionChange}
            onClick={() => handleNavigation('social')}
            isDraggable={isDragMode}
          />
          
          {/* Coach Avatar - Sideline */}
          <button
            data-button-id="coach"
            onClick={() => !isDragMode && handleNavigation('tactics')}
            className={`absolute group transition-all duration-300 z-20 ${
              isDragMode ? 'cursor-move' : 'cursor-pointer'
            }`}
            style={{
              left: `${positions.coach.x}%`,
              top: `${positions.coach.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseDown={(e) => {
              if (!isDragMode) return;
              e.preventDefault();
              const startX = e.clientX;
              const startY = e.clientY;
              const startPos = { ...positions.coach };
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const container = e.currentTarget.parentElement;
                if (!container) return;
                const rect = container.getBoundingClientRect();
                const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
                const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
                
                setPositions(prev => ({
                  ...prev,
                  coach: {
                    x: startPos.x + deltaX,
                    y: startPos.y + deltaY
                  }
                }));
              };
              
              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                localStorage.setItem('pitchButtonPositions', JSON.stringify(positions));
              };
              
              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            aria-label="Analytics"
          >
            {/* Invisible coach button - only shows on hover */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full opacity-0 hover:opacity-20 bg-white transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {/* Decorative grid overlay */}
      <div className="absolute inset-0 bg-hex opacity-5 pointer-events-none" />
    </section>
  );
};

export default Pitch;
