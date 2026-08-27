import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '../types';
import { profileService } from '../services/profileService';
import { useAuth } from './AuthContext';
import { analyticsService } from '../services/analyticsService';

interface ProfileContextType {
  activeProfile: Profile | null;
  isKidsMode: boolean;
  profiles: Profile[];
  setActiveProfile: (profile: Profile) => void;
  addProfile: (data: { name: string; avatarUrl: string; isKids: boolean; maturityLevel?: string }) => Profile | null;
  updateProfile: (profile: Profile) => void;
  deleteProfile: (profileId: string) => boolean;
  refreshProfiles: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(() => profileService.getActiveProfile());

  const profiles = user?.profiles || [];

  useEffect(() => {
    if (user) {
      const active = profileService.getActiveProfile();
      setActiveProfileState(active);
    } else {
      setActiveProfileState(null);
    }
  }, [user]);

  const setActiveProfile = (profile: Profile) => {
    profileService.setActiveProfile(profile.id);
    setActiveProfileState(profile);
    analyticsService.track('profile_switched', { isKids: profile.isKids }, user?.id, profile.id);
  };

  const addProfile = (data: { name: string; avatarUrl: string; isKids: boolean; maturityLevel?: string }) => {
    const created = profileService.addProfile(data);
    if (created) {
      refreshUser();
      analyticsService.track('profile_created', { isKids: data.isKids }, user?.id, created.id);
    }
    return created;
  };

  const updateProfile = (profile: Profile) => {
    profileService.updateProfile(profile);
    if (activeProfile?.id === profile.id) {
      setActiveProfileState(profile);
    }
    refreshUser();
  };

  const deleteProfile = (profileId: string) => {
    const ok = profileService.deleteProfile(profileId);
    if (ok) {
      refreshUser();
      const nextActive = profileService.getActiveProfile();
      setActiveProfileState(nextActive);
    }
    return ok;
  };

  const refreshProfiles = () => {
    refreshUser();
    const active = profileService.getActiveProfile();
    setActiveProfileState(active);
  };

  return (
    <ProfileContext.Provider
      value={{
        activeProfile,
        isKidsMode: Boolean(activeProfile?.isKids),
        profiles,
        setActiveProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        refreshProfiles
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
