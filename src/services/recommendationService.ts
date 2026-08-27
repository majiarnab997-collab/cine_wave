import { MediaItem } from '../types';
import { mediaService } from './mediaService';
import { historyService } from './historyService';
import { playbackService } from './playbackService';

export interface RecommendationSection {
  id: string;
  title: string;
  reason?: string;
  items: MediaItem[];
}

export const recommendationService = {
  getPersonalizedRecommendations(profileId: string, isKids = false): RecommendationSection[] {
    const history = historyService.getHistory(profileId);
    const continueWatching = playbackService.getContinueWatching(profileId);
    const allMedia = mediaService.getAllMedia();
    const availableMedia = isKids ? allMedia.filter(m => m.isKidsSafe) : allMedia;

    const sections: RecommendationSection[] = [];

    // 1. "Top Picks for You" - highest rating & match %
    const topPicks = [...availableMedia]
      .sort((a, b) => b.matchPercentage - a.matchPercentage || b.rating - a.rating)
      .slice(0, 10);

    sections.push({
      id: 'top-picks',
      title: 'Top Picks For You',
      reason: 'Based on your viewing taste',
      items: topPicks
    });

    // 2. "Because you watched [Title]"
    const lastWatched = continueWatching[0]?.media || history[0]?.media;
    if (lastWatched) {
      const similar = mediaService.getSimilar(lastWatched, isKids);
      if (similar.length > 0) {
        sections.push({
          id: `because-${lastWatched.id}`,
          title: `Because You Watched ${lastWatched.title}`,
          reason: `Fans of ${lastWatched.genres.join(', ')} also love these`,
          items: similar
        });
      }
    }

    // 3. Genre-specific recommendations (e.g. Sci-Fi or Action or Family)
    const genreToHighlight = isKids ? 'family' : 'sci-fi';
    const genreItems = mediaService.getByGenre(genreToHighlight, isKids);
    if (genreItems.length > 0) {
      sections.push({
        id: `genre-${genreToHighlight}`,
        title: isKids ? 'Magical Family Adventures' : 'Futuristic Sci-Fi & Cyberpunk Hits',
        items: genreItems
      });
    }

    // 4. "Critically Acclaimed Cinema"
    const acclaimed = availableMedia.filter(m => m.rating >= 8.8);
    if (acclaimed.length > 0) {
      sections.push({
        id: 'critically-acclaimed',
        title: 'Critically Acclaimed Cinema & Masterpieces',
        reason: 'Rated 8.8+ by global critics',
        items: acclaimed
      });
    }

    return sections;
  }
};
