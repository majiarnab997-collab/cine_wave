import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Plus, Check, ThumbsUp, ArrowLeft, Star, Volume2, VolumeX, Share2, Film } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { MediaRow } from '../components/media/MediaRow';
import { ErrorState } from '../components/common/ErrorState';
import { mediaService } from '../services/mediaService';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { Movie, MediaItem } from '../types';
import { GENRES } from '../data/genres';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (!id) return <ErrorState title="Movie not found" />;

  const media = mediaService.getMediaById(id);
  if (!media || media.type !== 'movie') {
    return <ErrorState title="This movie is not available in your region or has been removed." />;
  }

  const movie = media as Movie;
  const inList = isInWatchlist(movie.id);
  const similar = mediaService.getSimilar(movie);
  const genreNames = movie.genres.map(g => GENRES.find(x => x.id === g)?.name || g);

  const handlePlay = () => {
    navigate(`/watch/${movie.id}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Movie link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pb-12 lg:pb-0">
      <Navbar />

      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[82vh] bg-black overflow-hidden select-none">
        {movie.videoUrl ? (
          <video
            src={movie.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={movie.backdropUrl}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-hero-side" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-black/30" />

        {/* Sound toggle */}
        {movie.videoUrl && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-12 right-6 sm:right-12 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform hover:scale-110 shadow-lg"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* Hero Overlay Content */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 z-20">
          <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center gap-2">
              {movie.isOriginal && <Badge variant="original">CINEWAVE ORIGINAL</Badge>}
              <span className="text-xs font-bold uppercase text-brand-amber font-mono">
                {movie.quality}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-tight drop-shadow-2xl">
              {movie.title}
            </h1>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary flex-wrap font-medium">
              <Badge matchPercentage={movie.matchPercentage} />
              <Badge maturity={movie.maturityRating} />
              <span>{movie.releaseYear}</span>
              <span>{movie.runtime} min</span>
              <Badge variant="audio">{movie.audioQuality}</Badge>
              <StarRating rating={movie.rating} />
            </div>

            <p className="text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed drop-shadow">
              {movie.description}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                icon={<Play className="w-5 h-5 fill-current" />}
                onClick={handlePlay}
                className="px-8 py-3.5 shadow-glow-primary hover:scale-105"
              >
                Play Movie
              </Button>

              <button
                onClick={() => toggleWatchlist(movie)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
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
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                  isLiked
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title="Rate"
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Cast & Crew Section */}
        {movie.cast.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">Cast & Characters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-[#12121B] border border-white/5 space-y-2 hover:border-white/20 transition-colors"
                >
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-full aspect-square rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white truncate">{c.name}</h5>
                    <p className="text-[11px] text-text-muted truncate">{c.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical & Production Info */}
        <div className="p-6 rounded-3xl bg-[#12121B] border border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="text-text-muted block uppercase font-bold text-[10px] mb-1">Director</span>
            <span className="text-white font-semibold text-sm">
              {movie.directors.map(d => d.name).join(', ') || 'Denis Vane'}
            </span>
          </div>

          <div>
            <span className="text-text-muted block uppercase font-bold text-[10px] mb-1">Genres</span>
            <span className="text-white font-semibold text-sm">{genreNames.join(', ')}</span>
          </div>

          <div>
            <span className="text-text-muted block uppercase font-bold text-[10px] mb-1">Languages & Subtitles</span>
            <span className="text-white font-semibold text-sm">English, Spanish, French, German, Hindi</span>
          </div>

          <div>
            <span className="text-text-muted block uppercase font-bold text-[10px] mb-1">Maturity Advisory</span>
            <span className="text-white font-semibold text-sm">Rated {movie.maturityRating} for dramatic intensity</span>
          </div>
        </div>

        {/* Similar Titles Carousel */}
        {similar.length > 0 && (
          <MediaRow
            title="More Like This"
            subtitle={`Titles similar to ${movie.title}`}
            items={similar}
          />
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};
