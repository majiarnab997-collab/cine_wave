import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, Play, CheckCircle2, Film } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { historyService } from '../services/historyService';
import { useProfile } from '../context/ProfileContext';
import { WatchHistoryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const [historyItems, setHistoryItems] = useState<WatchHistoryItem[]>([]);

  const loadHistory = () => {
    if (activeProfile) {
      setHistoryItems(historyService.getHistory(activeProfile.id));
    }
  };

  useEffect(() => {
    loadHistory();
  }, [activeProfile?.id]);

  const handleRemove = (item: WatchHistoryItem) => {
    if (!activeProfile) return;
    historyService.removeHistoryItem(activeProfile.id, item.mediaId, item.episodeId);
    loadHistory();
  };

  const handleClearAll = () => {
    if (!activeProfile) return;
    if (window.confirm('Are you sure you want to clear your entire watch history?')) {
      historyService.clearHistory(activeProfile.id);
      loadHistory();
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pt-20 pb-12 lg:pb-0">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Watch History
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Playback timeline and completed titles for {activeProfile?.name || 'you'}
            </p>
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {historyItems.length === 0 ? (
          <EmptyState
            icon={<History className="w-8 h-8" />}
            title="No watch history recorded"
            description="Movies and series you stream will appear here in chronological order."
            actionText="Start Watching"
            actionHref="/home"
          />
        ) : (
          <div className="space-y-3 divide-y divide-white/5">
            {historyItems.map(item => (
              <div
                key={item.id}
                className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-2xl hover:bg-white/[0.02] transition-colors"
              >
                <div
                  onClick={() => navigate(`/watch/${item.mediaId}${item.episodeId ? `?ep=${item.episodeId}` : ''}`)}
                  className="flex items-center gap-4 cursor-pointer min-w-0"
                >
                  <img
                    src={item.media.posterUrl || item.media.backdropUrl}
                    alt={item.media.title}
                    className="w-14 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white hover:text-brand-secondary transition-colors truncate">
                      {item.media.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <span>{item.media.releaseYear}</span>
                      <span>•</span>
                      <Badge maturity={item.media.maturityRating} className="text-[9px] px-1 py-0" />
                      {item.completed && (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-text-muted font-mono block mt-1">
                      Watched on {new Date(item.watchedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => navigate(`/watch/${item.mediaId}${item.episodeId ? `?ep=${item.episodeId}` : ''}`)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-brand-primary text-white transition-colors"
                    title="Watch again"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-600/30 text-text-muted hover:text-red-400 transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};
