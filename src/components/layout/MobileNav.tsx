import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Film, Tv, Search, Bookmark, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

export const MobileNav: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isKidsMode } = useProfile();

  if (!isAuthenticated) return null;

  const items = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/movies', icon: Film, label: 'Movies' },
    { to: '/tv-shows', icon: Tv, label: 'TV Shows' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/my-list', icon: Bookmark, label: 'My List' },
    { to: '/account', icon: User, label: 'Account' },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080C]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 shadow-2xl"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? isKidsMode
                      ? 'text-emerald-400 font-bold scale-105'
                      : 'text-brand-primary font-bold scale-105'
                    : 'text-text-muted hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
