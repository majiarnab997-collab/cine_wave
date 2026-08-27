import React, { useState, useEffect } from 'react';
import { Activity, Play, UserPlus, LogIn, Bookmark, Search, Trash2 } from 'lucide-react';
import { AnalyticsEvent } from '../../types';
import { analyticsService } from '../../services/analyticsService';

export const ActivityLog: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const loadEvents = () => {
    const list = analyticsService.getEvents();
    setEvents(list);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleClear = () => {
    if (window.confirm('Clear all recorded analytics and activity events?')) {
      analyticsService.clearEvents();
      loadEvents();
    }
  };

  const getEventIcon = (name: string) => {
    switch (name) {
      case 'movie_started':
      case 'episode_started':
        return <Play className="w-3.5 h-3.5 text-brand-primary" />;
      case 'signup':
      case 'profile_created':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'login':
      case 'demo_login':
        return <LogIn className="w-3.5 h-3.5 text-cyan-400" />;
      case 'title_added_to_list':
        return <Bookmark className="w-3.5 h-3.5 text-brand-amber" />;
      case 'search_performed':
        return <Search className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-text-muted" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#12121B] border border-white/10 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-white text-base">Real-Time Platform Event Stream</h3>
          <p className="text-xs text-text-muted">Live telemetry events captured across active user sessions</p>
        </div>
        {events.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-white/5 max-h-96 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted">
            No events recorded yet in this session. Start watching, searching, or adding items to see live logs!
          </div>
        ) : (
          events.map(evt => (
            <div key={evt.id} className="py-3 flex items-center justify-between gap-4 hover:bg-white/5 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {getEventIcon(evt.eventName)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white uppercase">{evt.eventName}</span>
                    {evt.userId && (
                      <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-text-muted font-mono">
                        {evt.userId}
                      </span>
                    )}
                  </div>
                  {evt.metadata && (
                    <p className="text-xs text-text-muted truncate mt-0.5 font-mono">
                      {JSON.stringify(evt.metadata)}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-text-muted font-mono shrink-0">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
