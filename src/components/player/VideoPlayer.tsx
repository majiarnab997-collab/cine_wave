import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ArrowLeft,
  SkipForward,
  Subtitles,
  Tv,
  Radio,
  Check
} from 'lucide-react';
import { MediaItem, TVShow, Episode } from '../../types';
import { usePlayback } from '../../context/PlaybackContext';
import { useSettings } from '../../context/SettingsContext';
import { useKeyboard } from '../../hooks/useKeyboard';
import { analyticsService } from '../../services/analyticsService';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

interface VideoPlayerProps {
  media: MediaItem;
  episodeId?: string;
  onExit?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  media,
  episodeId,
  onExit
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeProfile } = useProfile();
  const { getResumePosition, updateProgress } = usePlayback();
  const { settings } = useSettings();

  const isTV = media.type === 'tv';
  const tvShow = isTV ? (media as TVShow) : null;

  // Locate active episode if TV show
  let currentEpisode: Episode | undefined;
  let currentSeasonNum = 1;
  let nextEpisode: Episode | undefined;

  if (tvShow) {
    for (const season of tvShow.seasons) {
      const epIndex = season.episodes.findIndex(e => e.id === episodeId);
      if (epIndex >= 0) {
        currentEpisode = season.episodes[epIndex];
        currentSeasonNum = season.seasonNumber;
        // check next episode in season
        if (epIndex + 1 < season.episodes.length) {
          nextEpisode = season.episodes[epIndex + 1];
        }
        break;
      }
    }
    // Default to first episode of first season if none specified
    if (!currentEpisode && tvShow.seasons[0]?.episodes[0]) {
      currentEpisode = tvShow.seasons[0].episodes[0];
      currentSeasonNum = tvShow.seasons[0].seasonNumber;
      nextEpisode = tvShow.seasons[0].episodes[1];
    }
  }

  const activeVideoUrl = currentEpisode ? currentEpisode.videoUrl : media.videoUrl;
  const playerTitle = currentEpisode
    ? `${media.title} — S${currentSeasonNum}:E${currentEpisode.episodeNumber} "${currentEpisode.title}"`
    : media.title;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('4K Ultra HD');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('sub-en');
  const [selectedAudio, setSelectedAudio] = useState<string>('aud-orig');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<'main' | 'subtitles' | 'audio' | 'speed' | 'quality'>('main');
  const [showNextEpisodeCountdown, setShowNextEpisodeCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const [showSkipIntro, setShowSkipIntro] = useState(false);

  // Resume position
  useEffect(() => {
    const resumeSec = getResumePosition(media.id, currentEpisode?.id);
    if (videoRef.current && resumeSec > 10) {
      videoRef.current.currentTime = resumeSec;
    }
    analyticsService.track(
      currentEpisode ? 'episode_started' : 'movie_started',
      { title: media.title, episodeId: currentEpisode?.id },
      user?.id,
      activeProfile?.id,
      media.id
    );
  }, [media.id, currentEpisode?.id]);

  // Controls auto-hide on inactivity
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying && !showSettingsMenu) {
        setControlsVisible(false);
      }
    }, 3000);
  }, [isPlaying, showSettingsMenu]);

  useEffect(() => {
    const handleMouseMove = () => showControlsTemporarily();
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showControlsTemporarily]);

  // Time & progress tracker
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(curr);
    setDuration(dur);

    // Skip intro detection (e.g. between 10s and 45s)
    const introStart = currentEpisode?.introStart || 10;
    const introEnd = currentEpisode?.introEnd || 45;
    if (curr >= introStart && curr <= introEnd) {
      setShowSkipIntro(true);
    } else {
      setShowSkipIntro(false);
    }

    // Next Episode Auto-advance trigger (at 95%)
    if (nextEpisode && curr / dur >= 0.95 && !showNextEpisodeCountdown) {
      setShowNextEpisodeCountdown(true);
    }

    // Save progress every 5 seconds
    if (Math.floor(curr) % 5 === 0) {
      updateProgress(
        media,
        curr,
        dur,
        currentEpisode
          ? {
              episodeId: currentEpisode.id,
              seasonNumber: currentSeasonNum,
              episodeNumber: currentEpisode.episodeNumber
            }
          : undefined
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  // Next Episode Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showNextEpisodeCountdown && countdownSeconds > 0) {
      timer = setTimeout(() => setCountdownSeconds(prev => prev - 1), 1000);
    } else if (showNextEpisodeCountdown && countdownSeconds === 0 && nextEpisode) {
      handlePlayNextEpisode();
    }
    return () => clearTimeout(timer);
  }, [showNextEpisodeCountdown, countdownSeconds, nextEpisode]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    showControlsTemporarily();
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = Number(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkipIntro = () => {
    if (!videoRef.current) return;
    const target = currentEpisode?.introEnd || 45;
    videoRef.current.currentTime = target;
    setShowSkipIntro(false);
  };

  const handlePlayNextEpisode = () => {
    if (!nextEpisode) return;
    setShowNextEpisodeCountdown(false);
    setCountdownSeconds(10);
    navigate(`/watch/${media.id}?ep=${nextEpisode.id}`);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const handleBack = () => {
    // Save progress right before exiting
    if (videoRef.current) {
      updateProgress(
        media,
        videoRef.current.currentTime,
        videoRef.current.duration || 1,
        currentEpisode
          ? {
              episodeId: currentEpisode.id,
              seasonNumber: currentSeasonNum,
              episodeNumber: currentEpisode.episodeNumber
            }
          : undefined
      );
    }

    if (onExit) {
      onExit();
    } else {
      if (isTV) navigate(`/show/${media.id}`);
      else navigate(`/movie/${media.id}`);
    }
  };

  // Keyboard Shortcuts
  useKeyboard({
    ' ': e => {
      e.preventDefault();
      handlePlayPause();
    },
    k: () => handlePlayPause(),
    K: () => handlePlayPause(),
    ArrowLeft: e => {
      e.preventDefault();
      handleSeek(-10);
    },
    ArrowRight: e => {
      e.preventDefault();
      handleSeek(10);
    },
    j: () => handleSeek(-10),
    l: () => handleSeek(10),
    f: () => toggleFullscreen(),
    F: () => toggleFullscreen(),
    m: () => setIsMuted(!isMuted),
    M: () => setIsMuted(!isMuted),
    Escape: () => {
      if (!document.fullscreenElement) {
        handleBack();
      }
    }
  });

  const formatTime = (secs: number) => {
    const total = Math.floor(secs);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Subtitle styling classes based on settings
  const subtitleSizeClasses = {
    small: 'text-sm sm:text-base',
    medium: 'text-base sm:text-xl',
    large: 'text-xl sm:text-2xl'
  };

  const subtitleColorClasses = {
    white: 'text-white',
    yellow: 'text-yellow-300',
    cyan: 'text-cyan-300',
    green: 'text-emerald-300'
  };

  const subtitleBgClasses = {
    transparent: 'bg-transparent',
    semi: 'bg-black/60 px-3 py-1 rounded-md backdrop-blur-sm',
    opaque: 'bg-black px-3 py-1 rounded-md'
  };

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-black overflow-hidden select-none flex items-center justify-center"
      onClick={handlePlayPause}
    >
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        src={activeVideoUrl}
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (nextEpisode) {
            setShowNextEpisodeCountdown(true);
          }
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Live Subtitles Mock (if subtitles enabled) */}
      {selectedSubtitle !== 'off' && isPlaying && currentTime > 5 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center max-w-2xl px-4">
          <span
            className={`font-semibold drop-shadow-md tracking-wide ${
              subtitleSizeClasses[settings.subtitles.fontSize]
            } ${subtitleColorClasses[settings.subtitles.fontColor]} ${
              subtitleBgClasses[settings.subtitles.backgroundOpacity]
            }`}
          >
            [Dialogue in {selectedSubtitle === 'sub-es' ? 'Spanish' : selectedSubtitle === 'sub-fr' ? 'French' : 'English'}]
          </span>
        </div>
      )}

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <div className="absolute bottom-28 right-8 z-30 animate-in fade-in slide-in-from-right-4 duration-200">
          <button
            onClick={e => {
              e.stopPropagation();
              handleSkipIntro();
            }}
            className="px-5 py-2.5 rounded-lg bg-black/80 hover:bg-brand-primary text-white text-sm font-bold border border-white/20 shadow-cinematic transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <span>Skip Intro</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Next Episode Auto-advance Overlay */}
      {showNextEpisodeCountdown && nextEpisode && (
        <div
          className="absolute bottom-28 right-8 z-30 p-4 rounded-2xl glass-dropdown border border-white/20 shadow-2xl max-w-sm animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start gap-3 mb-3">
            <img
              src={nextEpisode.thumbnailUrl}
              alt=""
              className="w-20 aspect-video object-cover rounded-lg shrink-0 border border-white/10"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-brand-amber block">Up Next</span>
              <h5 className="text-xs font-bold text-white truncate">{nextEpisode.title}</h5>
              <span className="text-[11px] text-text-muted">Playing in {countdownSeconds}s</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayNextEpisode}
              className="flex-1 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Now</span>
            </button>
            <button
              onClick={() => setShowNextEpisodeCountdown(false)}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-display font-bold text-white line-clamp-1 drop-shadow">
              {playerTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{media.releaseYear}</span>
              <span>•</span>
              <span>{media.quality}</span>
              <span>•</span>
              <span>{media.audioQuality}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-30 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Scrubber Bar */}
        <div className="relative group/scrubber mb-3 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={handleScrubberChange}
            className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-primary transition-all"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Left Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handlePlayPause}
              className="p-2 text-white hover:text-brand-primary transition-transform hover:scale-110"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            <button
              onClick={() => handleSeek(-10)}
              className="p-2 text-text-secondary hover:text-white transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleSeek(10)}
              className="p-2 text-text-secondary hover:text-white transition-colors"
              title="Fast forward 10 seconds"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Next Episode button if TV */}
            {nextEpisode && (
              <button
                onClick={handlePlayNextEpisode}
                className="hidden sm:flex p-2 text-text-secondary hover:text-white transition-colors items-center gap-1 text-xs"
                title={`Next: ${nextEpisode.title}`}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}

            {/* Volume Slider */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-text-secondary hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={e => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  setIsMuted(v === 0);
                  if (videoRef.current) videoRef.current.volume = v;
                }}
                className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white hidden sm:block"
              />
            </div>

            {/* Timestamp */}
            <div className="text-xs font-mono text-text-muted">
              <span className="text-white">{formatTime(currentTime)}</span> / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls: Settings, Audio/Subs, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Quick Audio & Subtitles Menu Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu);
                  setActiveMenuTab('main');
                }}
                className={`p-2 rounded-full transition-colors ${
                  showSettingsMenu ? 'bg-white/20 text-white' : 'text-text-secondary hover:text-white'
                }`}
                title="Audio & Subtitles & Settings"
              >
                <Subtitles className="w-5 h-5" />
              </button>

              {/* In-Player Settings Popup Menu */}
              {showSettingsMenu && (
                <div
                  className="absolute bottom-12 right-0 w-64 glass-dropdown rounded-2xl p-3 shadow-2xl border border-white/20 text-xs z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-white/10"
                  onClick={e => e.stopPropagation()}
                >
                  {activeMenuTab === 'main' && (
                    <div className="space-y-1 pb-2">
                      <div className="font-bold text-white text-xs px-2 py-1">Playback Settings</div>

                      <button
                        onClick={() => setActiveMenuTab('subtitles')}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Subtitles className="w-4 h-4" />
                          Subtitles
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {selectedSubtitle === 'off' ? 'Off' : selectedSubtitle.replace('sub-', '').toUpperCase()}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveMenuTab('audio')}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Radio className="w-4 h-4" />
                          Audio Track
                        </span>
                        <span className="text-[11px] text-text-muted">Original (5.1)</span>
                      </button>

                      <button
                        onClick={() => setActiveMenuTab('speed')}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Tv className="w-4 h-4" />
                          Speed
                        </span>
                        <span className="text-[11px] text-text-muted">{playbackSpeed}x</span>
                      </button>

                      <button
                        onClick={() => setActiveMenuTab('quality')}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Quality
                        </span>
                        <span className="text-[11px] text-text-muted">{selectedQuality}</span>
                      </button>
                    </div>
                  )}

                  {/* Subtitles Submenu */}
                  {activeMenuTab === 'subtitles' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-2 py-1 font-bold text-white">
                        <span>Subtitles</span>
                        <button onClick={() => setActiveMenuTab('main')} className="text-text-muted hover:text-white">
                          &larr; Back
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSubtitle('off');
                          setShowSettingsMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                      >
                        <span>Off</span>
                        {selectedSubtitle === 'off' && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                      </button>
                      {media.subtitles.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubtitle(sub.id);
                            setShowSettingsMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                        >
                          <span>{sub.label}</span>
                          {selectedSubtitle === sub.id && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Audio Submenu */}
                  {activeMenuTab === 'audio' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-2 py-1 font-bold text-white">
                        <span>Audio Track</span>
                        <button onClick={() => setActiveMenuTab('main')} className="text-text-muted hover:text-white">
                          &larr; Back
                        </button>
                      </div>
                      {media.audioTracks.map(aud => (
                        <button
                          key={aud.id}
                          onClick={() => {
                            setSelectedAudio(aud.id);
                            setShowSettingsMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                        >
                          <span>{aud.label}</span>
                          {selectedAudio === aud.id && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Speed Submenu */}
                  {activeMenuTab === 'speed' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-2 py-1 font-bold text-white">
                        <span>Playback Speed</span>
                        <button onClick={() => setActiveMenuTab('main')} className="text-text-muted hover:text-white">
                          &larr; Back
                        </button>
                      </div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            if (videoRef.current) videoRef.current.playbackRate = speed;
                            setShowSettingsMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                        >
                          <span>{speed === 1 ? '1x (Normal)' : `${speed}x`}</span>
                          {playbackSpeed === speed && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quality Submenu */}
                  {activeMenuTab === 'quality' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-2 py-1 font-bold text-white">
                        <span>Resolution</span>
                        <button onClick={() => setActiveMenuTab('main')} className="text-text-muted hover:text-white">
                          &larr; Back
                        </button>
                      </div>
                      {['Auto (4K HDR)', '4K Ultra HD', '1080p Full HD', '720p HD'].map(q => (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuality(q);
                            setShowSettingsMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                        >
                          <span>{q}</span>
                          {selectedQuality === q && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-text-secondary hover:text-white transition-colors"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
