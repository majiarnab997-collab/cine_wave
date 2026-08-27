import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { useSettings } from '../context/SettingsContext';
import { LANGUAGES, Locale } from '../services/i18nService';
import { Settings, Sliders, Subtitles, Bell, Shield, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    locale,
    setLocale,
    updatePlaybackSettings,
    updateSubtitleSettings,
    updateNotificationSettings,
    updatePrivacySettings
  } = useSettings();

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pt-20 pb-12 lg:pb-0">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Streaming Preferences
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Customize video player behavior, caption styles, notifications, and privacy options.
          </p>
        </div>

        {/* Playback Controls */}
        <section className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 font-display font-bold text-white text-lg">
            <Sliders className="w-5 h-5 text-brand-primary" />
            <h3>Playback & Video Quality</h3>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5">
              <div>
                <span className="font-bold text-xs sm:text-sm text-white block">Autoplay Next Episode</span>
                <span className="text-xs text-text-muted">
                  Automatically start the next episode in a series with a 10s countdown.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.playback.autoplayNext}
                onChange={e => updatePlaybackSettings({ autoplayNext: e.target.checked })}
                className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5">
              <div>
                <span className="font-bold text-xs sm:text-sm text-white block">Autoplay Previews</span>
                <span className="text-xs text-text-muted">
                  Play video trailers while browsing cards and hero banners.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.playback.autoplayPreviews}
                onChange={e => updatePlaybackSettings({ autoplayPreviews: e.target.checked })}
                className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs sm:text-sm text-white block">Default Streaming Quality</span>
                <span className="text-xs text-text-muted">Optimize data usage for your network bandwidth</span>
              </div>
              <select
                value={settings.playback.defaultQuality}
                onChange={e => updatePlaybackSettings({ defaultQuality: e.target.value as any })}
                className="bg-[#161622] border border-white/15 text-white font-semibold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <option value="auto">Auto (Best Available)</option>
                <option value="4k">4K Ultra HD (High Data)</option>
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD (Data Saver)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Subtitles & Captions Appearance */}
        <section className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 font-display font-bold text-white text-lg">
            <Subtitles className="w-5 h-5 text-brand-secondary" />
            <h3>Subtitles & Closed Captions Appearance</h3>
          </div>

          <div className="space-y-4 pt-2">
            {/* Live Preview Box */}
            <div className="relative aspect-[21/9] sm:aspect-[24/7] w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center p-4 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="relative z-10 text-center">
                <span
                  className={`font-semibold drop-shadow-lg ${
                    settings.subtitles.fontSize === 'small'
                      ? 'text-sm'
                      : settings.subtitles.fontSize === 'large'
                      ? 'text-xl sm:text-2xl'
                      : 'text-base sm:text-lg'
                  } ${
                    settings.subtitles.fontColor === 'yellow'
                      ? 'text-yellow-300'
                      : settings.subtitles.fontColor === 'cyan'
                      ? 'text-cyan-300'
                      : settings.subtitles.fontColor === 'green'
                      ? 'text-emerald-300'
                      : 'text-white'
                  } ${
                    settings.subtitles.backgroundOpacity === 'transparent'
                      ? 'bg-transparent'
                      : settings.subtitles.backgroundOpacity === 'opaque'
                      ? 'bg-black px-4 py-1.5 rounded-lg'
                      : 'bg-black/60 px-4 py-1.5 rounded-lg backdrop-blur-sm'
                  }`}
                >
                  "This is a live preview of your subtitle styling on CineWave."
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-text-muted uppercase font-bold text-[10px] mb-1.5">Font Size</label>
                <select
                  value={settings.subtitles.fontSize}
                  onChange={e => updateSubtitleSettings({ fontSize: e.target.value as any })}
                  className="w-full bg-[#161622] border border-white/15 text-white font-semibold text-xs px-3 py-2 rounded-xl cursor-pointer"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium (Standard)</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-text-muted uppercase font-bold text-[10px] mb-1.5">Text Color</label>
                <select
                  value={settings.subtitles.fontColor}
                  onChange={e => updateSubtitleSettings({ fontColor: e.target.value as any })}
                  className="w-full bg-[#161622] border border-white/15 text-white font-semibold text-xs px-3 py-2 rounded-xl cursor-pointer"
                >
                  <option value="white">White</option>
                  <option value="yellow">Yellow</option>
                  <option value="cyan">Cyan</option>
                  <option value="green">Emerald Green</option>
                </select>
              </div>

              <div>
                <label className="block text-text-muted uppercase font-bold text-[10px] mb-1.5">Background Box</label>
                <select
                  value={settings.subtitles.backgroundOpacity}
                  onChange={e => updateSubtitleSettings({ backgroundOpacity: e.target.value as any })}
                  className="w-full bg-[#161622] border border-white/15 text-white font-semibold text-xs px-3 py-2 rounded-xl cursor-pointer"
                >
                  <option value="semi">Semi-Transparent Black</option>
                  <option value="opaque">Solid Black</option>
                  <option value="transparent">Transparent (None)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Display Language */}
        <section className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-4">
          <h3 className="font-display font-bold text-white text-lg">Display Language & Internationalization</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  locale === lang.code
                    ? 'bg-brand-primary/20 border-brand-primary text-white shadow-glow-primary'
                    : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                }`}
              >
                <div className="font-bold text-xs">{lang.nativeLabel}</div>
                <span className="text-[10px] text-text-muted">{lang.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};
