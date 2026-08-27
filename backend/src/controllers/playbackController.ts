import { Request, Response } from 'express';
import { db } from '../db';
import { ContinueWatchingItem } from '../models';

export const playbackController = {
  getContinueWatching: (req: Request, res: Response) => {
    const { profileId } = req.query;
    if (!profileId) {
      return res.status(400).json({ success: false, error: 'profileId is required' });
    }

    const items = db.continueWatching.filter(c => c.profileId === profileId);
    const populated = items.map(item => {
      const media = [...db.movies, ...db.shows].find(m => m.id === item.mediaId);
      return { ...item, media };
    }).filter(i => i.media !== undefined);

    populated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return res.json({ success: true, data: populated });
  },

  updateProgress: (req: Request, res: Response) => {
    const {
      profileId,
      mediaId,
      episodeId,
      seasonNumber,
      episodeNumber,
      currentPosition,
      duration
    } = req.body;

    if (!profileId || !mediaId || currentPosition === undefined || !duration) {
      return res.status(400).json({ success: false, error: 'Missing required progress data' });
    }

    const progressPercentage = Math.min(100, Math.round((currentPosition / duration) * 100));

    if (progressPercentage >= 95) {
      const filteredCw = db.continueWatching.filter(c =>
        !(c.profileId === profileId && c.mediaId === mediaId && c.episodeId === episodeId)
      );
      db.continueWatching.length = 0;
      db.continueWatching.push(...filteredCw);

      const existingHistory = db.watchHistory.find(h =>
        h.profileId === profileId && h.mediaId === mediaId && h.episodeId === episodeId
      );
      if (existingHistory) {
        existingHistory.completed = true;
        existingHistory.watchedAt = new Date().toISOString();
      } else {
        db.watchHistory.unshift({
          id: `wh-${Date.now()}`,
          profileId,
          mediaId,
          episodeId,
          watchedAt: new Date().toISOString(),
          completed: true
        });
      }

      db.save();
      return res.json({ success: true, completed: true });
    }

    const existingIndex = db.continueWatching.findIndex(c =>
      c.profileId === profileId && c.mediaId === mediaId && c.episodeId === episodeId
    );

    if (existingIndex !== -1) {
      db.continueWatching[existingIndex] = {
        ...db.continueWatching[existingIndex],
        currentPosition,
        duration,
        progressPercentage,
        updatedAt: new Date().toISOString()
      };
    } else {
      const newItem: ContinueWatchingItem = {
        id: `cw-${Date.now()}`,
        profileId,
        mediaId,
        episodeId,
        seasonNumber,
        episodeNumber,
        currentPosition,
        duration,
        progressPercentage,
        updatedAt: new Date().toISOString()
      };
      db.continueWatching.unshift(newItem);
    }

    const existingHistory = db.watchHistory.find(h =>
      h.profileId === profileId && h.mediaId === mediaId && h.episodeId === episodeId
    );
    if (existingHistory) {
      existingHistory.watchedAt = new Date().toISOString();
    } else {
      db.watchHistory.unshift({
        id: `wh-${Date.now()}`,
        profileId,
        mediaId,
        episodeId,
        watchedAt: new Date().toISOString(),
        completed: false
      });
    }

    db.save();
    return res.json({ success: true, progressPercentage });
  },

  removeProgress: (req: Request, res: Response) => {
    const { profileId, mediaId } = req.params;
    const { episodeId } = req.query;

    const filtered = db.continueWatching.filter(c => {
      if (episodeId) {
        return !(c.profileId === profileId && c.mediaId === mediaId && c.episodeId === episodeId);
      }
      return !(c.profileId === profileId && c.mediaId === mediaId);
    });

    db.continueWatching.length = 0;
    db.continueWatching.push(...filtered);
    db.save();

    return res.json({ success: true, message: 'Removed from continue watching' });
  },

  getHistory: (req: Request, res: Response) => {
    const { profileId } = req.query;
    if (!profileId) {
      return res.status(400).json({ success: false, error: 'profileId is required' });
    }

    const items = db.watchHistory.filter(h => h.profileId === profileId);
    const populated = items.map(item => {
      const media = [...db.movies, ...db.shows].find(m => m.id === item.mediaId);
      return { ...item, media };
    }).filter(i => i.media !== undefined);

    return res.json({ success: true, data: populated });
  },

  clearHistory: (req: Request, res: Response) => {
    const { profileId } = req.params;

    const filtered = db.watchHistory.filter(h => h.profileId !== profileId);
    db.watchHistory.length = 0;
    db.watchHistory.push(...filtered);
    db.save();

    return res.json({ success: true, message: 'Watch history cleared' });
  }
};
