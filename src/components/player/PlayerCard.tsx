import { useState } from 'react';
import type { Player } from '../../types';
import './player-glass.css';

interface PlayerCardProps {
  player: Player;
  onExpand?: (player: Player) => void;
}

export function PlayerCard({ player, onExpand }: PlayerCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getRoleLabel = () => {
    if (player.position === 'Goalkeeper') return 'GK';
    if (player.position === 'Penalty Taker') return 'PK';
    if (player.position === 'Referee') return 'REF';
    return player.position.slice(0, 3).toUpperCase();
  };

  const getStatValue = () => {
    if (player.position === 'Goalkeeper') return { label: 'SAVES', value: '0' };
    if (player.position === 'Penalty Taker') return { label: 'GOALS', value: `${player.stats.shotsOnTarget}` };
    if (player.position === 'Referee') return { label: 'CALLS', value: '8' };
    return { label: 'RATING', value: '7.2' };
  };

  const stat = getStatValue();

  return (
    <div
      className={`player-card ${isHovered ? 'player-card--hover' : ''}`}
      style={{ '--player-accent': player.teamColor } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onExpand?.(player)}
    >
      {/* Glass layers */}
      <div className="player-card-glass" />
      <div className="player-card-border" />
      <div className="player-card-accent" />

      {/* Content */}
      <div className="player-card-content">
        {/* POV Video Preview */}
        <div className="player-card-pov">
          <div className="player-card-pov-bg">
            <div className="player-card-pov-grid" />
            <span className="player-card-pov-text">POV</span>
          </div>
          <div className="player-card-pov-live">
            <span className="player-card-pov-dot" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Player Info */}
        <div className="player-card-info">
          <div className="player-card-header">
            <div className="player-card-name-section">
              <span className="player-card-name">{player.name}</span>
              <div className="player-card-meta">
                {player.number > 0 && (
                  <span className="player-card-number">#{player.number}</span>
                )}
                <span className="player-card-role">{getRoleLabel()}</span>
              </div>
            </div>
            <div className="player-card-stat">
              <span className="player-card-stat-value">{stat.value}</span>
              <span className="player-card-stat-label">{stat.label}</span>
            </div>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="player-card-expand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>
      </div>
    </div>
  );
}
