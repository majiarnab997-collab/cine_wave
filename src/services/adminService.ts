import { mediaService } from './mediaService';
import { authService } from './authService';
import { User, Movie, TVShow } from '../types';

export interface AdminMetrics {
  totalUsers: number;
  activeToday: number;
  totalMovies: number;
  totalTVShows: number;
  totalEpisodes: number;
  totalWatchHours: number;
  monthlyRevenue: number;
  storageUsedGB: number;
}

export interface StreamChartDataPoint {
  day: string;
  views: number;
  watchHours: number;
}

export interface PopularTitleStats {
  title: string;
  views: number;
  rating: number;
  completionRate: number;
}

export const adminService = {
  getMetrics(): AdminMetrics {
    const users = authService.getUsers();
    const movies = mediaService.getMovies();
    const shows = mediaService.getTVShows();
    const totalEpisodes = shows.reduce((acc, s) => acc + s.totalEpisodes, 0);

    return {
      totalUsers: users.length * 1420 + 8420, // Real + mock scaler
      activeToday: Math.round((users.length * 1420 + 8420) * 0.42),
      totalMovies: movies.length,
      totalTVShows: shows.length,
      totalEpisodes,
      totalWatchHours: 148920,
      monthlyRevenue: 184500,
      storageUsedGB: 4120
    };
  },

  getTrafficChart(): StreamChartDataPoint[] {
    return [
      { day: 'Mon', views: 42000, watchHours: 24100 },
      { day: 'Tue', views: 46500, watchHours: 28400 },
      { day: 'Wed', views: 51200, watchHours: 31000 },
      { day: 'Thu', views: 58900, watchHours: 36200 },
      { day: 'Fri', views: 74200, watchHours: 48900 },
      { day: 'Sat', views: 92400, watchHours: 64200 },
      { day: 'Sun', views: 88100, watchHours: 59800 }
    ];
  },

  getPopularContentStats(): PopularTitleStats[] {
    return [
      { title: 'Neon Odyssey: 2099', views: 184200, rating: 9.1, completionRate: 88 },
      { title: 'Nexus: Parallel Earths', views: 162900, rating: 9.2, completionRate: 92 },
      { title: 'Solaris Drift', views: 141000, rating: 8.8, completionRate: 84 },
      { title: 'Chronicles of Valoria', views: 139500, rating: 9.4, completionRate: 95 },
      { title: 'The Forest Whisperer', views: 112400, rating: 8.9, completionRate: 89 }
    ];
  },

  getUsers(): User[] {
    return authService.getUsers();
  },

  toggleUserSuspension(userId: string): User | null {
    const users = authService.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'suspended' : 'active';
      authService.updateUser(user);
      return user;
    }
    return null;
  },

  deleteUser(userId: string): boolean {
    const users = authService.getUsers();
    if (users.length <= 1) return false;
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem('cinewave_auth_users', JSON.stringify(filtered));
    return true;
  },

  // Content Operations
  saveMovie(movie: Movie): void {
    mediaService.saveMovie(movie);
  },

  deleteMovie(id: string): void {
    mediaService.deleteMovie(id);
  },

  saveTVShow(show: TVShow): void {
    mediaService.saveTVShow(show);
  },

  deleteTVShow(id: string): void {
    mediaService.deleteTVShow(id);
  }
};
