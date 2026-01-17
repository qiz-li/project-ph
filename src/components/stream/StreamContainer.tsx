import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { ReactNode } from 'react';
import './styles.css';

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
}

export interface StreamContainerRef {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  seekForward: (seconds: number) => void;
  seekBackward: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
}

interface StreamContainerProps {
  children: ReactNode;
  youtubeId?: string;
  videoSrc?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onStateChange?: (isPlaying: boolean) => void;
}

export const StreamContainer = forwardRef<StreamContainerRef, StreamContainerProps>(
  ({ children, youtubeId, videoSrc, onTimeUpdate, onStateChange }, ref) => {
    const playerRef = useRef<YouTubePlayer | null>(null);
    const intervalRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      seekTo: (seconds: number) => playerRef.current?.seekTo(seconds, true),
      seekForward: (seconds: number) => {
        if (playerRef.current) {
          const current = playerRef.current.getCurrentTime();
          playerRef.current.seekTo(current + seconds, true);
        }
      },
      seekBackward: (seconds: number) => {
        if (playerRef.current) {
          const current = playerRef.current.getCurrentTime();
          playerRef.current.seekTo(Math.max(0, current - seconds), true);
        }
      },
      getCurrentTime: () => playerRef.current?.getCurrentTime() ?? 0,
      getDuration: () => playerRef.current?.getDuration() ?? 0,
      isPlaying: () => playerRef.current?.getPlayerState() === window.YT?.PlayerState?.PLAYING,
    }));

    useEffect(() => {
      if (!youtubeId) return;

      // Load YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            showinfo: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            loop: 1,
            playlist: youtubeId,
          },
          events: {
            onReady: (event) => {
              event.target.playVideo();
              // Start time update interval
              intervalRef.current = window.setInterval(() => {
                if (playerRef.current && onTimeUpdate) {
                  const currentTime = playerRef.current.getCurrentTime();
                  const duration = playerRef.current.getDuration();
                  onTimeUpdate(currentTime, duration);
                }
              }, 500);
            },
            onStateChange: (event) => {
              if (onStateChange) {
                onStateChange(event.data === window.YT.PlayerState.PLAYING);
              }
            },
          },
        });
      };

      // If API already loaded
      if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [youtubeId, onTimeUpdate, onStateChange]);

    return (
      <div className="stream-container">
        <div className="stream-video-wrapper">
          {youtubeId ? (
            <div className="youtube-container">
              <div id="youtube-player" className="youtube-embed" />
            </div>
          ) : videoSrc ? (
            <video
              className="stream-video"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="stream-video-placeholder">
              <div className="field-lines">
                <div className="field-center-circle" />
                <div className="field-center-line" />
                <div className="field-penalty-left" />
                <div className="field-penalty-right" />
                <div className="field-goal-left" />
                <div className="field-goal-right" />
              </div>
            </div>
          )}
          <div className="stream-overlay">{children}</div>
        </div>
      </div>
    );
  }
);

StreamContainer.displayName = 'StreamContainer';
