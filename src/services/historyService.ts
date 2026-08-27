import { WatchHistoryItem, MediaItem } from '../types';
import { mediaService } from './mediaService';
import { storage } from './storage';

const HISTORY_KEY = 'user_watch_history';

export const historyService = {
  getHistory(profileId: string): WatchHistoryItem[] {
    const list = storage.get<WatchHistoryItem[]>(HISTORY_KEY, []);
    return list
      .filter(i => i.profileId === profileId)
      .map(i => ({
        ...i,
        media: mediaService.getMediaById(i.mediaId) || i.media
      }))
      .filter(i => Boolean(i.media))
      .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
  },

  addHistoryItem(
    userId: string,
    profileId: string,
    media: MediaItem,
    durationWatched: number,
    completed: boolean,
    episodeId?: string
  ): void {
    const list = storage.get<WatchHistoryItem[]>(HISTORY_KEY, []);
    const existingIdx = list.findIndex(
      i => i.profileId === profileId && i.mediaId === media.id && i.episodeId === episodeId
    );

    const item: WatchHistoryItem = {
      id: existingIdx >= 0 ? list[existingIdx].id : `wh-${Date.now()}`,
      userId,
      profileId,
      mediaId: media.id,
      mediaType: media.type,
      episodeId,
      watchedAt: new Date().toISOString(),
      durationWatched,
      completed,
      media
    };

    if (existingIdx >= 0) {
      list[existingIdx] = item;
    } else {
      list.unshift(item);
    }

    // Keep max 50 history entries per profile
    storage.set(HISTORY_KEY, list.slice(0, 100));
  },

  removeHistoryItem(profileId: string, mediaId: string, episodeId?: string): void {
    const list = storage.get<WatchHistoryItem[]>(HISTORY_KEY, []);
    const updated = list.filter(
      i => !(i.profileId === profileId && i.mediaId === mediaId && i.episodeId === episodeId)
    );
    storage.set(HISTORY_KEY, updated);
  },

  clearHistory(profileId: string): void {
    const list = storage.get<WatchHistoryItem[]>(HISTORY_KEY, []);
    const updated = list.filter(i => i.profileId !== profileId);
    storage.set(HISTORY_KEY, updated);
  }
};
