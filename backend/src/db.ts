import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Movie,
  TVShow,
  User,
  SubscriptionPlan,
  Genre,
  ContinueWatchingItem,
  WatchHistoryItem,
  WatchlistItem
} from './models';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DatabaseSchema {
  movies: Movie[];
  shows: TVShow[];
  users: User[];
  plans: SubscriptionPlan[];
  genres: Genre[];
  continueWatching: ContinueWatchingItem[];
  watchHistory: WatchHistoryItem[];
  watchlist: WatchlistItem[];
  activityLogs: Array<{
    id: string;
    event: string;
    userId?: string;
    profileId?: string;
    mediaId?: string;
    details?: any;
    timestamp: string;
  }>;
}

class Database {
  private data: DatabaseSchema;
  private filePath: string;

  constructor() {
    const possiblePaths = [
      path.resolve(process.cwd(), 'database', 'store.json'),
      path.resolve(process.cwd(), '..', 'database', 'store.json'),
      path.resolve(__dirname, '..', '..', 'database', 'store.json')
    ];

    let resolvedPath = possiblePaths[0];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        resolvedPath = p;
        break;
      }
    }
    this.filePath = resolvedPath;

    if (!fs.existsSync(path.dirname(this.filePath))) {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading database, initializing empty store.', err);
        this.data = this.getEmptyStore();
        this.save();
      }
    } else {
      this.data = this.getEmptyStore();
      this.save();
    }
  }

  private getEmptyStore(): DatabaseSchema {
    return {
      movies: [],
      shows: [],
      users: [],
      plans: [],
      genres: [],
      continueWatching: [],
      watchHistory: [],
      watchlist: [],
      activityLogs: []
    };
  }

  public save(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save store.json:', err);
    }
  }

  public get movies() { return this.data.movies; }
  public get shows() { return this.data.shows; }
  public get users() { return this.data.users; }
  public get plans() { return this.data.plans; }
  public get genres() { return this.data.genres; }
  public get continueWatching() { return this.data.continueWatching; }
  public get watchHistory() { return this.data.watchHistory; }
  public get watchlist() { return this.data.watchlist; }
  public get activityLogs() { return this.data.activityLogs; }

  public logActivity(event: string, details?: any, userId?: string, profileId?: string, mediaId?: string) {
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      event,
      userId,
      profileId,
      mediaId,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.activityLogs.unshift(entry);
    if (this.data.activityLogs.length > 200) {
      this.data.activityLogs.pop();
    }
    this.save();
    return entry;
  }
}

export const db = new Database();
