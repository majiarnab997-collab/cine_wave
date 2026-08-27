import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContinueWatchingItem, MediaItem } from '../types';
import { playbackService } from '../services/playbackService';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { analyticsService } from '../services/analyticsService';

interface PlaybackContextType {
  continueWatching: ContinueWatchingItem[];
  getResumePosition: (mediaId: string, episodeId?: string) => number;
  updateProgress: (
    media: MediaItem,
    currentPosition: number,
    duration: number,
    episodeData?: { episodeId: string; seasonNumber: number; episodeNumber: number }
  ) => void;
  removeProgress: (mediaId: string, episodeId?: string) => void;
  refreshPlayback: () => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { activeProfile } = useProfile();
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);

  const loadPlayback = () => {
    if (activeProfile) {
      const items = playbackService.getContinueWatching(activeProfile.id);
      setContinueWatching(items);
    } else {
      setContinueWatching([]);
    }
  };

  useEffect(() => {
    loadPlayback();
  }, [activeProfile?.id]);

  const getResumePosition = (mediaId: string, episodeId?: string): number => {
    if (!activeProfile) return 0;
    return playbackService.getPlaybackPosition(activeProfile.id, mediaId, episodeId);
  };

  const updateProgress = (
    media: MediaItem,
    currentPosition: number,
    duration: number,
    episodeData?: { episodeId: string; seasonNumber: number; episodeNumber: number }
  ) => {
    if (!user || !activeProfile) return;
    playbackService.saveProgress(user.id, activeProfile.id, media, currentPosition, duration, episodeData);
    loadPlayback();
  };

  const removeProgress = (mediaId: string, episodeId?: string) => {
    if (!activeProfile) return;
    playbackService.removeFromContinueWatching(activeProfile.id, mediaId, episodeId);
    loadPlayback();
    analyticsService.track('continue_watching_removed', { mediaId, episodeId }, user?.id, activeProfile.id);
  };

  return (
    <PlaybackContext.Provider
      value={{
        continueWatching,
        getResumePosition,
        updateProgress,
        removeProgress,
        refreshPlayback: loadPlayback
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = (): PlaybackContextType => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};
