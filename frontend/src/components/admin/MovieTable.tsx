import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Play, Star } from 'lucide-react';
import { Movie } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface MovieTableProps {
  movies: Movie[];
  onAddMovie: () => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (id: string) => void;
  onPreviewMovie: (movie: Movie) => void;
}

export const MovieTable: React.FC<MovieTableProps> = ({
  movies,
  onAddMovie,
  onEditMovie,
  onDeleteMovie,
  onPreviewMovie
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');

  const filteredMovies = movies.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || m.genres.includes(genreFilter);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="rounded-2xl bg-[#12121B] border border-white/10 shadow-lg overflow-hidden space-y-4">
      {/* Top Header & Search Bar */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-white text-base">Movies Catalog ({movies.length})</h3>
          <p className="text-xs text-text-muted">Manage titles, resolutions, metadata, and video stream links</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter movies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary w-44 sm:w-56"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onAddMovie}
          >
            Add Movie
          </Button>
        </div>
      </div>

      {/* Movies Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-text-muted font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Title & Poster</th>
              <th className="px-5 py-3.5">Year / Runtime</th>
              <th className="px-5 py-3.5">Genres</th>
              <th className="px-5 py-3.5">Rating / Match</th>
              <th className="px-5 py-3.5">Attributes</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredMovies.map(movie => (
              <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-10 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 max-w-xs">
                      <h4 className="font-bold text-white text-sm truncate">{movie.title}</h4>
                      <p className="text-text-muted text-xs truncate">{movie.tagline || movie.description}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap">
                  <div>{movie.releaseYear}</div>
                  <span className="text-[11px] text-text-muted">{movie.runtime} mins</span>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map(g => (
                      <span key={g} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-text-secondary">
                        {g}
                      </span>
                    ))}
                    {movie.genres.length > 2 && (
                      <span className="text-[10px] text-text-muted">+{movie.genres.length - 2}</span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">{movie.matchPercentage}% match</span>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1 items-center">
                    <Badge maturity={movie.maturityRating} className="text-[9px] px-1 py-0" />
                    {movie.isOriginal && <Badge variant="original">Original</Badge>}
                    {movie.isFeatured && (
                      <span className="text-[10px] bg-brand-amber/20 text-brand-amber px-1.5 py-0.5 rounded font-bold">
                        Hero
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onPreviewMovie(movie)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors"
                      title="Preview Film"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => onEditMovie(movie)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors"
                      title="Edit Film"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete movie "${movie.title}" from catalog?`)) {
                          onDeleteMovie(movie.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete Film"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
