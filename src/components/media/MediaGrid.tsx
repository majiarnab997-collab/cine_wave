import React from 'react';
import { MediaItem } from '../../types';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  variant?: 'poster' | 'landscape';
  onOpenDetails?: (media: MediaItem) => void;
  className?: string;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  variant = 'poster',
  onOpenDetails,
  className = ''
}) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 ${className}`}
    >
      {items.map(item => (
        <div key={item.id} className="flex justify-center">
          <MediaCard
            media={item}
            variant={variant}
            onOpenDetails={onOpenDetails}
            className="!w-full"
          />
        </div>
      ))}
    </div>
  );
};
