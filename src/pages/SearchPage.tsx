import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles, Film, Tv, TrendingUp } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { MediaGrid } from '../components/media/MediaGrid';
import { QuickViewModal } from '../components/modals/QuickViewModal';
import { EmptyState } from '../components/common/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { mediaService } from '../services/mediaService';
import { useProfile } from '../context/ProfileContext';
import { MediaItem } from '../types';
import { analyticsService } from '../services/analyticsService';

const SUGGESTIONS = [
  'Sci-Fi',
  'Tokyo',
  'Elena Rostova',
  'Action',
  'Cyberpunk',
  'Christopher Nolan',
  'Family',
  'Anime',
  'Deep Sea'
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isKidsMode } = useProfile();

  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedQuery = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
      analyticsService.track('search_performed', { query: debouncedQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  // Execute Search
  let results: MediaItem[] = [];
  if (debouncedQuery.trim()) {
    results = mediaService.search(
      {
        query: debouncedQuery,
        type: selectedType
      },
      isKidsMode
    );
  } else {
    // Show trending/popular when search is empty
    results = mediaService.getTrending(isKidsMode);
  }

  const handleOpenDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  const handleSelectSuggestion = (tag: string) => {
    setSearchTerm(tag);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pt-20 pb-12 lg:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Header & Input */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-6 h-6 text-brand-primary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search by title, character, actor, director, genre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-13 pr-12 py-4 rounded-2xl bg-[#12121B] border border-white/15 text-white placeholder-text-muted text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-cinematic transition-all pl-12"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-muted hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Suggestion Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-text-muted flex items-center gap-1 mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-brand-amber" />
              Popular:
            </span>
            {SUGGESTIONS.map(tag => (
              <button
                key={tag}
                onClick={() => handleSelectSuggestion(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  searchTerm.toLowerCase() === tag.toLowerCase()
                    ? 'bg-brand-primary text-white border-brand-primary shadow-glow-primary'
                    : 'bg-white/5 border-white/10 text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Content Type Filter Tabs */}
        {debouncedQuery.trim() && (
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedType === 'all'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-text-secondary hover:text-white'
                }`}
              >
                All Results ({results.length})
              </button>
              <button
                onClick={() => setSelectedType('movie')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  selectedType === 'movie'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-text-secondary hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => setSelectedType('tv')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  selectedType === 'tv'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-text-secondary hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV Shows</span>
              </button>
            </div>

            <span className="text-xs text-text-muted font-mono hidden sm:block">
              Showing results for "{debouncedQuery}"
            </span>
          </div>
        )}

        {/* Search Results Grid or Empty State */}
        <div>
          {!debouncedQuery.trim() && (
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Explore Popular Titles
            </h3>
          )}

          {debouncedQuery.trim() && results.length === 0 ? (
            <EmptyState
              icon={<Search className="w-8 h-8" />}
              title={`No results found for "${debouncedQuery}"`}
              description="Check your spelling or search for another movie, TV show, actor, or genre."
              actionText="Clear Search Query"
              onAction={() => setSearchTerm('')}
            />
          ) : (
            <MediaGrid items={results} onOpenDetails={handleOpenDetails} />
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
