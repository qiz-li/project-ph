import type { Player } from '../../types';
import { IconButton } from '../shared/IconButton';
import './styles.css';

interface POVVideoOverlayProps {
  player: Player;
  onClose: () => void;
  position?: { x: number; y: number };
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function POVVideoOverlay({ player, onClose, position }: POVVideoOverlayProps) {
  const style = position
    ? {
        '--start-x': `${position.x}px`,
        '--start-y': `${position.y}px`,
      } as React.CSSProperties
    : undefined;

  return (
    <div className="pov-overlay animate-scale-pop" style={style}>
      <div className="pov-container glass-heavy glass-noise">
        <div className="pov-header">
          <div className="pov-player-info">
            <div className="pov-avatar">
              {player.avatar ? (
                <img src={player.avatar} alt={player.name} />
              ) : (
                <span>{player.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <span className="pov-player-name">{player.name}</span>
              <span className="pov-player-position">
                #{player.number} · {player.position}
              </span>
            </div>
          </div>
          <div className="pov-live-badge">
            <span className="pov-live-dot" />
            <span>POV CAM</span>
          </div>
          <IconButton variant="glass" size="sm" onClick={onClose} title="Close">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="pov-video">
          <div className="pov-video-placeholder">
            <div className="pov-video-grid" />
            <span className="pov-video-text">Player Camera Feed</span>
          </div>
        </div>
        <div className="pov-stats glass">
          <div className="pov-stat">
            <span className="pov-stat-value">{player.stats.distance}</span>
            <span className="pov-stat-label">km covered</span>
          </div>
          <div className="pov-stat">
            <span className="pov-stat-value">{player.stats.speed}</span>
            <span className="pov-stat-label">km/h top speed</span>
          </div>
          <div className="pov-stat">
            <span className="pov-stat-value">{player.stats.sprints}</span>
            <span className="pov-stat-label">sprints</span>
          </div>
        </div>
      </div>
    </div>
  );
}
