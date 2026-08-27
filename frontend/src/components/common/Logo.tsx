import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withLink?: boolean;
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  withLink = true,
  to = '/home'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const logoContent = (
    <div className={`flex items-center gap-2.5 font-display font-black tracking-tight select-none group ${className}`}>
      {/* CineWave Original Vector Mark */}
      <div className={`relative flex items-center justify-center rounded-2xl bg-[#0E0E17] border border-white/15 p-1.5 shadow-glow-primary transition-all duration-300 group-hover:scale-105 group-hover:border-brand-primary/50 group-hover:shadow-[0_0_25px_rgba(255,46,85,0.45)] ${iconSizes[size]}`}>
        {/* Glow ambient background inside icon */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-brand-secondary/20 to-brand-amber/20 rounded-2xl filter blur-[2px] opacity-70 group-hover:opacity-100 transition-opacity" />

        <svg viewBox="0 0 64 64" className="w-full h-full relative z-10 fill-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cw-logo-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2E55" />
              <stop offset="50%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FFA800" />
            </linearGradient>
          </defs>

          {/* Primary Flowing Frequency Wave */}
          <path
            d="M8 38C14 20 22 14 32 14C42 14 50 20 56 38"
            stroke="url(#cw-logo-grad-primary)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Counter Harmonic Wave */}
          <path
            d="M13 45C18 33 24 29 32 29C40 29 46 33 51 45"
            stroke="url(#cw-logo-grad-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Center Play Chevron Prism */}
          <polygon
            points="29,26 40,33 29,40"
            fill="url(#cw-logo-grad-primary)"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className={`flex items-baseline font-black ${sizeClasses[size]}`}>
        <span className="text-white tracking-tight">CINE</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-amber ml-0.5">
          WAVE
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link to={to} className="inline-block focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-xl">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
