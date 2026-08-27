import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../../types';
import { HeroBanner } from './HeroBanner';

interface HeroCarouselProps {
  items: MediaItem[];
  onOpenDetails: (media: MediaItem) => void;
  intervalMs?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  onOpenDetails,
  intervalMs = 8000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, isPaused, intervalMs]);

  if (!items || items.length === 0) return null;

  const currentMedia = items[currentIndex] || items[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <HeroBanner
        key={currentMedia.id}
        media={currentMedia}
        onOpenDetails={onOpenDetails}
        autoPlayVideo={!isPaused}
      />

      {/* Hero Carousel Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full glass-panel bg-black/50 hover:bg-black/80 text-white items-center justify-center border border-white/20 transition-all opacity-0 group-hover/hero:opacity-100 hover:scale-110 active:scale-95"
            aria-label="Previous featured title"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full glass-panel bg-black/50 hover:bg-black/80 text-white items-center justify-center border border-white/20 transition-all opacity-0 group-hover/hero:opacity-100 hover:scale-110 active:scale-95"
            aria-label="Next featured title"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-gradient-to-r from-brand-primary to-brand-amber shadow-glow-primary'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
