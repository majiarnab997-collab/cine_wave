import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { HeroBanner } from '../components/hero/HeroBanner';
import { MediaRow } from '../components/media/MediaRow';
import { MediaGrid } from '../components/media/MediaGrid';
import { QuickViewModal } from '../components/modals/QuickViewModal';
import { mediaService } from '../services/mediaService';
import { useProfile } from '../context/ProfileContext';
import { GENRES } from '../data/genres';
import { MediaItem, Movie } from '../types';
import { SlidersHorizontal, LayoutGrid, Rows } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const { isKidsMode } = useProfile();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'az'>('popular');
  const [viewMode, setViewMode] = useState<'rows' | 'grid'>('rows');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allMovies = mediaService.getMovies();
  const availableMovies = isKidsMode ? allMovies.filter(m => m.isKidsSafe) : allMovies;
  const spotlightMovie = availableMovies[0];

  // Filtered & Sorted list for Grid view
  let filteredMovies = selectedGenre === 'all'
    ? [...availableMovies]
    : availableMovies.filter(m => m.genres.includes(selectedGenre));

  switch (sortBy) {
    case 'rating':
      filteredMovies.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filteredMovies.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
    case 'az':
      filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'popular':
    default:
      filteredMovies.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
      break;
  }

  const handleOpenDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pb-12 lg:pb-0">
      <Navbar />

      {/* Featured Spotlight Movie */}
      {spotlightMovie && (
        <HeroBanner
          media={spotlightMovie}
          onOpenDetails={handleOpenDetails}
        />
      )}

      {/* Subheader Filters & Controls */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-8">
        <div className="p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-black text-xl text-white tracking-tight mr-2">
              Movies
            </h1>

            {/* Genre Dropdown */}
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="bg-[#161622] border border-white/15 text-white font-semibold text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer pr-8"
              >
                <option value="all">All Genres</option>
                {GENRES.map(g => (
                  <option key={g.id} value={g.slug} className="bg-[#0E0E15] text-white">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#161622] border border-white/15 text-white font-semibold text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer pr-8"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="newest">Sort: Newest Releases</option>
                <option value="az">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-end md:self-auto">
            <button
              onClick={() => setViewMode('rows')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'rows' ? 'bg-brand-primary text-white shadow' : 'text-text-muted hover:text-white'
              }`}
              title="Carousel Row View"
            >
              <Rows className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-brand-primary text-white shadow' : 'text-text-muted hover:text-white'
              }`}
              title="Full Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Movies Content */}
      <main className="space-y-6">
        {viewMode === 'grid' || selectedGenre !== 'all' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4 text-xs text-text-muted">
              Showing {filteredMovies.length} movies
            </div>
            <MediaGrid items={filteredMovies} onOpenDetails={handleOpenDetails} />
          </div>
        ) : (
          <>
            {/* Action Blockbusters */}
            <MediaRow
              title="Action & Blockbusters"
              subtitle="Explosive fights, stunts, and adrenaline"
              items={availableMovies.filter(m => m.genres.includes('action'))}
              onOpenDetails={handleOpenDetails}
            />

            {/* Sci-Fi */}
            <MediaRow
              title="Sci-Fi & Cyberpunk Features"
              subtitle="Mind-bending anomalies and futuristic technology"
              items={availableMovies.filter(m => m.genres.includes('sci-fi'))}
              onOpenDetails={handleOpenDetails}
            />

            {/* Family & Animation */}
            <MediaRow
              title="Family & Animated Hits"
              subtitle="Heartwarming adventures for the whole family"
              items={availableMovies.filter(m => m.genres.includes('family'))}
              onOpenDetails={handleOpenDetails}
            />

            {/* Thriller & Mystery */}
            <MediaRow
              title="Edge-of-Your-Seat Thrillers"
              subtitle="Psychological suspense and deep-sea terror"
              items={availableMovies.filter(m => m.genres.includes('thriller'))}
              onOpenDetails={handleOpenDetails}
            />

            {/* Critically Acclaimed */}
            <MediaRow
              title="Critically Acclaimed Masterpieces"
              subtitle="High-rating award contenders"
              items={availableMovies.filter(m => m.rating >= 8.7)}
              onOpenDetails={handleOpenDetails}
            />
          </>
        )}
      </main>

      <QuickViewModal
        media={selectedMedia}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
      <MobileNav />
    </div>
  );
};
