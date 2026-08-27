export type MediaType = 'movie' | 'tv';

export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'TV-14' | 'TV-MA' | 'R' | 'NC-17';

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  backdropUrl?: string;
  iconName?: string;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  avatarUrl: string;
  biography?: string;
}

export interface Director {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  runtime: number; // minutes
  thumbnailUrl: string;
  videoUrl: string;
  releaseDate?: string;
  introStart?: number;
  introEnd?: number;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  description?: string;
  posterUrl?: string;
  episodes: Episode[];
}

export interface BaseMedia {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  posterUrl: string;
  backdropUrl: string;
  logoUrl?: string;
  releaseYear: number;
  rating: number;
  voteCount?: number;
  maturityRating: MaturityRating;
  isOriginal?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isKidsSafe?: boolean;
  genres: string[];
  cast: CastMember[];
  directors: Director[];
  audioQuality: string;
  quality: string;
  matchPercentage: number;
  tags?: string[];
  trailerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie extends BaseMedia {
  type: 'movie';
  runtime: number;
  videoUrl: string;
}

export interface TVShow extends BaseMedia {
  type: 'tv';
  seasonsCount: number;
  totalEpisodes: number;
  seasons: Season[];
  videoUrl?: string;
}

export type MediaItem = Movie | TVShow;

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  language: string;
  maturityLevel: MaturityRating;
  autoplayNext: boolean;
  autoplayPreviews: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  subscriptionPlanId: string;
  subscriptionStatus: 'active' | 'trial' | 'cancelled' | 'expired';
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  isSuspended?: boolean;
  profiles: Profile[];
  createdAt: string;
}

export interface ContinueWatchingItem {
  id: string;
  profileId: string;
  mediaId: string;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  currentPosition: number;
  duration: number;
  progressPercentage: number;
  updatedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  profileId: string;
  mediaId: string;
  episodeId?: string;
  watchedAt: string;
  completed: boolean;
}

export interface WatchlistItem {
  id: string;
  profileId: string;
  mediaId: string;
  addedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  resolution: string;
  videoQuality: string;
  supportedDevicesCount: number;
  features: string[];
  isPopular?: boolean;
}
