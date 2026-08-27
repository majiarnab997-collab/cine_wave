import { ContinueWatchingItem, MediaItem } from '../types';
import { mediaService } from './mediaService';
import { storage } from './storage';
import { historyService } from './historyService';

const PLAYBACK_KEY = 'user_continue_watching';

// Initial seed continue watching item for exciting first-load UX
function initPlayback() {
  const existing = storage.get<ContinueWatchingItem[] | null>(PLAYBACK_KEY, null);
  if (!existing) {
    const movies = mediaService.getMovies();
    const shows = mediaService.getTVShows();
    if (movies.length > 0 && shows.length > 0) {
      const sampleItems: ContinueWatchingItem[] = [
        {
          id: 'cw-1',
          userId: 'user-1',
          profileId: 'prof-alex',
          mediaId: movies[0].id,
          mediaType: 'movie',
          currentPosition: 3840, // ~64 minutes in
          duration: movies[0].runtime * 60,
          progressPercentage: 43,
          lastWatchedAt: new Date(Date.now() - 3600000).toISOString(),
          media: movies[0]
        },
        {
          id: 'cw-2',
          userId: 'user-1',
          profileId: 'prof-alex',
          mediaId: shows[0].id,
          mediaType: 'tv',
          episodeId: shows[0].seasons[0]?.episodes[0]?.id,
          seasonNumber: 1,
          episodeNumber: 1,
          currentPosition: 1920, // ~32 minutes in
          duration: 3360,
          progressPercentage: 57,
          lastWatchedAt: new Date(Date.now() - 7200000).toISOString(),
          media: shows[0]
        }
      ];
      storage.set(PLAYBACK_KEY, sampleItems);
    }
  }
}

initPlayback();

export const playbackService = {
  getContinueWatching(profileId: string): ContinueWatchingItem[] {
    const items = storage.get<ContinueWatchingItem[]>(PLAYBACK_KEY, []);
    return items
      .filter(i => i.profileId === profileId)
      .map(i => ({
        ...i,
        media: mediaService.getMediaById(i.mediaId) || i.media
      }))
      .filter(i => Boolean(i.media))
      .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime());
  },

  getPlaybackPosition(profileId: string, mediaId: string, episodeId?: string): number {
    const items = storage.get<ContinueWatchingItem[]>(PLAYBACK_KEY, []);
    const found = items.find(i => {
      if (episodeId) {
        return i.profileId === profileId && i.mediaId === mediaId && i.episodeId === episodeId;
      }
      return i.profileId === profileId && i.mediaId === mediaId;
    });
    return found ? found.currentPosition : 0;
  },

  saveProgress(
    userId: string,
    profileId: string,
    media: MediaItem,
    currentPosition: number,
    duration: number,
    episodeData?: { episodeId: string; seasonNumber: number; episodeNumber: number }
  ): void {
    if (duration <= 0) return;

    const progressPercentage = Math.min(100, Math.round((currentPosition / duration) * 100));
    const items = storage.get<ContinueWatchingItem[]>(PLAYBACK_KEY, []);

    // If near the very end (> 95%), remove from continue watching and mark completed in history
    if (progressPercentage >= 95) {
      this.removeFromContinueWatching(profileId, media.id, episodeData?.episodeId);
      historyService.addHistoryItem(userId, profileId, media, currentPosition, true, episodeData?.episodeId);
      return;
    }

    // Don't save if position is under 10 seconds
    if (currentPosition < 10) return;

    const existingIdx = items.findIndex(i => {
      if (episodeData) {
        return i.profileId === profileId && i.mediaId === media.id && i.episodeId === episodeData.episodeId;
      }
      return i.profileId === profileId && i.mediaId === media.id;
    });

    const newItem: ContinueWatchingItem = {
      id: existingIdx >= 0 ? items[existingIdx].id : `cw-${Date.now()}`,
      userId,
      profileId,
      mediaId: media.id,
      mediaType: media.type,
      episodeId: episodeData?.episodeId,
      seasonNumber: episodeData?.seasonNumber,
      episodeNumber: episodeData?.episodeNumber,
      currentPosition,
      duration,
      progressPercentage,
      lastWatchedAt: new Date().toISOString(),
      media
    };

    if (existingIdx >= 0) {
      items[existingIdx] = newItem;
    } else {
      items.unshift(newItem);
    }

    storage.set(PLAYBACK_KEY, items);
    historyService.addHistoryItem(userId, profileId, media, currentPosition, false, episodeData?.episodeId);
  },

  removeFromContinueWatching(profileId: string, mediaId: string, episodeId?: string): void {
    const items = storage.get<ContinueWatchingItem[]>(PLAYBACK_KEY, []);
    const filtered = items.filter(i => {
      if (episodeId) {
        return !(i.profileId === profileId && i.mediaId === mediaId && i.episodeId === episodeId);
      }
      return !(i.profileId === profileId && i.mediaId === mediaId);
    });
    storage.set(PLAYBACK_KEY, filtered);
  }
};
