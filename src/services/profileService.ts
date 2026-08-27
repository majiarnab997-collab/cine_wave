import { Profile } from '../types';
import { authService } from './authService';
import { storage } from './storage';

const ACTIVE_PROFILE_KEY = 'active_profile_id';

export const profileService = {
  getActiveProfile(): Profile {
    const user = authService.getCurrentUser();
    if (!user || user.profiles.length === 0) {
      // Fallback dummy profile
      return {
        id: 'prof-guest',
        userId: 'guest',
        name: 'Guest',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        isKids: false,
        language: 'en',
        maturityLevel: 'TV-MA',
        autoplayNextEpisode: true,
        autoplayPreviews: true,
        createdAt: new Date().toISOString()
      };
    }

    const savedProfileId = storage.get<string | null>(ACTIVE_PROFILE_KEY, null);
    if (savedProfileId) {
      const found = user.profiles.find(p => p.id === savedProfileId);
      if (found) return found;
    }

    // Default to first profile
    const defaultProfile = user.profiles[0];
    storage.set(ACTIVE_PROFILE_KEY, defaultProfile.id);
    return defaultProfile;
  },

  setActiveProfile(profileId: string): Profile | null {
    const user = authService.getCurrentUser();
    if (!user) return null;
    const found = user.profiles.find(p => p.id === profileId);
    if (found) {
      storage.set(ACTIVE_PROFILE_KEY, found.id);
      return found;
    }
    return null;
  },

  addProfile(data: { name: string; avatarUrl: string; isKids: boolean; maturityLevel?: string }): Profile | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const newProfile: Profile = {
      id: `prof-${Date.now()}`,
      userId: user.id,
      name: data.name.trim(),
      avatarUrl: data.avatarUrl,
      isKids: data.isKids,
      language: 'en',
      maturityLevel: data.isKids ? 'G' : (data.maturityLevel as any || 'TV-MA'),
      autoplayNextEpisode: true,
      autoplayPreviews: !data.isKids,
      createdAt: new Date().toISOString()
    };

    user.profiles.push(newProfile);
    authService.updateUser(user);
    return newProfile;
  },

  updateProfile(profile: Profile): void {
    const user = authService.getCurrentUser();
    if (!user) return;

    const idx = user.profiles.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      user.profiles[idx] = profile;
      authService.updateUser(user);
    }
  },

  deleteProfile(profileId: string): boolean {
    const user = authService.getCurrentUser();
    if (!user || user.profiles.length <= 1) return false; // Must keep at least 1 profile

    user.profiles = user.profiles.filter(p => p.id !== profileId);
    authService.updateUser(user);

    const activeId = storage.get<string | null>(ACTIVE_PROFILE_KEY, null);
    if (activeId === profileId) {
      storage.set(ACTIVE_PROFILE_KEY, user.profiles[0].id);
    }
    return true;
  }
};
