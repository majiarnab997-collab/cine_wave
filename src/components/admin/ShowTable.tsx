import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Play, ChevronDown, ChevronRight, Star } from 'lucide-react';
import { TVShow } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ShowTableProps {
  shows: TVShow[];
  onAddShow: () => void;
  onEditShow: (show: TVShow) => void;
  onDeleteShow: (id: string) => void;
  onPreviewShow: (show: TVShow) => void;
}

export const ShowTable: React.FC<ShowTableProps> = ({
  shows,
  onAddShow,
  onEditShow,
  onDeleteShow,
  onPreviewShow
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);

  const filteredShows = shows.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedShowId(expandedShowId === id ? null : id);
  };

  return (
    <div className="rounded-2xl bg-[#12121B] border border-white/10 shadow-lg overflow-hidden space-y-4">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-white text-base">TV Series Catalog ({shows.length})</h3>
          <p className="text-xs text-text-muted">Manage series, seasons, episode lists, and broadcast schedules</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter TV shows..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary w-44 sm:w-56"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onAddShow}
          >
            Add TV Show
          </Button>
        </div>
      </div>

      {/* Shows List */}
      <div className="divide-y divide-white/5">
        {filteredShows.map(show => {
          const isExpanded = expandedShowId === show.id;

          return (
            <div key={show.id} className="transition-colors hover:bg-white/[0.02]">
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => toggleExpand(show.id)}
                    className="p-1 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>

                  <img
                    src={show.posterUrl}
                    alt={show.title}
                    className="w-12 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-base truncate">{show.title}</h4>
                      <Badge maturity={show.maturityRating} className="text-[9px] px-1 py-0" />
                      {show.isOriginal && <Badge variant="original">Original</Badge>}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                      <span>{show.releaseYear}</span>
                      <span>•</span>
                      <span className="text-white font-medium">
                        {show.seasonsCount} Season{show.seasonsCount > 1 ? 's' : ''} ({show.totalEpisodes} Episodes)
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{show.matchPercentage}% Match</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPreviewShow(show)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors"
                    title="Watch Preview"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => onEditShow(show)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors"
                    title="Edit Series"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete TV show "${show.title}" and all seasons?`)) {
                        onDeleteShow(show.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Series"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Seasons and Episodes Tree */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 bg-black/40 border-t border-white/5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Seasons & Episodes Breakdown
                  </div>

                  {show.seasons.map(season => (
                    <div key={season.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          Season {season.seasonNumber}: {season.title}
                        </span>
                        <span className="text-xs text-text-muted font-mono">
                          {season.episodes.length} Episodes
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {season.episodes.map(ep => (
                          <div
                            key={ep.id}
                            className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-center"
                          >
                            <img
                              src={ep.thumbnailUrl}
                              alt=""
                              className="w-14 aspect-video rounded object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h6 className="text-xs font-bold text-white truncate">{ep.title}</h6>
                              <span className="text-[10px] text-text-muted font-mono">{ep.runtime} mins</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
