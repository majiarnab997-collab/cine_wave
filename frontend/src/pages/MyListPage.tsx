import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { MediaGrid } from '../components/media/MediaGrid';
import { QuickViewModal } from '../components/modals/QuickViewModal';
import { EmptyState } from '../components/common/EmptyState';
import { useWatchlist } from '../context/WatchlistContext';
import { useProfile } from '../context/ProfileContext';
import { MediaItem } from '../types';
import { Bookmark, Film, Tv } from 'lucide-react';

export const MyListPage: React.FC = () => {
  const { watchlist } = useWatchlist();
  const { activeProfile } = useProfile();
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let items = watchlist.map(i => i.media).filter(Boolean);
  if (filterType !== 'all') {
    items = items.filter(m => m.type === filterType);
  }

  const handleOpenDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pt-20 pb-12 lg:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              My Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Saved titles for {activeProfile?.name || 'your profile'}
            </p>
          </div>

          {/* Filter Pills */}
          {watchlist.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filterType === 'all'
                    ? 'bg-brand-primary text-white shadow-glow-primary'
                    : 'bg-white/5 text-text-secondary hover:text-white'
                }`}
              >
                All ({watchlist.length})
              </button>
              <button
                onClick={() => setFilterType('movie')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  filterType === 'movie'
                    ? 'bg-brand-primary text-white shadow-glow-primary'
                    : 'bg-white/5 text-text-secondary hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => setFilterType('tv')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  filterType === 'tv'
                    ? 'bg-brand-primary text-white shadow-glow-primary'
                    : 'bg-white/5 text-text-secondary hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV Shows</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-8 h-8" />}
            title="Your Watchlist is empty"
            description="Save movies and TV shows to your list by clicking the '+ My List' button on any card or details page."
            actionText="Explore Trending Cinema"
            actionHref="/home"
          />
        ) : (
          <MediaGrid items={items} onOpenDetails={handleOpenDetails} />
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
