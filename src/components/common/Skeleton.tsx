import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

export const CardSkeleton: React.FC<{ variant?: 'poster' | 'landscape' }> = ({ variant = 'poster' }) => {
  return (
    <div className={`shrink-0 ${variant === 'poster' ? 'w-[160px] md:w-[200px]' : 'w-[260px] md:w-[320px]'}`}>
      <Skeleton className={`${variant === 'poster' ? 'aspect-[2/3]' : 'aspect-[16/9]'} w-full rounded-xl`} />
      <div className="mt-2.5 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const RowSkeleton: React.FC = () => {
  return (
    <div className="my-8 space-y-3 px-4 md:px-12">
      <Skeleton className="h-7 w-48 mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] md:h-[82vh] bg-background-surface overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-16 left-4 md:left-16 space-y-4 max-w-xl">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
