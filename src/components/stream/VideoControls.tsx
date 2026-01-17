import { IconButton } from '../shared/IconButton';
import './styles.css';

interface VideoControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onSeek: (time: number) => void;
  onFullscreen?: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const RewindIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 19 2 12 11 5 11 19" />
    <polygon points="22 19 13 12 22 5 22 19" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const ForwardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 19 22 12 13 5 13 19" />
    <polygon points="2 19 11 12 2 5 2 19" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const MoreVertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export function VideoControls({
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeekForward,
  onSeekBackward,
  onSeek,
  onFullscreen,
}: VideoControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    onSeek(newTime);
  };

  return (
    <div className="video-controls glass glass-noise animate-fade-in-up">
      <div className="controls-left">
        <IconButton variant="ghost" size="sm" onClick={onSeekBackward} title="Rewind 10s">
          <RewindIcon />
        </IconButton>
        <IconButton variant="solid" size="md" onClick={onPlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <IconButton variant="ghost" size="sm" onClick={onSeekForward} title="Forward 10s">
          <ForwardIcon />
        </IconButton>
      </div>

      <div className="controls-center">
        <span className="time-current">{formatTime(currentTime)}</span>
        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <div className="progress-handle" style={{ left: `${progress}%` }} />
          </div>
        </div>
        <span className="time-duration">{formatTime(duration)}</span>
      </div>

      <div className="controls-right">
        <IconButton variant="ghost" size="sm" title="Chat">
          <ChatIcon />
        </IconButton>
        <IconButton variant="ghost" size="sm" onClick={onFullscreen} title="Fullscreen">
          <FullscreenIcon />
        </IconButton>
        <IconButton variant="ghost" size="sm" title="More options">
          <MoreVertIcon />
        </IconButton>
      </div>
    </div>
  );
}
