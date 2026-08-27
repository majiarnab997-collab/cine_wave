import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Volume2, VolumeX, Plus, Check } from 'lucide-react';
import { MediaItem } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useWatchlist } from '../../context/WatchlistContext';
import { GENRES } from '../../data/genres';

interface HeroBannerProps {
  media: MediaItem;
  onOpenDetails: (media: MediaItem) => void;
  autoPlayVideo?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  media,
  onOpenDetails,
  autoPlayVideo = true
}) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(media.id);

  const [isMuted, setIsMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Delay video start slightly for smoother initial render
    const timer = setTimeout(() => {
      if (videoRef.current && autoPlayVideo) {
        videoRef.current.play().then(() => {
          setVideoPlaying(true);
        }).catch(() => {
          // Autoplay policy prevented playback, keep static image
          setVideoPlaying(false);
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [media.id, autoPlayVideo]);

  const handlePlay = () => {
    navigate(`/watch/${media.id}`);
  };

  const handleToggleWatchlist = () => {
    toggleWatchlist(media);
  };

  const genreNames = media.genres
    .map(id => GENRES.find(g => g.id === id)?.name || id)
    .slice(0, 3);

  return (
    <div className="relative w-full h-[75vh] sm:h-[80vh] md:h-[86vh] lg:h-[90vh] bg-background-surface overflow-hidden select-none">
      {/* Background Media: Video or Backdrop Image */}
      <div className="absolute inset-0 w-full h-full">
        {media.videoUrl && autoPlayVideo ? (
          <video
            ref={videoRef}
            src={media.videoUrl}
            loop
            muted={isMuted}
            playsInline
            poster={media.backdropUrl}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              videoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        {/* Fallback & Loading Backdrop Image */}
        <img
          src={media.backdropUrl}
          alt={media.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />

        {/* Multi-Directional Dark Cinematic Gradients */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-hero-side" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-black/30" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 md:pb-24 z-20">
        <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Brand & Category Tag */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {media.isOriginal && (
              <Badge variant="original">CINEWAVE ORIGINAL</Badge>
            )}
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-amber flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              #1 in Movies Today
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.05] drop-shadow-2xl">
            {media.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary flex-wrap font-medium">
            <Badge matchPercentage={media.matchPercentage} />
            <Badge maturity={media.maturityRating} />
            <span>{media.releaseYear}</span>
            <span>
              {media.type === 'movie'
                ? `${media.runtime} min`
                : `${media.seasonsCount} Season${media.seasonsCount > 1 ? 's' : ''}`}
            </span>
            <Badge variant="quality">{media.quality}</Badge>
            <Badge variant="audio">{media.audioQuality}</Badge>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 line-clamp-3 leading-relaxed drop-shadow max-w-xl">
            {media.description}
          </p>

          {/* Genres */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted">
            <span className="font-semibold text-white/70">Genres:</span>
            {genreNames.map((g, i) => (
              <span key={g} className="text-slate-300">
                {g}{i < genreNames.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 pt-2 sm:pt-4 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              icon={<Play className="w-5 h-5 fill-current" />}
              onClick={handlePlay}
              className="px-7 py-3.5 text-base shadow-glow-primary hover:scale-105"
            >
              Play Now
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Info className="w-5 h-5" />}
              onClick={() => onOpenDetails(media)}
              className="px-6 py-3.5 text-base hover:scale-105"
            >
              More Info
            </Button>

            <Button
              variant="glass"
              size="icon"
              onClick={handleToggleWatchlist}
              className="w-12 h-12 rounded-full hover:scale-110"
              title={inList ? 'In My List' : 'Add to My List'}
            >
              {inList ? <Check className="w-5 h-5 text-brand-primary stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Audio Controls Bottom Right */}
      <div className="absolute right-4 sm:right-8 md:right-16 bottom-16 sm:bottom-20 md:bottom-24 z-20 flex items-center gap-3">
        {media.videoUrl && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full glass-panel bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-110 active:scale-95 shadow-lg"
            aria-label={isMuted ? 'Unmute trailer' : 'Mute trailer'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        <div className="hidden sm:flex items-center px-3 py-1 bg-black/60 backdrop-blur border-l-4 border-brand-primary text-xs font-mono font-bold text-white">
          {media.maturityRating}
        </div>
      </div>
    </div>
  );
};
