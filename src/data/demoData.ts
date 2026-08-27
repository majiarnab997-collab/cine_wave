import { User, SubscriptionPlan, Notification, Device, UserSettings } from '../types';
import { MOVIES } from './movies';
import { TV_SHOWS } from './tvShows';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic HD',
    tier: 'basic',
    priceMonthly: 8.99,
    currency: '$',
    videoQuality: 'Good',
    resolution: '720p HD',
    supportedDevicesCount: 1,
    spatialAudio: false,
    downloadsEnabled: true,
    features: ['Unlimited movies & TV shows', 'Watch on 1 supported device at a time', 'HD 720p stream', 'Download on 1 device']
  },
  {
    id: 'plan-standard',
    name: 'Standard Full HD',
    tier: 'standard',
    priceMonthly: 13.99,
    currency: '$',
    videoQuality: 'Better',
    resolution: '1080p Full HD',
    supportedDevicesCount: 2,
    spatialAudio: false,
    downloadsEnabled: true,
    features: ['Unlimited movies & TV shows', 'Watch on 2 supported devices at a time', 'Full HD 1080p stream', 'Download on 2 devices']
  },
  {
    id: 'plan-premium',
    name: 'Premium 4K Ultra HD',
    tier: 'premium',
    priceMonthly: 19.99,
    currency: '$',
    videoQuality: 'Best',
    resolution: '4K Ultra HD + HDR',
    supportedDevicesCount: 4,
    spatialAudio: true,
    downloadsEnabled: true,
    features: ['Unlimited movies & TV shows', 'Watch on 4 supported devices simultaneously', '4K Ultra HD + Dolby Atmos', 'Download on 6 devices', 'Spatial audio included']
  }
];

export const DEMO_DEVICES: Device[] = [
  {
    id: 'dev-1',
    name: 'Living Room OLED 4K TV',
    type: 'tv',
    browser: 'CineWave Smart TV App v4.2',
    location: 'San Francisco, CA',
    lastActive: '2 minutes ago',
    isCurrent: false
  },
  {
    id: 'dev-2',
    name: 'MacBook Pro 16" (Current Device)',
    type: 'desktop',
    browser: 'Chrome 124.0.0 macOS',
    location: 'San Francisco, CA',
    lastActive: 'Active Now',
    isCurrent: true
  },
  {
    id: 'dev-3',
    name: 'iPhone 15 Pro Max',
    type: 'mobile',
    browser: 'CineWave iOS App v5.1',
    location: 'San Francisco, CA',
    lastActive: '3 hours ago',
    isCurrent: false
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    email: 'alex@cinewave.tv',
    name: 'Alex Vance',
    role: 'user',
    subscriptionPlanId: 'plan-premium',
    subscriptionStatus: 'active',
    nextBillingDate: '2026-09-28',
    status: 'active',
    createdAt: '2025-06-15T10:00:00Z',
    lastActive: 'Just now',
    profiles: [
      {
        id: 'prof-alex',
        userId: 'user-1',
        name: 'Alex',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        isKids: false,
        language: 'en',
        maturityLevel: 'TV-MA',
        autoplayNextEpisode: true,
        autoplayPreviews: true,
        createdAt: '2025-06-15T10:05:00Z'
      },
      {
        id: 'prof-sam',
        userId: 'user-1',
        name: 'Sam',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        isKids: false,
        language: 'en',
        maturityLevel: 'TV-14',
        autoplayNextEpisode: true,
        autoplayPreviews: true,
        createdAt: '2025-07-01T12:00:00Z'
      },
      {
        id: 'prof-kids',
        userId: 'user-1',
        name: 'Kids Club',
        avatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80',
        isKids: true,
        language: 'en',
        maturityLevel: 'G',
        autoplayNextEpisode: true,
        autoplayPreviews: false,
        createdAt: '2025-07-15T09:30:00Z'
      }
    ]
  },
  {
    id: 'user-admin',
    email: 'admin@cinewave.tv',
    name: 'CineWave Administrator',
    role: 'admin',
    subscriptionPlanId: 'plan-premium',
    subscriptionStatus: 'active',
    nextBillingDate: '2027-01-01',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastActive: 'Just now',
    profiles: [
      {
        id: 'prof-admin',
        userId: 'user-admin',
        name: 'Admin Station',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        isKids: false,
        language: 'en',
        maturityLevel: 'TV-MA',
        autoplayNextEpisode: true,
        autoplayPreviews: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Season 2 Finale Premiere',
    message: 'Nexus: Parallel Earths Episode 8 is now streaming in 4K Ultra HD with Dolby Atmos.',
    type: 'new_release',
    mediaId: 'show-1',
    mediaType: 'tv',
    thumbnailUrl: MOVIES[0].backdropUrl,
    read: false,
    createdAt: '15 minutes ago'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Continue Watching',
    message: 'You have 45 minutes left in Neon Odyssey: 2099. Resume now?',
    type: 'continue_watching',
    mediaId: 'mov-1',
    mediaType: 'movie',
    thumbnailUrl: MOVIES[0].posterUrl,
    read: false,
    createdAt: '2 hours ago'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: 'Recommended For You',
    message: 'Because you watched Solaris Drift, you might love The Alchemist of Prague.',
    type: 'recommendation',
    mediaId: 'mov-6',
    mediaType: 'movie',
    thumbnailUrl: MOVIES[5].posterUrl,
    read: true,
    createdAt: '1 day ago'
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    title: 'Account Security Notice',
    message: 'New sign-in detected on Chrome macOS from San Francisco, CA.',
    type: 'account',
    read: true,
    createdAt: '3 days ago'
  }
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  playback: {
    defaultQuality: 'auto',
    autoplayNext: true,
    autoplayPreviews: true,
    defaultAudio: 'en',
    defaultSubtitle: 'en'
  },
  subtitles: {
    fontSize: 'medium',
    fontColor: 'white',
    backgroundOpacity: 'semi'
  },
  notifications: {
    email: true,
    push: true,
    recommendations: true,
    newReleases: true
  },
  privacy: {
    saveWatchHistory: true,
    personalizedRecommendations: true
  },
  language: 'en'
};
