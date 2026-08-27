import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Plus, Check, ThumbsUp, Volume2, VolumeX, Sparkles, Film, Calendar, Clock } from 'lucide-react';
import { MediaItem, TVShow, Season, Episode } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { StarRating } from '../common/StarRating';
import { MediaCard } from '../media/MediaCard';
import { useWatchlist } from '../../context/WatchlistContext';
import { mediaService } from '../../services/mediaService';
import { GENRES } from '../../data/genres';

interface QuickViewModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  media,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [selectedSeasonNum, setSelectedSeasonNum] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [similarTitles, setSimilarTitles] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (media) {
      setSelectedSeasonNum(1);
      setIsLiked(false);
      const similar = mediaService.getSimilar(media);
      setSimilarTitles(similar);
    }
  }, [media]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !media) return null;

  const inList = isInWatchlist(media.id);
  const isTV = media.type === 'tv';
  const tvShow = isTV ? (media as TVShow) : null;
  const currentSeason = tvShow?.seasons.find(s => s.seasonNumber === selectedSeasonNum) || tvShow?.seasons[0];

  const handlePlayMedia = (episodeId?: string) => {
    onClose();
    if (episodeId) {
      navigate(`/watch/${media.id}?ep=${episodeId}`);
    } else {
      navigate(`/watch/${media.id}`);
    }
  };

  const genreNames = media.genres
    .map(id => GENRES.find(g => g.id === id)?.name || id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 lg:p-10 animate-in fade-in duration-200">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#12121B] border border-white/10 rounded-2xl md:rounded-3xl shadow-cinematic overflow-hidden z-10 my-4 sm:my-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur border border-white/20 transition-transform hover:scale-110 active:scale-95"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video / Backdrop Header */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-black overflow-hidden">
          {media.videoUrl ? (
            <video
              src={media.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={media.backdropUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={media.backdropUrl}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#12121B] via-[#12121B]/30 to-transparent" />

          {/* Sound Toggle */}
          {media.videoUrl && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-6 right-6 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform hover:scale-110"
              aria-label={isMuted ? 'Unmute preview' : 'Mute preview'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {/* Action Row Inside Backdrop */}
          <div className="absolute bottom-6 left-6 right-16 flex flex-col justify-end">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-tight drop-shadow-lg mb-4">
              {media.title}
            </h2>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="primary"
                size="md"
                icon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => handlePlayMedia()}
                className="px-6 py-2.5 shadow-glow-primary"
              >
                Play
              </Button>

              <button
                onClick={() => toggleWatchlist(media)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                  inList
                    ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={inList ? 'In My List' : 'Add to My List'}
              >
                {inList ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                  isLiked
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={isLiked ? 'Liked' : 'Rate this title'}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Info */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary flex-wrap">
                <Badge matchPercentage={media.matchPercentage} />
                <Badge maturity={media.maturityRating} />
                <span>{media.releaseYear}</span>
                <span>
                  {media.type === 'movie'
                    ? `${media.runtime}m`
                    : `${tvShow?.seasonsCount} Season${tvShow?.seasonsCount && tvShow.seasonsCount > 1 ? 's' : ''}`}
                </span>
                <Badge variant="quality">{media.quality}</Badge>
                <Badge variant="audio">{media.audioQuality}</Badge>
                <StarRating rating={media.rating} />
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {media.description}
              </p>

              {media.featuredTags && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {media.featuredTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Cast & Crew sidebar details */}
            <div className="space-y-3 text-xs border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              {media.cast.length > 0 && (
                <div>
                  <span className="text-text-muted block mb-1">Starring:</span>
                  <div className="text-text-secondary leading-relaxed">
                    {media.cast.map(c => c.name).join(', ')}
                  </div>
                </div>
              )}

              {media.directors.length > 0 && (
                <div>
                  <span className="text-text-muted block mb-1">Director:</span>
                  <div className="text-text-secondary">
                    {media.directors.map(d => d.name).join(', ')}
                  </div>
                </div>
              )}

              <div>
                <span className="text-text-muted block mb-1">Genres:</span>
                <div className="text-text-secondary">
                  {genreNames.join(', ')}
                </div>
              </div>

              <div>
                <span className="text-text-muted block mb-1">Audio & Subtitles:</span>
                <div className="text-text-secondary">
                  {media.languages.join(', ')} • Subtitles in 5 languages
                </div>
              </div>
            </div>
          </div>

          {/* If TV Show: Seasons & Episodes Listing */}
          {isTV && tvShow && (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-white">Episodes</h3>

                {tvShow.seasons.length > 1 && (
                  <div className="relative">
                    <select
                      value={selectedSeasonNum}
                      onChange={e => setSelectedSeasonNum(Number(e.target.value))}
                      className="bg-[#1C1C2A] border border-white/15 text-white font-semibold text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer pr-8"
                    >
                      {tvShow.seasons.map(s => (
                        <option key={s.id} value={s.seasonNumber} className="bg-[#12121B] text-white">
                          Season {s.seasonNumber} ({s.episodes.length} Episodes)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Episodes List */}
              <div className="divide-y divide-white/5 space-y-2">
                {currentSeason?.episodes.map(ep => (
                  <div
                    key={ep.id}
                    onClick={() => handlePlayMedia(ep.id)}
                    className="group/ep p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <span className="text-xl font-display font-bold text-text-muted group-hover/ep:text-white w-6 shrink-0">
                      {ep.episodeNumber}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-36 aspect-video shrink-0 rounded-lg overflow-hidden bg-black">
                      <img
                        src={ep.thumbnailUrl}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover/ep:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/ep:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono text-white px-1 rounded">
                        {ep.runtime}m
                      </span>
                    </div>

                    {/* Episode Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-white group-hover/ep:text-brand-secondary transition-colors">
                          {ep.title}
                        </h4>
                        <span className="text-xs text-text-muted font-mono">{ep.runtime}m</span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cast Carousel / Grid */}
          {media.cast.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-display text-xl font-bold text-white">Cast & Characters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {media.cast.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{member.name}</h5>
                      <p className="text-[11px] text-text-muted truncate">{member.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Like This */}
          {similarTitles.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-display text-xl font-bold text-white">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarTitles.slice(0, 4).map(item => (
                  <MediaCard
                    key={item.id}
                    media={item}
                    variant="poster"
                    onOpenDetails={m => {
                      // switch modal content
                      navigate(m.type === 'tv' ? `/show/${m.id}` : `/movie/${m.id}`);
                      onClose();
                    }}
                    className="!w-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* About & Studio Info */}
          <div className="pt-6 border-t border-white/10 text-xs text-text-muted space-y-2">
            <h4 className="font-bold text-white text-sm">About {media.title}</h4>
            <p>
              Released in {media.releaseYear}. Rated {media.maturityRating}. Audio description and closed captions available in multiple languages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
