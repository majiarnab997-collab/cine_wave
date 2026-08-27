import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { ContinueWatchingItem, MediaItem } from '../../types';
import { usePlayback } from '../../context/PlaybackContext';
import { Badge } from '../common/Badge';

interface ContinueWatchingRowProps {
  title?: string;
  items: ContinueWatchingItem[];
  onOpenDetails?: (media: MediaItem) => void;
  className?: string;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  title = 'Continue Watching',
  items,
  onOpenDetails,
  className = ''
}) => {
  const navigate = useNavigate();
  const { removeProgress } = usePlayback();
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

  const handleResume = (item: ContinueWatchingItem) => {
    if (item.episodeId) {
      navigate(`/watch/${item.mediaId}?ep=${item.episodeId}`);
    } else {
      navigate(`/watch/${item.mediaId}`);
    }
  };

  const handleRemove = (e: React.MouseEvent, item: ContinueWatchingItem) => {
    e.stopPropagation();
    removeProgress(item.mediaId, item.episodeId);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`relative group/row my-6 sm:my-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      <h3 className="font-display text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight mb-3 md:mb-4">
        {title}
      </h3>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-panel bg-black/80 hover:bg-brand-primary text-white items-center justify-center shadow-cinematic transition-all duration-200 opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={checkScrollLimits}
          className="flex gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {items.map(item => {
            const remainingSec = Math.max(0, item.duration - item.currentPosition);
            const remainingMin = Math.ceil(remainingSec / 60);

            return (
              <div
                key={item.id}
                onClick={() => handleResume(item)}
                className="group relative shrink-0 w-[240px] sm:w-[280px] md:w-[320px] rounded-xl overflow-hidden bg-background-elevated border border-border-subtle hover:border-white/25 hover:shadow-cinematic transition-all duration-300 cursor-pointer select-none"
              >
                {/* Backdrop with Play Action */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={item.media.backdropUrl || item.media.posterUrl}
                    alt={item.media.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 group-hover:bg-brand-primary text-white flex items-center justify-center shadow-glow-primary transition-all duration-200 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={e => handleRemove(e, item)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white/80 hover:text-white transition-colors"
                    title="Remove from Continue Watching"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Info button */}
                  {onOpenDetails && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onOpenDetails(item.media);
                      }}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors"
                      title="More details"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-white/20 w-full">
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-amber"
                    style={{ width: `${item.progressPercentage}%` }}
                  />
                </div>

                {/* Meta details */}
                <div className="p-3 bg-[#0E0E15]">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1 truncate">
                    <span className="truncate">{item.media.title}</span>
                    <span className="text-[10px] font-mono text-brand-amber font-normal shrink-0 ml-2">
                      {remainingMin}m left
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    {item.seasonNumber && item.episodeNumber ? (
                      <span className="text-text-secondary font-medium">
                        S{item.seasonNumber} : E{item.episodeNumber}
                      </span>
                    ) : (
                      <Badge maturity={item.media.maturityRating} className="text-[9px] px-1 py-0" />
                    )}
                    <span className="text-emerald-400 font-bold text-[10px]">
                      {item.progressPercentage}% watched
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
