import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info } from 'lucide-react';
import { MediaItem } from '../../types';
import { Badge } from '../common/Badge';
import { useWatchlist } from '../../context/WatchlistContext';
import { HoverCardModal } from './HoverCardModal';

interface MediaCardProps {
  media: MediaItem;
  variant?: 'poster' | 'landscape';
  progressPercentage?: number;
  rank?: number;
  onOpenDetails?: (media: MediaItem) => void;
  className?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  variant = 'poster',
  progressPercentage,
  rank,
  onOpenDetails,
  className = ''
}) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(media.id);

  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const handleMouseEnter = () => {
    // Only open hover modal on desktop viewport
    if (window.innerWidth < 1024) return;

    hoverTimeoutRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setHoverPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        setIsHovered(true);
      }
    }, 400); // 400ms delay for premium OTT feel
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleClick = () => {
    if (onOpenDetails) {
      onOpenDetails(media);
    } else {
      if (media.type === 'tv') {
        navigate(`/show/${media.id}`);
      } else {
        navigate(`/movie/${media.id}`);
      }
    }
  };

  const imageUrl = variant === 'poster' ? (media.posterUrl || media.backdropUrl) : (media.backdropUrl || media.posterUrl);

  return (
    <>
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group relative shrink-0 cursor-pointer select-none rounded-xl overflow-hidden bg-background-elevated border border-border-subtle card-hover-transition hover:border-white/25 hover:shadow-cinematic ${
          variant === 'poster' ? 'w-[150px] sm:w-[180px] md:w-[210px]' : 'w-[250px] sm:w-[290px] md:w-[320px]'
        } ${className}`}
      >
        {/* Poster / Backdrop Image */}
        <div className={`relative w-full ${variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video'} overflow-hidden`}>
          <img
            src={imageUrl}
            alt={media.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Quality & Original Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {media.isOriginal && <Badge variant="original">CineWave</Badge>}
          </div>

          {/* Top Rank Badge */}
          {rank && (
            <div className="absolute top-2 right-2 bg-brand-primary text-white font-black text-xs px-2 py-0.5 rounded-md shadow-glow-primary">
              #{rank}
            </div>
          )}

          {/* Progress bar if continue watching */}
          {progressPercentage !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-amber transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}

          {/* Mobile Tap Play Indicator */}
          <div className="lg:hidden absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Card Footer Info (Visible on small screens or standard cards) */}
        <div className="p-2.5 space-y-1 bg-[#0E0E15]">
          <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-secondary transition-colors">
            {media.title}
          </h4>
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span>{media.releaseYear}</span>
            <div className="flex items-center gap-1.5">
              <Badge maturity={media.maturityRating} className="text-[9px] px-1 py-0" />
              <span className="text-emerald-400 font-bold">{media.matchPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Desktop Hover Preview Modal */}
      {isHovered && hoverPosition && (
        <HoverCardModal
          media={media}
          position={hoverPosition}
          onOpenDetails={m => {
            setIsHovered(false);
            if (onOpenDetails) onOpenDetails(m);
            else {
              if (m.type === 'tv') navigate(`/show/${m.id}`);
              else navigate(`/movie/${m.id}`);
            }
          }}
          onClose={() => setIsHovered(false)}
        />
      )}
    </>
  );
};
