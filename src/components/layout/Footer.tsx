import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';
import { Logo } from '../common/Logo';
import { LANGUAGES, Locale } from '../../services/i18nService';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { locale, setLocale, t } = useSettings();

  return (
    <footer className="bg-[#050508] border-t border-white/5 pt-14 pb-24 lg:pb-14 px-4 sm:px-6 lg:px-8 text-text-muted mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs sm:text-sm text-text-muted max-w-sm leading-relaxed">
              {t('footer_tagline')} Unlimited movies, TV series, award-winning documentaries, and cinematic originals.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="relative inline-block">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                  <Globe className="w-3.5 h-3.5 text-text-muted" />
                  <select
                    value={locale}
                    onChange={e => setLocale(e.target.value as Locale)}
                    className="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-4"
                    aria-label="Select Language"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code} className="bg-[#0E0E15] text-white">
                        {lang.nativeLabel} ({lang.label})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/home" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
              </li>
              <li>
                <Link to="/tv-shows" className="hover:text-white transition-colors">TV Shows</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition-colors">Browse Catalog</Link>
              </li>
              <li>
                <Link to="/my-list" className="hover:text-white transition-colors">My Watchlist</Link>
              </li>
            </ul>
          </div>

          {/* Account & Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Account</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/account" className="hover:text-white transition-colors">Membership & Billing</Link>
              </li>
              <li>
                <Link to="/profiles" className="hover:text-white transition-colors">Manage Profiles</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">Playback Settings</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">Watch History</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Info</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Help Center & FAQ</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Privacy Statement</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Cookie Preferences</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Corporate Information</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-muted">
          <div>
            &copy; {new Date().getFullYear()} CineWave Media Inc. All rights reserved. Original demo platform.
          </div>
          <div className="flex items-center gap-1">
            <span>Engineered with passion for cinema</span>
            <Heart className="w-3 h-3 text-brand-primary fill-brand-primary inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
