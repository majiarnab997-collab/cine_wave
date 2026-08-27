import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Film, Tv, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../types';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifs = () => {
    if (user) {
      setNotifications(notificationService.getNotifications(user.id));
    }
  };

  useEffect(() => {
    loadNotifs();
  }, [user]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    if (user) {
      notificationService.markAllAsRead(user.id);
      loadNotifs();
    }
  };

  const handleItemClick = (notif: Notification) => {
    notificationService.markAsRead(notif.id);
    loadNotifs();
    setIsOpen(false);

    if (notif.mediaId) {
      if (notif.mediaType === 'tv') {
        navigate(`/show/${notif.mediaId}`);
      } else {
        navigate(`/movie/${notif.mediaId}`);
      }
    } else if (notif.type === 'account') {
      navigate('/account');
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_release':
        return <Film className="w-4 h-4 text-brand-primary" />;
      case 'continue_watching':
        return <Clock className="w-4 h-4 text-brand-secondary" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-brand-amber" />;
      case 'account':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Tv className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-glow-primary animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-dropdown rounded-2xl shadow-cinematic overflow-hidden z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-brand-primary/20 text-brand-primary text-xs font-bold px-2 py-0.5 rounded-full border border-brand-primary/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No notifications right now
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 flex gap-3 hover:bg-white/5 cursor-pointer transition-colors ${
                    !notif.read ? 'bg-brand-primary/5' : ''
                  }`}
                >
                  {notif.thumbnailUrl ? (
                    <img
                      src={notif.thumbnailUrl}
                      alt=""
                      className="w-12 h-16 object-cover rounded-lg shrink-0 border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {getIcon(notif.type)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className={`text-xs font-bold truncate ${!notif.read ? 'text-white' : 'text-text-secondary'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-1.5">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-text-muted font-mono">{notif.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
