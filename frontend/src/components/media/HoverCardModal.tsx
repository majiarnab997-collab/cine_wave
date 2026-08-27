import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info, Volume2, VolumeX } from 'lucide-react';
import { MediaItem } from '../../types';
import { Badge } from '../common/Badge';
import { useWatchlist } from '../../context/WatchlistContext';
import { GENRES } from '../../data/genres';

interface HoverCardModalProps {
  media: MediaItem;
  onOpenDetails: (media: MediaItem) => void;
  position: { top: number; left: number; width: number; height: number };
  onClose: () => void;
}

export const HoverCardModal: React.FC<HoverCardModalProps> = ({
  media,
  onOpenDetails,
  position,
  onClose
}) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(media.id);

  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${media.id}`);
  };

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(media);
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetails(media);
  };

  // Convert genre IDs to readable names
  const genreNames = media.genres
    .map(gId => GENRES.find(g => g.id === gId)?.name || gId)
    .slice(0, 3);

  // Position calculation with safe screen edges
  const modalWidth = 320;
  let leftPos = position.left + position.width / 2 - modalWidth / 2;
  if (leftPos < 16) leftPos = 16;
  if (leftPos + modalWidth > window.innerWidth - 16) {
    leftPos = window.innerWidth - modalWidth - 16;
  }

  const topPos = Math.max(16, position.top - 40);

  return (
    <div
      className="fixed z-50 animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: `${topPos}px`,
        left: `${leftPos}px`,
        width: `${modalWidth}px`
      }}
      onMouseLeave={onClose}
    >
      <div className="glass-dropdown rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#0E0E15]">
        {/* Video / Backdrop Preview */}
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          {media.videoUrl ? (
            <video
              src={media.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={media.backdropUrl || media.posterUrl}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E15] via-transparent to-black/30" />

          {/* Sound Toggle */}
          {media.videoUrl && videoLoaded && (
            <button
              onClick={e => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur border border-white/20 transition-transform active:scale-95"
              aria-label={isMuted ? 'Unmute preview' : 'Mute preview'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Quality Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge variant="quality">{media.quality}</Badge>
            {media.isOriginal && <Badge variant="original">Original</Badge>}
          </div>
        </div>

        {/* Info & Action Controls */}
        <div className="p-4 space-y-3">
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                className="w-9 h-9 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                title="Play Now"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>

              <button
                onClick={handleToggleList}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                  inList
                    ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>

            <button
              onClick={handleDetails}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              title="More Info"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Title and Metadata */}
          <div>
            <h4 className="font-display font-bold text-white text-sm line-clamp-1 mb-1">{media.title}</h4>
            <div className="flex items-center gap-2 text-xs text-text-secondary flex-wrap">
              <Badge matchPercentage={media.matchPercentage} />
              <Badge maturity={media.maturityRating} />
              <span>{media.releaseYear}</span>
              <span>
                {media.type === 'movie' ? `${media.runtime}m` : `${media.seasonsCount} Season${media.seasonsCount > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-text-muted">
            {genreNames.map((g, idx) => (
              <React.Fragment key={g}>
                <span className="hover:text-white transition-colors">{g}</span>
                {idx < genreNames.length - 1 && <span className="text-white/20">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
