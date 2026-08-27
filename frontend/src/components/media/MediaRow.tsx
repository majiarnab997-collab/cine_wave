import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../../types';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  variant?: 'poster' | 'landscape';
  onOpenDetails?: (media: MediaItem) => void;
  className?: string;
}

export const MediaRow: React.FC<MediaRowProps> = ({
  title,
  subtitle,
  items,
  variant = 'poster',
  onOpenDetails,
  className = ''
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollLimits = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScrollLimits();
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollLimits, 400);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`relative group/row my-6 sm:my-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-3 md:mb-4">
        <div>
          <h3 className="font-display text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-panel bg-black/80 hover:bg-brand-primary text-white items-center justify-center shadow-cinematic transition-all duration-200 opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={checkScrollLimits}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {items.map(item => (
            <MediaCard
              key={item.id}
              media={item}
              variant={variant}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-panel bg-black/80 hover:bg-brand-primary text-white items-center justify-center shadow-cinematic transition-all duration-200 opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
