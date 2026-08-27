import { Request, Response } from 'express';
import { db } from '../db';
import { WatchlistItem } from '../models';

export const watchlistController = {
  getWatchlist: (req: Request, res: Response) => {
    const { profileId } = req.query;
    if (!profileId) {
      return res.status(400).json({ success: false, error: 'profileId is required' });
    }

    const items = db.watchlist.filter(w => w.profileId === profileId);
    const populated = items.map(item => {
      const media = [...db.movies, ...db.shows].find(m => m.id === item.mediaId);
      return { ...item, media };
    }).filter(i => i.media !== undefined);

    return res.json({ success: true, data: populated });
  },

  addToWatchlist: (req: Request, res: Response) => {
    const { profileId, mediaId } = req.body;
    if (!profileId || !mediaId) {
      return res.status(400).json({ success: false, error: 'profileId and mediaId are required' });
    }

    const existing = db.watchlist.find(w => w.profileId === profileId && w.mediaId === mediaId);
    if (existing) {
      return res.json({ success: true, data: existing });
    }

    const newItem: WatchlistItem = {
      id: `wl-${Date.now()}`,
      profileId,
      mediaId,
      addedAt: new Date().toISOString()
    };

    db.watchlist.push(newItem);
    db.save();
    db.logActivity('watchlist_add', { mediaId }, undefined, profileId, mediaId);

    const media = [...db.movies, ...db.shows].find(m => m.id === mediaId);
    return res.status(201).json({ success: true, data: { ...newItem, media } });
  },

  removeFromWatchlist: (req: Request, res: Response) => {
    const { profileId, mediaId } = req.params;

    const initialLen = db.watchlist.length;
    const filtered = db.watchlist.filter(w => !(w.profileId === profileId && w.mediaId === mediaId));

    if (filtered.length !== initialLen) {
      db.watchlist.length = 0;
      db.watchlist.push(...filtered);
      db.save();
      db.logActivity('watchlist_remove', { mediaId: String(mediaId) }, undefined, String(profileId), String(mediaId));
    }

    return res.json({ success: true, message: 'Removed from watchlist' });
  }
};
