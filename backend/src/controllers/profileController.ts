import { Request, Response } from 'express';
import { db } from '../db';
import { Profile } from '../models';

export const profileController = {
  getProfiles: (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.json({ success: true, data: user.profiles });
  },

  createProfile: (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, avatarUrl, isKids, maturityLevel } = req.body;

    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.profiles.length >= 5) {
      return res.status(400).json({ success: false, error: 'Maximum limit of 5 profiles reached.' });
    }

    const newProfile: Profile = {
      id: `prof-${Date.now()}`,
      name: name || 'New Profile',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isKids: Boolean(isKids),
      language: 'en',
      maturityLevel: maturityLevel || (isKids ? 'PG' : 'R'),
      autoplayNext: true,
      autoplayPreviews: true
    };

    user.profiles.push(newProfile);
    db.save();
    db.logActivity('profile_created', { name: newProfile.name, isKids: newProfile.isKids }, user.id, newProfile.id);

    return res.status(201).json({ success: true, data: newProfile });
  },

  updateProfile: (req: Request, res: Response) => {
    const { userId, profileId } = req.params;
    const updates = req.body;

    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const profileIndex = user.profiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    user.profiles[profileIndex] = { ...user.profiles[profileIndex], ...updates };
    db.save();
    db.logActivity('profile_updated', { updates }, user.id, String(profileId));

    return res.json({ success: true, data: user.profiles[profileIndex] });
  },

  deleteProfile: (req: Request, res: Response) => {
    const { userId, profileId } = req.params;

    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.profiles.length <= 1) {
      return res.status(400).json({ success: false, error: 'Cannot delete the only remaining profile.' });
    }

    user.profiles = user.profiles.filter(p => p.id !== profileId);
    const remainingWl = db.watchlist.filter(w => w.profileId !== profileId);
    const remainingCw = db.continueWatching.filter(c => c.profileId !== profileId);
    const remainingWh = db.watchHistory.filter(h => h.profileId !== profileId);

    db.watchlist.length = 0;
    db.watchlist.push(...remainingWl);

    db.continueWatching.length = 0;
    db.continueWatching.push(...remainingCw);

    db.watchHistory.length = 0;
    db.watchHistory.push(...remainingWh);

    db.save();
    db.logActivity('profile_deleted', { profileId: String(profileId) }, user.id, String(profileId));

    return res.json({ success: true, message: 'Profile removed.' });
  }
};
