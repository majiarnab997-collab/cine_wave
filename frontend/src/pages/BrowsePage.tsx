import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { MediaGrid } from '../components/media/MediaGrid';
import { QuickViewModal } from '../components/modals/QuickViewModal';
import { EmptyState } from '../components/common/EmptyState';
import { mediaService } from '../services/mediaService';
import { useProfile } from '../context/ProfileContext';
import { GENRES } from '../data/genres';
import { MediaItem, MediaType, MaturityRating } from '../types';
import { Filter, SlidersHorizontal, Film, Tv, Sparkles, RefreshCw } from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const { isKidsMode } = useProfile();

  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMaturity, setSelectedMaturity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'az'>('popular');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allItems = mediaService.getAllMedia();
  let filtered = isKidsMode ? allItems.filter(m => m.isKidsSafe) : allItems;

  if (typeFilter !== 'all') {
    filtered = filtered.filter(m => m.type === typeFilter);
  }

  if (selectedGenre !== 'all') {
    filtered = filtered.filter(m => m.genres.includes(selectedGenre));
  }

  if (selectedYear !== 'all') {
    const yr = Number(selectedYear);
    filtered = filtered.filter(m => m.releaseYear === yr);
  }

  if (selectedMaturity !== 'all') {
    filtered = filtered.filter(m => m.maturityRating === selectedMaturity);
  }

  switch (sortBy) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
    case 'az':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'popular':
    default:
      filtered.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
      break;
  }

  const handleResetFilters = () => {
    setTypeFilter('all');
    setSelectedGenre('all');
    setSelectedYear('all');
    setSelectedMaturity('all');
    setSortBy('popular');
  };

  const handleOpenDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pt-20 pb-12 lg:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Page Title & Breadcrumb */}
        <div className="space-y-1">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Browse Entire Catalog
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Filter movies, TV series, genres, ratings, and release years across CineWave.
          </p>
        </div>

        {/* Multi-Faceted Filter Panel */}
        <div className="p-5 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Smart Catalog Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-text-muted hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Type Filter */}
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Content Type</label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="w-full bg-[#161622] border border-white/10 text-white font-semibold text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="all">All Content</option>
                <option value="movie">Movies Only</option>
                <option value="tv">TV Shows Only</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Genre</label>
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="w-full bg-[#161622] border border-white/10 text-white font-semibold text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="all">All Genres</option>
                {GENRES.map(g => (
                  <option key={g.id} value={g.slug}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Release Year</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full bg-[#161622] border border-white/10 text-white font-semibold text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="all">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            {/* Maturity Rating */}
            {!isKidsMode && (
              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Maturity Rating</label>
                <select
                  value={selectedMaturity}
                  onChange={e => setSelectedMaturity(e.target.value)}
                  className="w-full bg-[#161622] border border-white/10 text-white font-semibold text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
                >
                  <option value="all">All Ratings</option>
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="TV-14">TV-14</option>
                  <option value="TV-MA">TV-MA</option>
                  <option value="R">R</option>
                </select>
              </div>
            )}

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full bg-[#161622] border border-white/10 text-white font-semibold text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="az">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-text-muted">
              Showing {filtered.length} matching titles
            </span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Film className="w-8 h-8" />}
              title="No titles match your filter criteria"
              description="Try adjusting your genre, year, or maturity filters to discover more cinema."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <MediaGrid items={filtered} onOpenDetails={handleOpenDetails} />
          )}
        </div>
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
