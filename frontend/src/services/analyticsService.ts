import { AnalyticsEvent } from '../types';
import { storage } from './storage';

const ANALYTICS_KEY = 'analytics_events';

export const analyticsService = {
  getEvents(): AnalyticsEvent[] {
    return storage.get<AnalyticsEvent[]>(ANALYTICS_KEY, []);
  },

  track(eventName: string, metadata?: Record<string, unknown>, userId?: string, profileId?: string, mediaId?: string): void {
    const events = this.getEvents();
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      eventName,
      userId,
      profileId,
      mediaId,
      timestamp: new Date().toISOString(),
      metadata
    };

    events.unshift(newEvent);
    // Keep max 200 events in client storage
    storage.set(ANALYTICS_KEY, events.slice(0, 200));

    // Optional console telemetry in dev
    if (import.meta.env.DEV) {
      console.log(`[CineWave Analytics] ${eventName}:`, newEvent);
    }
  },

  clearEvents(): void {
    storage.set(ANALYTICS_KEY, []);
  }
};
