import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Sparkles, Shield } from 'lucide-react';
import { Logo } from '../common/Logo';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

interface NavbarProps {
  onAddProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddProfile }) => {
  const { isScrolled } = useScrollDirection();
  const { isKidsMode, activeProfile } = useProfile();
  const { isAdmin, isAuthenticated } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { to: '/home', label: t('nav_home') },
    { to: '/movies', label: t('nav_movies') },
    { to: '/tv-shows', label: t('nav_tv') },
    { to: '/browse', label: t('nav_browse') },
    { to: '/my-list', label: t('nav_my_list') },
    { to: '/continue-watching', label: t('nav_continue_watching') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08080C]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-6 md:gap-8">
          <Logo size="md" />

          {/* Kids Mode Pill Indicator if active */}
          {isKidsMode && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KIDS MODE</span>
            </div>
          )}

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-white font-bold bg-white/10 shadow-sm'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {isAuthenticated ? (
            <>
              {/* Search Bar */}
              <div className="relative">
                {isSearchOpen ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-[#0E0E15] border border-white/20 rounded-full px-3 py-1.5 w-48 sm:w-64 md:w-72 shadow-lg animate-in fade-in zoom-in-95 duration-200"
                  >
                    <Search className="w-4 h-4 text-text-muted shrink-0 mr-2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder={t('search_placeholder')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm text-white placeholder-text-muted focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-text-muted hover:text-white p-0.5 rounded-full"
                      aria-label="Close search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      if (location.pathname === '/search') {
                        // Already on search page
                        return;
                      }
                      setIsSearchOpen(true);
                    }}
                    className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Admin Portal Shortcut for Admins */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all shadow-sm"
                  title="Admin Control Center"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Notifications */}
              <NotificationDropdown />

              {/* Profile Menu */}
              <ProfileDropdown onAddProfile={onAddProfile} />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-text-secondary hover:text-white transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-bold bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-amber text-white px-4 py-2 rounded-lg shadow-glow-primary hover:brightness-110 transition-all"
              >
                Join CineWave
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
