export type MediaType = 'movie' | 'tv';

export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'TV-14' | 'TV-MA' | 'R' | 'NC-17';

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  avatarUrl: string;
  bio?: string;
  born?: string;
}

export interface Director {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  src: string; // VTT url or inline data
  default?: boolean;
}

export interface AudioTrack {
  id: string;
  language: string;
  label: string;
  isOriginal?: boolean;
  channels?: string; // '5.1 Surround' | 'Stereo'
}

export interface Episode {
  id: string;
  showId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  runtime: number; // in minutes
  thumbnailUrl: string;
  videoUrl: string;
  introStart?: number; // seconds
  introEnd?: number; // seconds
  releaseDate: string;
}

export interface Season {
  id: string;
  showId: string;
  seasonNumber: number;
  title: string;
  releaseYear: number;
  episodeCount: number;
  episodes: Episode[];
  posterUrl?: string;
}

export interface BaseMedia {
  id: string;
  title: string;
  type: MediaType;
  tagline?: string;
  description: string;
  releaseYear: number;
  maturityRating: MaturityRating;
  isKidsSafe: boolean;
  rating: number; // e.g. 8.7 (out of 10)
  voteCount?: number;
  matchPercentage: number; // e.g. 98%
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  videoUrl: string;
  genres: string[]; // genre ids or names
  cast: CastMember[];
  directors: Director[];
  languages: string[];
  subtitles: SubtitleTrack[];
  audioTracks: AudioTrack[];
  isOriginal?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  isTopTen?: boolean;
  topTenRank?: number;
  isFeatured?: boolean;
  quality: '4K Ultra HD' | 'HD' | 'SD';
  audioQuality: 'Dolby Atmos' | '5.1' | 'Stereo';
  featuredTags?: string[];
  createdAt: string;
}

export interface Movie extends BaseMedia {
  type: 'movie';
  runtime: number; // in minutes
}

export interface TVShow extends BaseMedia {
  type: 'tv';
  seasonsCount: number;
  totalEpisodes: number;
  seasons: Season[];
}

export type MediaItem = Movie | TVShow;

export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  language: string;
  maturityLevel: MaturityRating;
  autoplayNextEpisode: boolean;
  autoplayPreviews: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  subscriptionPlanId: string;
  subscriptionStatus: 'active' | 'trial' | 'canceled' | 'past_due';
  nextBillingDate: string;
  status: 'active' | 'suspended';
  profiles: Profile[];
  createdAt: string;
  lastActive: string;
}

export interface ContinueWatchingItem {
  id: string;
  userId: string;
  profileId: string;
  mediaId: string;
  mediaType: MediaType;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  currentPosition: number; // in seconds
  duration: number; // in seconds
  progressPercentage: number; // 0 - 100
  lastWatchedAt: string;
  media: MediaItem;
}

export interface WatchHistoryItem {
  id: string;
  userId: string;
  profileId: string;
  mediaId: string;
  mediaType: MediaType;
  episodeId?: string;
  watchedAt: string;
  durationWatched: number; // in seconds
  completed: boolean;
  media: MediaItem;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  profileId: string;
  mediaId: string;
  mediaType: MediaType;
  addedAt: string;
  media: MediaItem;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'new_release' | 'continue_watching' | 'recommendation' | 'account' | 'system';
  mediaId?: string;
  mediaType?: MediaType;
  thumbnailUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium';
  priceMonthly: number;
  currency: string;
  videoQuality: string;
  resolution: string;
  supportedDevicesCount: number;
  spatialAudio: boolean;
  downloadsEnabled: boolean;
  features: string[];
}

export interface Device {
  id: string;
  name: string;
  type: 'tv' | 'mobile' | 'desktop' | 'tablet';
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SubtitleSettings {
  fontSize: 'small' | 'medium' | 'large';
  fontColor: 'white' | 'yellow' | 'cyan' | 'green';
  backgroundOpacity: 'transparent' | 'semi' | 'opaque';
}

export interface PlaybackSettings {
  defaultQuality: 'auto' | '1080p' | '4k' | '720p';
  autoplayNext: boolean;
  autoplayPreviews: boolean;
  defaultAudio: string;
  defaultSubtitle: string;
}

export interface UserSettings {
  playback: PlaybackSettings;
  subtitles: SubtitleSettings;
  notifications: {
    email: boolean;
    push: boolean;
    recommendations: boolean;
    newReleases: boolean;
  };
  privacy: {
    saveWatchHistory: boolean;
    personalizedRecommendations: boolean;
  };
  language: string;
}

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  userId?: string;
  profileId?: string;
  mediaId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SearchFilterState {
  query: string;
  type?: MediaType | 'all';
  genre?: string;
  year?: string;
  maturityRating?: string;
  sortBy?: 'popular' | 'rating' | 'newest' | 'az';
}
