import React from 'react';

interface LogoProps {
  variant?: 'navigation' | 'hero' | 'footer';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'navigation', 
  size = 'medium', 
  showText = true,
  className = '' 
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10',
    medium: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
    large: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20'
  };

  const textSizes = {
    small: 'text-sm sm:text-lg md:text-xl',
    medium: 'text-lg sm:text-xl md:text-2xl',
    large: 'text-xl sm:text-2xl md:text-4xl'
  };

  // Variant-specific styling
  const variantClasses = {
    navigation: 'group cursor-pointer',
    hero: 'group',
    footer: 'group opacity-80 hover:opacity-100'
  };

  return (
    <div className={`flex items-center gap-4 ${variantClasses[variant]} ${className}`}>
      {/* Logo Container - Replace this div with your actual logo */}
      <div className={`
        relative ${sizeClasses[size]} 
        bg-black flex items-center justify-center 
        text-[#CCFF00] font-display font-bold ${textSizes[size]}
        transition-all duration-500 
        border border-white/10 
        group-hover:border-[#CCFF00] 
        group-hover:glow-green
        ${variant === 'navigation' ? 'rounded-sm' : 'rounded-lg'}
      `}>
        {/* 
          🎨 REPLACE THIS SECTION WITH YOUR LOGO:
          
          Option 1 - Image Logo:
          <img 
            src="/path/to/your/logo.png" 
            alt="Mattathias Abraham Logo"
            className="w-full h-full object-contain"
          />
          
          Option 2 - SVG Logo:
          <svg viewBox="0 0 100 100" className="w-full h-full">
            // Your SVG content here
          </svg>
          
          Option 3 - Keep current text logo (MA):
        */}
        <img 
  src="/assets/logos/favicon.ico" 
  alt="Mattathias Abraham Logo"
  className="w-full h-full object-contain"
/>

        
        {/* Animated accent dot */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#CCFF00] group-hover:animate-ping" />
      </div>

      {/* Text beside logo */}
      {showText && (
        <div className="flex flex-col">
          <span className={`
            font-display font-black tracking-tighter uppercase italic
            ${textSizes[size]}
            ${variant === 'hero' ? 'text-white' : 'text-white'}
            ${variant === 'navigation' ? 'hidden sm:block' : ''}
          `}>
            Mattathias <span className="text-white/20">Abraham</span>
          </span>
          {variant === 'hero' && (
            <span className="text-[#CCFF00] font-mono text-xs uppercase tracking-[0.3em] mt-1">
              Elite Footballer
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;