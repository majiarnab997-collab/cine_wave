import { WatchlistItem, MediaItem } from '../types';
import { mediaService } from './mediaService';
import { storage } from './storage';

const WATCHLIST_KEY = 'user_watchlist';

export const watchlistService = {
  getWatchlist(profileId: string): WatchlistItem[] {
    const list = storage.get<WatchlistItem[]>(WATCHLIST_KEY, []);
    // Populate media items
    return list
      .filter(item => item.profileId === profileId)
      .map(item => ({
        ...item,
        media: mediaService.getMediaById(item.mediaId) || item.media
      }))
      .filter(item => Boolean(item.media));
  },

  isInWatchlist(profileId: string, mediaId: string): boolean {
    const list = storage.get<WatchlistItem[]>(WATCHLIST_KEY, []);
    return list.some(item => item.profileId === profileId && item.mediaId === mediaId);
  },

  toggleWatchlist(userId: string, profileId: string, media: MediaItem): boolean {
    const list = storage.get<WatchlistItem[]>(WATCHLIST_KEY, []);
    const existingIndex = list.findIndex(i => i.profileId === profileId && i.mediaId === media.id);

    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
      storage.set(WATCHLIST_KEY, list);
      return false; // Removed
    } else {
      const newItem: WatchlistItem = {
        id: `wl-${Date.now()}`,
        userId,
        profileId,
        mediaId: media.id,
        mediaType: media.type,
        addedAt: new Date().toISOString(),
        media
      };
      list.unshift(newItem);
      storage.set(WATCHLIST_KEY, list);
      return true; // Added
    }
  },

  removeFromWatchlist(profileId: string, mediaId: string): void {
    const list = storage.get<WatchlistItem[]>(WATCHLIST_KEY, []);
    const updated = list.filter(i => !(i.profileId === profileId && i.mediaId === mediaId));
    storage.set(WATCHLIST_KEY, updated);
  }
};
