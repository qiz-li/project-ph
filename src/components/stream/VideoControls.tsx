import './controls-glass.css';

interface VideoControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onFullscreen?: () => void;
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function VideoControls({
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
  onFullscreen,
}: VideoControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekBackward = () => {
    onSeek(Math.max(0, currentTime - 10));
  };

  const handleSeekForward = () => {
    onSeek(Math.min(duration, currentTime + 10));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    onSeek(percentage * duration);
  };

  return (
    <div className="controls-glass">
      {/* Glass background layers */}
      <div className="controls-glass-bg" />
      <div className="controls-glass-surface" />
      <div className="controls-glass-highlight" />

      {/* Content */}
      <div className="controls-content">
        {/* Left: Playback controls */}
        <div className="controls-playback">
          <button
            className="controls-btn controls-btn--skip"
            onClick={handleSeekBackward}
            aria-label="Rewind 10 seconds"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="11 19 2 12 11 5 11 19" />
              <polygon points="22 19 13 12 22 5 22 19" />
            </svg>
          </button>

          <button
            className="controls-btn controls-btn--play"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className="controls-btn-bg" />
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4.5l14 7.5-14 7.5V4.5z" />
              </svg>
            )}
          </button>

          <button
            className="controls-btn controls-btn--skip"
            onClick={handleSeekForward}
            aria-label="Forward 10 seconds"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="13 19 22 12 13 5 13 19" />
              <polygon points="2 19 11 12 2 5 2 19" />
            </svg>
          </button>
        </div>

        {/* Center: Progress bar */}
        <div className="controls-progress-section">
          <span className="controls-time">{formatTime(currentTime)}</span>

          <div className="controls-progress" onClick={handleProgressClick}>
            <div className="controls-progress-track">
              <div
                className="controls-progress-fill"
                style={{ width: `${progress}%` }}
              />
              <div
                className="controls-progress-handle"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          <span className="controls-time controls-time--dim">{formatTime(duration)}</span>
        </div>

        {/* Right: Action buttons */}
        <div className="controls-actions">
          <button className="controls-btn controls-btn--action" aria-label="Chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <button
            className="controls-btn controls-btn--action"
            onClick={onFullscreen}
            aria-label="Fullscreen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>

          <button className="controls-btn controls-btn--action" aria-label="More options">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
