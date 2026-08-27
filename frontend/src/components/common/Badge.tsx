import React from 'react';
import { MaturityRating } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'rating' | 'quality' | 'audio' | 'match' | 'genre' | 'kids' | 'original';
  maturity?: MaturityRating;
  matchPercentage?: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'quality',
  maturity,
  matchPercentage,
  className = ''
}) => {
  if (maturity) {
    const isAdult = maturity === 'R' || maturity === 'TV-MA' || maturity === 'NC-17';
    const isKids = maturity === 'G' || maturity === 'PG';

    return (
      <span
        className={`inline-flex items-center justify-center font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border leading-none ${
          isAdult
            ? 'border-red-500/50 text-red-400 bg-red-950/30'
            : isKids
            ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30'
            : 'border-white/20 text-slate-300 bg-white/5'
        } ${className}`}
      >
        {maturity}
      </span>
    );
  }

  if (matchPercentage !== undefined) {
    return (
      <span className={`inline-flex items-center font-bold text-xs text-emerald-400 font-mono tracking-tight ${className}`}>
        {matchPercentage}% Match
      </span>
    );
  }

  const variantClasses = {
    quality: 'bg-white/10 text-white/90 border border-white/15 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded',
    audio: 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold px-1.5 py-0.5 rounded',
    match: 'text-emerald-400 font-bold text-xs',
    rating: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1',
    genre: 'bg-background-elevated hover:bg-background-hover text-text-secondary hover:text-white border border-border-subtle text-xs px-2.5 py-1 rounded-full transition-colors',
    kids: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[11px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm',
    original: 'bg-gradient-to-r from-brand-primary to-brand-amber text-white font-extrabold text-[10px] tracking-widest uppercase px-2 py-0.5 rounded shadow-glow-primary'
  };

  return (
    <span className={`inline-flex items-center ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
