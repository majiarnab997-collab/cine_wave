import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { ErrorState } from '../components/common/ErrorState';
import { mediaService } from '../services/mediaService';

export const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const episodeId = searchParams.get('ep') || undefined;

  if (!id) {
    return <ErrorState title="Media not found" />;
  }

  const media = mediaService.getMediaById(id);
  if (!media) {
    return <ErrorState title="This title is no longer available to stream." />;
  }

  return (
    <VideoPlayer
      media={media}
      episodeId={episodeId}
      onExit={() => {
        if (media.type === 'tv') {
          navigate(`/show/${media.id}`);
        } else {
          navigate(`/movie/${media.id}`);
        }
      }}
    />
  );
};
