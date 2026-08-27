import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Check, Sparkles } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { ProfileModal } from '../components/modals/ProfileModal';
import { useProfile } from '../context/ProfileContext';
import { Profile } from '../types';

export const ProfileSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, setActiveProfile } = useProfile();

  const [isManaging, setIsManaging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);

  const handleSelect = (profile: Profile) => {
    if (isManaging) {
      setProfileToEdit(profile);
      setModalOpen(true);
    } else {
      setActiveProfile(profile);
      navigate('/home');
    }
  };

  const handleAddProfile = () => {
    setProfileToEdit(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex flex-col justify-between p-6 relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-at-c from-brand-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" to="/" />
      </header>

      {/* Center Profiles Grid */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight mb-8 sm:mb-12">
          {isManaging ? 'Manage Profiles' : "Who's watching?"}
        </h1>

        {/* Profiles Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-4xl">
          {profiles.map(profile => (
            <div
              key={profile.id}
              onClick={() => handleSelect(profile)}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-white/20 group-hover:border-brand-primary group-hover:shadow-glow-primary transition-all duration-300 group-hover:scale-105 bg-[#12121B]">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Edit Pencil Badge when in manage mode */}
                {isManaging ? (
                  <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg">
                      <Edit2 className="w-5 h-5" />
                    </div>
                  </div>
                ) : profile.isKids ? (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shadow border border-black">
                    KIDS
                  </div>
                ) : null}
              </div>

              <span className="font-display font-bold text-sm sm:text-base text-text-secondary group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Tile */}
          {profiles.length < 5 && (
            <div
              onClick={handleAddProfile}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-2 border-dashed border-white/20 group-hover:border-brand-primary group-hover:bg-brand-primary/10 flex items-center justify-center text-text-muted group-hover:text-brand-primary transition-all duration-300 group-hover:scale-105">
                <Plus className="w-10 h-10" />
              </div>
              <span className="font-display font-bold text-sm sm:text-base text-text-muted group-hover:text-white transition-colors">
                Add Profile
              </span>
            </div>
          )}
        </div>

        {/* Manage Profiles Toggle Button */}
        <div className="mt-12 sm:mt-16">
          <Button
            variant={isManaging ? 'primary' : 'outline'}
            size="md"
            onClick={() => setIsManaging(!isManaging)}
            className="px-6 py-2.5 tracking-wider uppercase text-xs font-bold"
          >
            {isManaging ? 'Done' : 'Manage Profiles'}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} CineWave Media Inc.
      </footer>

      {/* Add/Edit Profile Modal */}
      <ProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        profileToEdit={profileToEdit}
      />
    </div>
  );
};
