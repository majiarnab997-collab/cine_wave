import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Trash2 } from 'lucide-react';
import { Profile, MaturityRating } from '../../types';
import { Button } from '../common/Button';
import { useProfile } from '../../context/ProfileContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileToEdit?: Profile | null;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80', // Cute puppy for kids
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profileToEdit
}) => {
  const { addProfile, updateProfile, deleteProfile, profiles } = useProfile();

  const isEditing = Boolean(profileToEdit);

  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [isKids, setIsKids] = useState(false);
  const [maturityLevel, setMaturityLevel] = useState<MaturityRating>('TV-MA');
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [autoplayPreviews, setAutoplayPreviews] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profileToEdit) {
      setName(profileToEdit.name);
      setSelectedAvatar(profileToEdit.avatarUrl);
      setIsKids(profileToEdit.isKids);
      setMaturityLevel(profileToEdit.maturityLevel);
      setAutoplayNext(profileToEdit.autoplayNextEpisode);
      setAutoplayPreviews(profileToEdit.autoplayPreviews);
    } else {
      setName('');
      setSelectedAvatar(AVATAR_PRESETS[0]);
      setIsKids(false);
      setMaturityLevel('TV-MA');
      setAutoplayNext(true);
      setAutoplayPreviews(true);
    }
    setError('');
  }, [profileToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a profile name.');
      return;
    }

    if (isEditing && profileToEdit) {
      updateProfile({
        ...profileToEdit,
        name: name.trim(),
        avatarUrl: selectedAvatar,
        isKids,
        maturityLevel: isKids ? 'G' : maturityLevel,
        autoplayNextEpisode: autoplayNext,
        autoplayPreviews: isKids ? false : autoplayPreviews
      });
    } else {
      addProfile({
        name: name.trim(),
        avatarUrl: selectedAvatar,
        isKids,
        maturityLevel: isKids ? 'G' : maturityLevel
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!profileToEdit) return;
    if (profiles.length <= 1) {
      setError('You must keep at least one active profile.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete profile "${profileToEdit.name}"?`)) {
      deleteProfile(profileToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#12121B] border border-white/10 rounded-2xl md:rounded-3xl shadow-cinematic p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            {isEditing ? 'Edit Profile' : 'Add New Profile'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
              Choose Avatar
            </label>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={selectedAvatar}
                alt="Selected avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-primary shadow-glow-primary"
              />
              <div className="text-xs text-text-muted leading-relaxed">
                Select an avatar that suits your viewing style.
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5 pt-2">
              {AVATAR_PRESETS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedAvatar === avatar
                      ? 'border-brand-primary scale-105 shadow-glow-primary'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                  {selectedAvatar === avatar && (
                    <div className="absolute inset-0 bg-brand-primary/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Name */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Profile Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Alex, Kids, Movies"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm"
            />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>

          {/* Kids Mode Toggle */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Kids Profile?</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/30">
                  KIDS MODE
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Only shows movies and TV shows rated for kids 12 and under. Simplified navigation and family content.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isKids}
              onChange={e => setIsKids(e.target.checked)}
              className="w-5 h-5 accent-brand-primary rounded cursor-pointer mt-1"
            />
          </div>

          {/* Maturity Level (if not kids) */}
          {!isKids && (
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Maturity Rating Limit
              </label>
              <select
                value={maturityLevel}
                onChange={e => setMaturityLevel(e.target.value as MaturityRating)}
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C2A] border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="G">G - General Audiences (All Ages)</option>
                <option value="PG">PG - Parental Guidance Suggested</option>
                <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                <option value="TV-14">TV-14 - Suitable for 14 and above</option>
                <option value="TV-MA">TV-MA / R - Mature Audiences (All Content)</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {isEditing && profiles.length > 1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Profile</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                {isEditing ? 'Save Changes' : 'Create Profile'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
