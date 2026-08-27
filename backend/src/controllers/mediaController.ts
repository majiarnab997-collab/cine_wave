import { Request, Response } from 'express';
import { db } from '../db';
import { MediaItem } from '../models';

export const mediaController = {
  getAll: (req: Request, res: Response) => {
    const { type, genre, isKids, search, sort, year, maturity } = req.query;

    let items: MediaItem[] = [...db.movies, ...db.shows];

    if (isKids === 'true') {
      items = items.filter(m => m.isKidsSafe);
    }

    if (type === 'movie') {
      items = items.filter(m => m.type === 'movie');
    } else if (type === 'tv') {
      items = items.filter(m => m.type === 'tv');
    }

    if (genre && genre !== 'all') {
      items = items.filter(m => m.genres.includes(genre as string));
    }

    if (year && year !== 'all') {
      items = items.filter(m => m.releaseYear === Number(year));
    }

    if (maturity && maturity !== 'all') {
      items = items.filter(m => m.maturityRating === maturity);
    }

    if (search) {
      const q = (search as string).toLowerCase().trim();
      items = items.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.cast.some(c => c.name.toLowerCase().includes(q) || c.character.toLowerCase().includes(q)) ||
        m.directors.some(d => d.name.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      items.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sort === 'az') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      items.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    }

    return res.json({ success: true, count: items.length, data: items });
  },

  getFeatured: (req: Request, res: Response) => {
    const { isKids } = req.query;
    let items = [...db.movies, ...db.shows].filter(m => m.isFeatured);
    if (isKids === 'true') {
      items = items.filter(m => m.isKidsSafe);
    }
    return res.json({ success: true, data: items });
  },

  getTrending: (req: Request, res: Response) => {
    const { isKids } = req.query;
    let items = [...db.movies, ...db.shows].filter(m => m.isTrending);
    if (isKids === 'true') {
      items = items.filter(m => m.isKidsSafe);
    }
    return res.json({ success: true, data: items });
  },

  getTopTen: (req: Request, res: Response) => {
    const { isKids } = req.query;
    let items = [...db.movies, ...db.shows];
    if (isKids === 'true') {
      items = items.filter(m => m.isKidsSafe);
    }
    items.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    return res.json({ success: true, data: items.slice(0, 10) });
  },

  getGenres: (_req: Request, res: Response) => {
    return res.json({ success: true, data: db.genres });
  },

  getById: (req: Request, res: Response) => {
    const { id } = req.params;
    const media = [...db.movies, ...db.shows].find(m => m.id === id);
    if (!media) {
      return res.status(404).json({ success: false, error: 'Media not found' });
    }
    return res.json({ success: true, data: media });
  },

  getSimilar: (req: Request, res: Response) => {
    const { id } = req.params;
    const current = [...db.movies, ...db.shows].find(m => m.id === id);
    if (!current) {
      return res.status(404).json({ success: false, error: 'Media not found' });
    }

    const similar = [...db.movies, ...db.shows].filter(m =>
      m.id !== current.id &&
      (m.type === current.type || m.genres.some(g => current.genres.includes(g)))
    ).slice(0, 10);

    return res.json({ success: true, data: similar });
  }
};
