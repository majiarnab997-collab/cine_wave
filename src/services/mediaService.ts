import { Movie, TVShow, MediaItem, SearchFilterState } from '../types';
import { MOVIES } from '../data/movies';
import { TV_SHOWS } from '../data/tvShows';
import { storage } from './storage';

const MOVIES_STORAGE_KEY = 'media_movies';
const TVSHOWS_STORAGE_KEY = 'media_tvshows';

function initMediaStorage() {
  if (!storage.get<Movie[] | null>(MOVIES_STORAGE_KEY, null)) {
    storage.set(MOVIES_STORAGE_KEY, MOVIES);
  }
  if (!storage.get<TVShow[] | null>(TVSHOWS_STORAGE_KEY, null)) {
    storage.set(TVSHOWS_STORAGE_KEY, TV_SHOWS);
  }
}

initMediaStorage();

export const mediaService = {
  getMovies(): Movie[] {
    return storage.get<Movie[]>(MOVIES_STORAGE_KEY, MOVIES);
  },

  getTVShows(): TVShow[] {
    return storage.get<TVShow[]>(TVSHOWS_STORAGE_KEY, TV_SHOWS);
  },

  getAllMedia(): MediaItem[] {
    const movies = this.getMovies();
    const shows = this.getTVShows();
    return [...movies, ...shows];
  },

  getMediaById(id: string): MediaItem | undefined {
    return this.getAllMedia().find(item => item.id === id);
  },

  getFeatured(isKids = false): MediaItem[] {
    const all = this.getAllMedia();
    const filtered = isKids ? all.filter(m => m.isKidsSafe) : all;
    const featured = filtered.filter(m => m.isFeatured);
    return featured.length > 0 ? featured : filtered.slice(0, 5);
  },

  getTrending(isKids = false): MediaItem[] {
    const all = this.getAllMedia();
    const filtered = isKids ? all.filter(m => m.isKidsSafe) : all;
    return filtered.filter(m => m.isTrending || m.rating >= 8.8);
  },

  getPopular(isKids = false): MediaItem[] {
    const all = this.getAllMedia();
    const filtered = isKids ? all.filter(m => m.isKidsSafe) : all;
    return filtered.filter(m => m.isPopular || (m.voteCount && m.voteCount > 20000));
  },

  getTopTen(isKids = false): MediaItem[] {
    const all = this.getAllMedia();
    const filtered = isKids ? all.filter(m => m.isKidsSafe) : all;
    return filtered
      .filter(m => m.isTopTen)
      .sort((a, b) => (a.topTenRank || 99) - (b.topTenRank || 99))
      .slice(0, 10);
  },

  getByGenre(genreSlug: string, isKids = false): MediaItem[] {
    const all = this.getAllMedia();
    const filtered = isKids ? all.filter(m => m.isKidsSafe) : all;
    return filtered.filter(m => m.genres.includes(genreSlug));
  },

  getSimilar(item: MediaItem, isKids = false): MediaItem[] {
    const all = this.getAllMedia().filter(m => m.id !== item.id);
    const filtered = isKids ? all.filter(m => m.isKidsSafe) : all;

    return filtered
      .map(m => {
        // Calculate similarity score based on overlapping genres and same directors/cast
        let score = 0;
        const sharedGenres = m.genres.filter(g => item.genres.includes(g)).length;
        score += sharedGenres * 3;
        if (m.type === item.type) score += 2;
        if (Math.abs(m.rating - item.rating) < 0.5) score += 1;
        return { item: m, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(entry => entry.item);
  },

  search(filters: SearchFilterState, isKids = false): MediaItem[] {
    let list = this.getAllMedia();
    if (isKids) {
      list = list.filter(m => m.isKidsSafe);
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(q);
        const descMatch = m.description.toLowerCase().includes(q);
        const genreMatch = m.genres.some(g => g.toLowerCase().includes(q));
        const castMatch = m.cast.some(c => c.name.toLowerCase().includes(q) || c.character.toLowerCase().includes(q));
        const directorMatch = m.directors.some(d => d.name.toLowerCase().includes(q));
        return titleMatch || descMatch || genreMatch || castMatch || directorMatch;
      });
    }

    if (filters.type && filters.type !== 'all') {
      list = list.filter(m => m.type === filters.type);
    }

    if (filters.genre && filters.genre !== 'all') {
      list = list.filter(m => m.genres.includes(filters.genre!));
    }

    if (filters.year && filters.year !== 'all') {
      const yr = parseInt(filters.year, 10);
      list = list.filter(m => m.releaseYear === yr);
    }

    if (filters.maturityRating && filters.maturityRating !== 'all') {
      list = list.filter(m => m.maturityRating === filters.maturityRating);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'az':
          list.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'popular':
        default:
          list.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
          break;
      }
    }

    return list;
  },

  // Admin Mutations
  saveMovie(movie: Movie): void {
    const movies = this.getMovies();
    const index = movies.findIndex(m => m.id === movie.id);
    if (index >= 0) {
      movies[index] = movie;
    } else {
      movies.unshift(movie);
    }
    storage.set(MOVIES_STORAGE_KEY, movies);
  },

  deleteMovie(id: string): void {
    const movies = this.getMovies().filter(m => m.id !== id);
    storage.set(MOVIES_STORAGE_KEY, movies);
  },

  saveTVShow(show: TVShow): void {
    const shows = this.getTVShows();
    const index = shows.findIndex(s => s.id === show.id);
    if (index >= 0) {
      shows[index] = show;
    } else {
      shows.unshift(show);
    }
    storage.set(TVSHOWS_STORAGE_KEY, shows);
  },

  deleteTVShow(id: string): void {
    const shows = this.getTVShows().filter(s => s.id !== id);
    storage.set(TVSHOWS_STORAGE_KEY, shows);
  }
};
