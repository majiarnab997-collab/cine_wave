import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings, SubtitleSettings, PlaybackSettings } from '../types';
import { DEFAULT_USER_SETTINGS } from '../data/demoData';
import { storage } from '../services/storage';
import { Locale, i18nService } from '../services/i18nService';

const SETTINGS_KEY = 'user_settings';

interface SettingsContextType {
  settings: UserSettings;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  updatePlaybackSettings: (settings: Partial<PlaybackSettings>) => void;
  updateSubtitleSettings: (settings: Partial<SubtitleSettings>) => void;
  updateNotificationSettings: (settings: Partial<UserSettings['notifications']>) => void;
  updatePrivacySettings: (settings: Partial<UserSettings['privacy']>) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() =>
    storage.get<UserSettings>(SETTINGS_KEY, DEFAULT_USER_SETTINGS)
  );

  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = storage.get<UserSettings>(SETTINGS_KEY, DEFAULT_USER_SETTINGS);
    return (saved.language as Locale) || 'en';
  });

  useEffect(() => {
    storage.set(SETTINGS_KEY, settings);
  }, [settings]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setSettings(prev => ({ ...prev, language: newLocale }));
  };

  const updatePlaybackSettings = (updates: Partial<PlaybackSettings>) => {
    setSettings(prev => ({
      ...prev,
      playback: { ...prev.playback, ...updates }
    }));
  };

  const updateSubtitleSettings = (updates: Partial<SubtitleSettings>) => {
    setSettings(prev => ({
      ...prev,
      subtitles: { ...prev.subtitles, ...updates }
    }));
  };

  const updateNotificationSettings = (updates: Partial<UserSettings['notifications']>) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates }
    }));
  };

  const updatePrivacySettings = (updates: Partial<UserSettings['privacy']>) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...updates }
    }));
  };

  const t = (key: string, params?: Record<string, string>) => {
    return i18nService.translate(key, locale, params);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        locale,
        setLocale,
        updatePlaybackSettings,
        updateSubtitleSettings,
        updateNotificationSettings,
        updatePrivacySettings,
        t
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
