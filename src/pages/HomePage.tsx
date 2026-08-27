import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { HeroCarousel } from '../components/hero/HeroCarousel';
import { MediaRow } from '../components/media/MediaRow';
import { TopTenRow } from '../components/media/TopTenRow';
import { ContinueWatchingRow } from '../components/media/ContinueWatchingRow';
import { QuickViewModal } from '../components/modals/QuickViewModal';
import { ProfileModal } from '../components/modals/ProfileModal';
import { mediaService } from '../services/mediaService';
import { recommendationService } from '../services/recommendationService';
import { useProfile } from '../context/ProfileContext';
import { usePlayback } from '../context/PlaybackContext';
import { useSettings } from '../context/SettingsContext';
import { MediaItem } from '../types';

export const HomePage: React.FC = () => {
  const { activeProfile, isKidsMode } = useProfile();
  const { continueWatching } = usePlayback();
  const { t } = useSettings();

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);

  // Content queries based on active profile mode (Kids vs Standard)
  const featured = mediaService.getFeatured(isKidsMode);
  const trending = mediaService.getTrending(isKidsMode);
  const topTen = mediaService.getTopTen(isKidsMode);
  const popular = mediaService.getPopular(isKidsMode);

  // Genre specific rows
  const sciFi = mediaService.getByGenre('sci-fi', isKidsMode);
  const action = mediaService.getByGenre('action', isKidsMode);
  const drama = mediaService.getByGenre('drama', isKidsMode);
  const comedy = mediaService.getByGenre('comedy', isKidsMode);
  const family = mediaService.getByGenre('family', isKidsMode);
  const documentary = mediaService.getByGenre('documentary', isKidsMode);
  const thriller = mediaService.getByGenre('thriller', isKidsMode);

  // Dynamic Personalized recommendations
  const recommendationSections = activeProfile
    ? recommendationService.getPersonalizedRecommendations(activeProfile.id, isKidsMode)
    : [];

  const handleOpenDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pb-12 lg:pb-0">
      {/* Dynamic Sticky Navbar */}
      <Navbar onAddProfile={() => setIsAddProfileOpen(true)} />

      {/* Featured Hero Carousel */}
      <HeroCarousel items={featured} onOpenDetails={handleOpenDetails} />

      {/* Content Carousels Matrix */}
      <main className="relative z-20 -mt-10 sm:-mt-16 md:-mt-20 space-y-4 sm:space-y-6">
        {/* Continue Watching for Active Profile */}
        {continueWatching.length > 0 && (
          <ContinueWatchingRow
            title={t('row_continue_watching', { name: activeProfile?.name || 'You' })}
            items={continueWatching}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {/* Trending Now */}
        <MediaRow
          title={t('row_trending')}
          subtitle="The most streamed titles on CineWave this week"
          items={trending}
          onOpenDetails={handleOpenDetails}
        />

        {/* Top 10 with Giant Numbers */}
        <TopTenRow
          title={t('row_top_ten')}
          items={topTen}
          onOpenDetails={handleOpenDetails}
        />

        {/* Personalized Recommendation Sections */}
        {recommendationSections.map(section => (
          <MediaRow
            key={section.id}
            title={section.title}
            subtitle={section.reason}
            items={section.items}
            onOpenDetails={handleOpenDetails}
          />
        ))}

        {/* Popular Blockbusters */}
        <MediaRow
          title="Popular On CineWave"
          subtitle="Critically acclaimed hits loved by audiences"
          items={popular}
          onOpenDetails={handleOpenDetails}
        />

        {/* Genre Rows */}
        {family.length > 0 && (
          <MediaRow
            title="Family & Animated Adventures"
            subtitle="Enchanting tales suitable for viewers of all ages"
            items={family}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {!isKidsMode && sciFi.length > 0 && (
          <MediaRow
            title="Sci-Fi & Cyberpunk Visions"
            subtitle="Futuristic technologies and cosmic frontiers"
            items={sciFi}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {!isKidsMode && action.length > 0 && (
          <MediaRow
            title="Action & High-Octane Thrills"
            subtitle="Supersonic dogfights and relentless chases"
            items={action}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {!isKidsMode && thriller.length > 0 && (
          <MediaRow
            title="Psychological Suspense & Mystery"
            subtitle="Twists and enigmas that keep you guessing"
            items={thriller}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {drama.length > 0 && (
          <MediaRow
            title="Critically Acclaimed Dramas"
            subtitle="Deep, resonant stories of human triumph and conflict"
            items={drama}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {comedy.length > 0 && (
          <MediaRow
            title="Comedy & Satire"
            subtitle="Clever laughs, heist antics, and witty humor"
            items={comedy}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {documentary.length > 0 && (
          <MediaRow
            title="Documentaries & Nature"
            subtitle="Spectacular 4K wildlife sagas and real-world wonders"
            items={documentary}
            onOpenDetails={handleOpenDetails}
          />
        )}
      </main>

      {/* Details Quick View Modal */}
      <QuickViewModal
        media={selectedMedia}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Profile Creation Modal */}
      <ProfileModal
        isOpen={isAddProfileOpen}
        onClose={() => setIsAddProfileOpen(false)}
      />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
