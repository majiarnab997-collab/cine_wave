import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WatchlistItem, MediaItem } from '../types';
import { watchlistService } from '../services/watchlistService';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { analyticsService } from '../services/analyticsService';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  isInWatchlist: (mediaId: string) => boolean;
  toggleWatchlist: (media: MediaItem) => boolean;
  removeFromWatchlist: (mediaId: string) => void;
  refreshWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { activeProfile } = useProfile();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  const loadWatchlist = () => {
    if (activeProfile) {
      const list = watchlistService.getWatchlist(activeProfile.id);
      setWatchlist(list);
    } else {
      setWatchlist([]);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, [activeProfile?.id]);

  const isInWatchlist = (mediaId: string): boolean => {
    if (!activeProfile) return false;
    return watchlistService.isInWatchlist(activeProfile.id, mediaId);
  };

  const toggleWatchlist = (media: MediaItem): boolean => {
    if (!user || !activeProfile) return false;
    const added = watchlistService.toggleWatchlist(user.id, activeProfile.id, media);
    loadWatchlist();
    analyticsService.track(
      added ? 'title_added_to_list' : 'title_removed_from_list',
      { title: media.title, type: media.type },
      user.id,
      activeProfile.id,
      media.id
    );
    return added;
  };

  const removeFromWatchlist = (mediaId: string) => {
    if (!activeProfile) return;
    watchlistService.removeFromWatchlist(activeProfile.id, mediaId);
    loadWatchlist();
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isInWatchlist,
        toggleWatchlist,
        removeFromWatchlist,
        refreshWatchlist: loadWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
