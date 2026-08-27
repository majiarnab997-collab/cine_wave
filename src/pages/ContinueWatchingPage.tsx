import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trash2, Clock, Film } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { EmptyState } from '../components/common/EmptyState';
import { QuickViewModal } from '../components/modals/QuickViewModal';
import { Badge } from '../components/common/Badge';
import { usePlayback } from '../context/PlaybackContext';
import { useProfile } from '../context/ProfileContext';
import { MediaItem, ContinueWatchingItem } from '../types';

export const ContinueWatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const { continueWatching, removeProgress } = usePlayback();
  const { activeProfile } = useProfile();

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResume = (item: ContinueWatchingItem) => {
    if (item.episodeId) {
      navigate(`/watch/${item.mediaId}?ep=${item.episodeId}`);
    } else {
      navigate(`/watch/${item.mediaId}`);
    }
  };

  const handleRemove = (e: React.MouseEvent, item: ContinueWatchingItem) => {
    e.stopPropagation();
    removeProgress(item.mediaId, item.episodeId);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pt-20 pb-12 lg:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Continue Watching
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Pick up right where you left off on any device for {activeProfile?.name || 'you'}
          </p>
        </div>

        {continueWatching.length === 0 ? (
          <EmptyState
            icon={<Clock className="w-8 h-8" />}
            title="Nothing in progress yet"
            description="When you start watching any movie or TV series on CineWave, your exact playback position will appear here automatically."
            actionText="Start Streaming Now"
            actionHref="/home"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {continueWatching.map(item => {
              const remainingSec = Math.max(0, item.duration - item.currentPosition);
              const remainingMin = Math.ceil(remainingSec / 60);

              return (
                <div
                  key={item.id}
                  onClick={() => handleResume(item)}
                  className="group rounded-2xl overflow-hidden bg-[#12121B] border border-white/10 hover:border-white/25 hover:shadow-cinematic transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={item.media.backdropUrl || item.media.posterUrl}
                      alt={item.media.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-glow-primary">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <button
                      onClick={e => handleRemove(e, item)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-white/20 w-full">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-amber"
                      style={{ width: `${item.progressPercentage}%` }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-brand-secondary transition-colors line-clamp-1">
                        {item.media.title}
                      </h3>
                      <span className="text-[11px] font-mono text-brand-amber shrink-0">
                        {remainingMin}m left
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted">
                      {item.seasonNumber && item.episodeNumber ? (
                        <span className="font-medium text-text-secondary">
                          Season {item.seasonNumber} : Episode {item.episodeNumber}
                        </span>
                      ) : (
                        <Badge maturity={item.media.maturityRating} className="text-[9px] px-1 py-0" />
                      )}
                      <span className="text-emerald-400 font-bold">{item.progressPercentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
