import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Settings,
  UserCheck,
  LogOut,
  Shield,
  Sparkles,
  ChevronDown,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

interface ProfileDropdownProps {
  onAddProfile?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onAddProfile }) => {
  const { user, isAdmin, logout } = useAuth();
  const { activeProfile, profiles, setActiveProfile, isKidsMode } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleSelectProfile = (p: typeof profiles[0]) => {
    setActiveProfile(p);
    setIsOpen(false);
    navigate('/home');
  };

  if (!user || !activeProfile) {
    return (
      <Link
        to="/login"
        className="text-xs md:text-sm font-semibold bg-brand-primary text-white px-3.5 py-1.5 rounded-lg hover:brightness-110 shadow-glow-primary transition-all"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary group"
        aria-label="Profile menu"
      >
        <div className="relative">
          <img
            src={activeProfile.avatarUrl}
            alt={activeProfile.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/20 group-hover:border-brand-primary transition-colors shadow-sm"
          />
          {isKidsMode && (
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-[9px] font-black text-slate-950 px-1 rounded-full leading-tight border border-black shadow">
              KIDS
            </span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-secondary group-hover:text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 glass-dropdown rounded-2xl shadow-cinematic overflow-hidden z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-200 divide-y divide-white/10">
          {/* Active Profile Header */}
          <div className="p-4 bg-white/5 flex items-center gap-3">
            <img
              src={activeProfile.avatarUrl}
              alt={activeProfile.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm truncate">{activeProfile.name}</span>
                {isKidsMode && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Kids
                  </span>
                )}
              </div>
              <span className="text-xs text-text-muted truncate block">{user.email}</span>
            </div>
          </div>

          {/* Switch Profile Section */}
          <div className="p-2 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-2.5 py-1 block">
              Switch Profile
            </span>
            {profiles
              .filter(p => p.id !== activeProfile.id)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProfile(p)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/10 transition-colors text-left"
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <span className="truncate flex-1">{p.name}</span>
                  {p.isKids && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1 rounded">Kids</span>
                  )}
                </button>
              ))}

            <Link
              to="/profiles"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <Users className="w-4 h-4 text-text-muted" />
              <span>Manage Profiles</span>
            </Link>

            {onAddProfile && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddProfile();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-brand-primary hover:bg-brand-primary/10 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Profile</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-0.5">
            <Link
              to="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-text-muted" />
              <span>Account</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-text-muted" />
              <span>Settings</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-brand-amber hover:bg-brand-amber/10 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Sign Out */}
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of CineWave</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
