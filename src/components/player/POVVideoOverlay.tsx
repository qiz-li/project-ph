import type { Player } from '../../types';
import './player-glass.css';

interface POVVideoOverlayProps {
  player: Player;
  onClose: () => void;
}

export function POVVideoOverlay({ player, onClose }: POVVideoOverlayProps) {
  const getStats = () => {
    if (player.position === 'Goalkeeper') {
      return [
        { value: '1', label: 'Saves' },
        { value: '87%', label: 'Save Rate' },
        { value: '2.1', label: 'Distance' },
      ];
    }
    if (player.position === 'Penalty Taker') {
      return [
        { value: `${player.stats.shotsOnTarget}`, label: 'Goals' },
        { value: '100%', label: 'Accuracy' },
        { value: '92', label: 'Power' },
      ];
    }
    if (player.position === 'Referee') {
      return [
        { value: '8', label: 'Calls' },
        { value: '2.1', label: 'KM Run' },
        { value: '0', label: 'Cards' },
      ];
    }
    return [
      { value: '7.2', label: 'Rating' },
      { value: `${player.stats.passes}`, label: 'Passes' },
      { value: `${player.stats.distance}`, label: 'KM' },
    ];
  };

  const stats = getStats();

  return (
    <div className="pov-glass">
      <div className="pov-glass-container" style={{ '--player-accent': player.teamColor } as React.CSSProperties}>
        {/* Glass layers */}
        <div className="pov-glass-bg" />
        <div className="pov-glass-surface" />
        <div className="pov-glass-glow" />

        {/* Header */}
        <div className="pov-header">
          <div className="pov-player-info">
            <div className="pov-avatar">
              <span>{player.name.charAt(0)}</span>
            </div>
            <div className="pov-details">
              <span className="pov-player-name">{player.name}</span>
              <span className="pov-player-position">{player.position}</span>
            </div>
          </div>

          <div className="pov-live-badge">
            <span className="pov-live-dot" />
            <span className="pov-live-text">LIVE</span>
          </div>

          <button className="pov-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video */}
        <div className="pov-video">
          <div className="pov-video-placeholder">
            <div className="pov-video-grid" />
            <span className="pov-video-text">POV Camera Feed</span>
          </div>
        </div>

        {/* Stats */}
        <div className="pov-stats">
          {stats.map((stat, index) => (
            <div key={index} className="pov-stat">
              <span className="pov-stat-value">{stat.value}</span>
              <span className="pov-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
