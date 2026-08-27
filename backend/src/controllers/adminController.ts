import { Request, Response } from 'express';
import { db } from '../db';
import { Movie, TVShow } from '../models';

export const adminController = {
  getMetrics: (_req: Request, res: Response) => {
    const totalUsers = db.users.length;
    const activeToday = Math.floor(totalUsers * 0.72) + 12;
    const totalMovies = db.movies.length;
    const totalTVShows = db.shows.length;
    const totalEpisodes = db.shows.reduce((acc, s) => acc + s.totalEpisodes, 0);
    const totalWatchHours = 142850 + db.watchHistory.length * 1.5;
    const monthlyRevenue = db.users.reduce((acc, u) => {
      const plan = db.plans.find(p => p.id === u.subscriptionPlanId);
      return acc + (plan ? plan.priceMonthly : 12.99);
    }, 0);

    return res.json({
      success: true,
      data: {
        totalUsers,
        activeToday,
        totalMovies,
        totalTVShows,
        totalEpisodes,
        totalWatchHours: Math.round(totalWatchHours),
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        activeStreamsCount: 42
      }
    });
  },

  getTraffic: (_req: Request, res: Response) => {
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const trafficData = hours.map((hour, idx) => ({
      timestamp: hour,
      concurrentStreams: 300 + idx * 80 + Math.floor(Math.random() * 50),
      bandwidthGbps: 1.2 + idx * 0.35 + Math.random() * 0.2
    }));
    return res.json({ success: true, data: trafficData });
  },

  getPopular: (_req: Request, res: Response) => {
    const all = [...db.movies, ...db.shows];
    all.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    const top = all.slice(0, 5).map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      viewsCount: (item.voteCount || 0) * 14 + 520,
      totalHours: Math.round((item.voteCount || 0) * 2.2),
      rating: item.rating
    }));
    return res.json({ success: true, data: top });
  },

  getUsers: (_req: Request, res: Response) => {
    return res.json({ success: true, data: db.users });
  },

  toggleUserSuspension: (req: Request, res: Response) => {
    const { id } = req.params;
    const user = db.users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isSuspended = !user.isSuspended;
    db.save();
    db.logActivity('user_status_toggled', { userId: id, isSuspended: user.isSuspended });

    return res.json({ success: true, data: user });
  },

  deleteUser: (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = db.users.length;
    const filtered = db.users.filter(u => u.id !== id);

    if (filtered.length !== initialLen) {
      db.users.length = 0;
      db.users.push(...filtered);
      db.save();
      db.logActivity('user_deleted', { userId: id });
    }

    return res.json({ success: true, message: 'User account removed' });
  },

  saveMovie: (req: Request, res: Response) => {
    const movieData: Movie = req.body;
    if (!movieData.title) {
      return res.status(400).json({ success: false, error: 'Movie title is required' });
    }

    if (!movieData.id) {
      movieData.id = `mov-${Date.now()}`;
      movieData.createdAt = new Date().toISOString();
      movieData.updatedAt = new Date().toISOString();
      db.movies.unshift(movieData);
    } else {
      const idx = db.movies.findIndex(m => m.id === movieData.id);
      if (idx !== -1) {
        movieData.updatedAt = new Date().toISOString();
        db.movies[idx] = { ...db.movies[idx], ...movieData };
      } else {
        db.movies.unshift(movieData);
      }
    }

    db.save();
    db.logActivity('movie_saved', { id: movieData.id, title: movieData.title });
    return res.json({ success: true, data: movieData });
  },

  deleteMovie: (req: Request, res: Response) => {
    const { id } = req.params;
    const filtered = db.movies.filter(m => m.id !== id);
    db.movies.length = 0;
    db.movies.push(...filtered);
    db.save();
    db.logActivity('movie_deleted', { id });
    return res.json({ success: true, message: 'Movie deleted' });
  },

  saveShow: (req: Request, res: Response) => {
    const showData: TVShow = req.body;
    if (!showData.title) {
      return res.status(400).json({ success: false, error: 'Show title is required' });
    }

    if (!showData.id) {
      showData.id = `tv-${Date.now()}`;
      showData.createdAt = new Date().toISOString();
      showData.updatedAt = new Date().toISOString();
      db.shows.unshift(showData);
    } else {
      const idx = db.shows.findIndex(s => s.id === showData.id);
      if (idx !== -1) {
        showData.updatedAt = new Date().toISOString();
        db.shows[idx] = { ...db.shows[idx], ...showData };
      } else {
        db.shows.unshift(showData);
      }
    }

    db.save();
    db.logActivity('show_saved', { id: showData.id, title: showData.title });
    return res.json({ success: true, data: showData });
  },

  deleteShow: (req: Request, res: Response) => {
    const { id } = req.params;
    const filtered = db.shows.filter(s => s.id !== id);
    db.shows.length = 0;
    db.shows.push(...filtered);
    db.save();
    db.logActivity('show_deleted', { id });
    return res.json({ success: true, message: 'TV show deleted' });
  },

  getActivityLogs: (_req: Request, res: Response) => {
    return res.json({ success: true, data: db.activityLogs });
  }
};
