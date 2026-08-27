import React, { useState, useEffect } from 'react';
import { X, Film, Tv, Sparkles } from 'lucide-react';
import { Movie, TVShow, MediaItem, MaturityRating } from '../../types';
import { Button } from '../common/Button';
import { GENRES } from '../../data/genres';
import { CAST_MEMBERS, DIRECTORS } from '../../data/cast';

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: MediaItem | null;
  onSave: (item: MediaItem) => void;
}

export const ContentFormModal: React.FC<ContentFormModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  onSave
}) => {
  const isEditing = Boolean(itemToEdit);

  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState(2026);
  const [runtime, setRuntime] = useState(120);
  const [maturityRating, setMaturityRating] = useState<MaturityRating>('PG-13');
  const [rating, setRating] = useState(8.5);
  const [matchPercentage, setMatchPercentage] = useState(95);
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['sci-fi', 'action']);
  const [isOriginal, setIsOriginal] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setType(itemToEdit.type);
      setTitle(itemToEdit.title);
      setTagline(itemToEdit.tagline || '');
      setDescription(itemToEdit.description);
      setReleaseYear(itemToEdit.releaseYear);
      setMaturityRating(itemToEdit.maturityRating);
      setRating(itemToEdit.rating);
      setMatchPercentage(itemToEdit.matchPercentage);
      setPosterUrl(itemToEdit.posterUrl);
      setBackdropUrl(itemToEdit.backdropUrl);
      setVideoUrl(itemToEdit.videoUrl);
      setSelectedGenres(itemToEdit.genres);
      setIsOriginal(Boolean(itemToEdit.isOriginal));
      setIsFeatured(Boolean(itemToEdit.isFeatured));
      setIsTrending(Boolean(itemToEdit.isTrending));
      if (itemToEdit.type === 'movie') {
        setRuntime((itemToEdit as Movie).runtime || 120);
      }
    } else {
      setType('movie');
      setTitle('');
      setTagline('');
      setDescription('');
      setReleaseYear(2026);
      setRuntime(120);
      setMaturityRating('PG-13');
      setRating(8.5);
      setMatchPercentage(95);
      setPosterUrl('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80');
      setBackdropUrl('https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1920&q=85');
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
      setSelectedGenres(['sci-fi', 'action']);
      setIsOriginal(true);
      setIsFeatured(false);
      setIsTrending(true);
    }
    setError('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleGenreToggle = (slug: string) => {
    if (selectedGenres.includes(slug)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter(g => g !== slug));
      }
    } else {
      setSelectedGenres([...selectedGenres, slug]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    const baseData = {
      id: itemToEdit ? itemToEdit.id : `${type === 'movie' ? 'mov' : 'show'}-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      releaseYear: Number(releaseYear),
      maturityRating,
      isKidsSafe: maturityRating === 'G' || maturityRating === 'PG',
      rating: Number(rating),
      voteCount: itemToEdit?.voteCount || 1000,
      matchPercentage: Number(matchPercentage),
      posterUrl: posterUrl.trim() || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      backdropUrl: backdropUrl.trim() || 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1920&q=85',
      videoUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      trailerUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      genres: selectedGenres,
      cast: itemToEdit?.cast || [CAST_MEMBERS[0], CAST_MEMBERS[1]],
      directors: itemToEdit?.directors || [DIRECTORS[0]],
      languages: itemToEdit?.languages || ['English'],
      subtitles: itemToEdit?.subtitles || [
        { id: 'sub-en', language: 'en', label: 'English [CC]', src: '', default: true },
        { id: 'sub-es', language: 'es', label: 'Español', src: '' }
      ],
      audioTracks: itemToEdit?.audioTracks || [
        { id: 'aud-orig', language: 'en', label: 'English [Original] (5.1)', isOriginal: true, channels: '5.1 Surround' }
      ],
      isOriginal,
      isFeatured,
      isTrending,
      isPopular: true,
      quality: '4K Ultra HD' as const,
      audioQuality: 'Dolby Atmos' as const,
      createdAt: itemToEdit?.createdAt || new Date().toISOString()
    };

    if (type === 'movie') {
      const movie: Movie = {
        ...baseData,
        type: 'movie',
        runtime: Number(runtime)
      };
      onSave(movie);
    } else {
      const show: TVShow = {
        ...baseData,
        type: 'tv',
        seasonsCount: itemToEdit ? (itemToEdit as TVShow).seasonsCount : 1,
        totalEpisodes: itemToEdit ? (itemToEdit as TVShow).totalEpisodes : 8,
        seasons: itemToEdit && (itemToEdit as TVShow).seasons ? (itemToEdit as TVShow).seasons : [
          {
            id: `season-1-${Date.now()}`,
            showId: baseData.id,
            seasonNumber: 1,
            title: 'Season 1',
            releaseYear: Number(releaseYear),
            episodeCount: 8,
            episodes: [
              {
                id: `ep-1-${Date.now()}`,
                showId: baseData.id,
                seasonNumber: 1,
                episodeNumber: 1,
                title: '1. Pilot Episode',
                description: description.trim(),
                runtime: 45,
                thumbnailUrl: backdropUrl || 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=600&q=80',
                videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                releaseDate: '2026-01-01'
              }
            ]
          }
        ]
      };
      onSave(show);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#12121B] border border-white/10 rounded-2xl md:rounded-3xl shadow-cinematic p-6 sm:p-8 z-10 my-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            {isEditing ? `Edit: ${itemToEdit?.title}` : 'Add New Content'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Content Type Selector */}
          {!isEditing && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setType('movie')}
                className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  type === 'movie'
                    ? 'bg-brand-primary/20 border-brand-primary text-white shadow-glow-primary'
                    : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Feature Movie</span>
              </button>

              <button
                type="button"
                onClick={() => setType('tv')}
                className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  type === 'tv'
                    ? 'bg-brand-primary/20 border-brand-primary text-white shadow-glow-primary'
                    : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>TV Series</span>
              </button>
            </div>
          )}

          {/* Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Cyberpunk Nexus"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Beyond the boundary of dreams"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Synopsis / Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter full plot summary..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Metadata Row: Year, Runtime/Seasons, Maturity, Rating */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Release Year
              </label>
              <input
                type="number"
                value={releaseYear}
                onChange={e => setReleaseYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {type === 'movie' && (
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  Runtime (mins)
                </label>
                <input
                  type="number"
                  value={runtime}
                  onChange={e => setRuntime(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Maturity Rating
              </label>
              <select
                value={maturityRating}
                onChange={e => setMaturityRating(e.target.value as MaturityRating)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C2A] border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="TV-14">TV-14</option>
                <option value="TV-MA">TV-MA</option>
                <option value="R">R</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Critic Rating (0-10)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Genres Pills */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Genres (Select at least one)
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(genre => {
                const isSelected = selectedGenres.includes(genre.slug);
                return (
                  <button
                    type="button"
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-brand-primary text-white border-brand-primary shadow-glow-primary'
                        : 'bg-white/5 text-text-muted border-white/10 hover:text-white'
                    }`}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media URLs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                Poster Image URL (2:3 aspect)
              </label>
              <input
                type="url"
                value={posterUrl}
                onChange={e => setPosterUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                Backdrop Banner URL (16:9 aspect)
              </label>
              <input
                type="url"
                value={backdropUrl}
                onChange={e => setBackdropUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                Video Stream URL (MP4 / WebM / HLS CDN URL)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono"
              />
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <label className="flex items-center gap-2 text-xs text-white font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isOriginal}
                onChange={e => setIsOriginal(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
              <span>CineWave Original</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-white font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
              <span>Hero Spotlight</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-white font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={e => setIsTrending(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
              <span>Trending Flag</span>
            </label>
          </div>

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {isEditing ? 'Save Changes' : 'Publish Content'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
