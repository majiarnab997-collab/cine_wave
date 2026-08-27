import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ThumbsUp, Share2, ChevronDown, Star, Volume2, VolumeX } from 'lucide-react';
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
import { TVShow } from '../types';
import { GENRES } from '../data/genres';

export const ShowDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [selectedSeasonNum, setSelectedSeasonNum] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (!id) return <ErrorState title="TV Show not found" />;

  const media = mediaService.getMediaById(id);
  if (!media || media.type !== 'tv') {
    return <ErrorState title="This series is not available in your region or has been removed." />;
  }

  const show = media as TVShow;
  const inList = isInWatchlist(show.id);
  const similar = mediaService.getSimilar(show);
  const genreNames = show.genres.map(g => GENRES.find(x => x.id === g)?.name || g);

  const currentSeason = show.seasons.find(s => s.seasonNumber === selectedSeasonNum) || show.seasons[0];

  const handlePlayEpisode = (episodeId: string) => {
    navigate(`/watch/${show.id}?ep=${episodeId}`);
  };

  const handlePlayFirst = () => {
    const firstEpId = currentSeason?.episodes[0]?.id;
    if (firstEpId) {
      handlePlayEpisode(firstEpId);
    } else {
      navigate(`/watch/${show.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pb-12 lg:pb-0">
      <Navbar />

      {/* Backdrop Section */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[82vh] bg-black overflow-hidden select-none">
        {show.videoUrl ? (
          <video
            src={show.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={show.backdropUrl}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={show.backdropUrl}
            alt={show.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-hero-side" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-black/30" />

        {show.videoUrl && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-12 right-6 sm:right-12 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform hover:scale-110 shadow-lg"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 z-20">
          <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center gap-2">
              {show.isOriginal && <Badge variant="original">CINEWAVE ORIGINAL SERIES</Badge>}
              <span className="text-xs font-bold uppercase text-brand-amber font-mono">
                {show.quality}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-tight drop-shadow-2xl">
              {show.title}
            </h1>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary flex-wrap font-medium">
              <Badge matchPercentage={show.matchPercentage} />
              <Badge maturity={show.maturityRating} />
              <span>{show.releaseYear}</span>
              <span>
                {show.seasonsCount} Season{show.seasonsCount > 1 ? 's' : ''} ({show.totalEpisodes} Episodes)
              </span>
              <Badge variant="audio">{show.audioQuality}</Badge>
              <StarRating rating={show.rating} />
            </div>

            <p className="text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed drop-shadow">
              {show.description}
            </p>

            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                icon={<Play className="w-5 h-5 fill-current" />}
                onClick={handlePlayFirst}
                className="px-8 py-3.5 shadow-glow-primary hover:scale-105"
              >
                Start Watching (S{selectedSeasonNum}:E1)
              </Button>

              <button
                onClick={() => toggleWatchlist(show)}
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Episodes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">Episodes</h2>
              <p className="text-xs text-text-muted mt-0.5">Select an episode to begin stream</p>
            </div>

            {/* Season Selector Dropdown */}
            {show.seasons.length > 1 && (
              <div className="relative">
                <select
                  value={selectedSeasonNum}
                  onChange={e => setSelectedSeasonNum(Number(e.target.value))}
                  className="bg-[#161622] border border-white/15 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer pr-10 shadow-lg"
                >
                  {show.seasons.map(s => (
                    <option key={s.id} value={s.seasonNumber} className="bg-[#0E0E15] text-white">
                      Season {s.seasonNumber} ({s.episodes.length} Episodes)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Episode Cards Grid/List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSeason?.episodes.map(ep => (
              <div
                key={ep.id}
                onClick={() => handlePlayEpisode(ep.id)}
                className="group p-4 rounded-2xl bg-[#12121B] border border-white/5 hover:border-white/20 hover:bg-[#161624] transition-all cursor-pointer flex gap-4 items-center"
              >
                <span className="font-display font-black text-xl text-text-muted group-hover:text-white w-6 shrink-0 text-center">
                  {ep.episodeNumber}
                </span>

                <div className="relative w-32 sm:w-40 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                  <img
                    src={ep.thumbnailUrl}
                    alt={ep.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-glow-primary">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] font-mono text-white px-1.5 py-0.5 rounded">
                    {ep.runtime}m
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white group-hover:text-brand-secondary transition-colors truncate mb-1">
                    {ep.title}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {ep.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cast & Crew Section */}
        {show.cast.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">Cast & Characters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {show.cast.map(c => (
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

        {/* Similar Shows */}
        {similar.length > 0 && (
          <MediaRow
            title="More Like This"
            subtitle={`Series similar to ${show.title}`}
            items={similar}
          />
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};
