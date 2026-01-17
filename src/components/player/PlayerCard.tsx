import { useState } from 'react';
import type { Player } from '../../types';
import { StatRow } from './StatRow';
import './styles.css';

interface PlayerCardProps {
  player: Player;
  onExpand?: (player: Player) => void;
}

export function PlayerCard({ player, onExpand }: PlayerCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`player-card glass glass-noise glass-card ${isHovered ? 'player-card-hovered' : ''}`}
      style={{ '--team-color': player.teamColor } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onExpand?.(player)}
    >
      <div className="player-card-accent" />
      <div className="player-card-header">
        <div className="player-avatar">
          {player.avatar ? (
            <img src={player.avatar} alt={player.name} />
          ) : (
            <span className="player-avatar-placeholder">{player.name.charAt(0)}</span>
          )}
        </div>
        <div className="player-info">
          <span className="player-name">{player.name}</span>
          <span className="player-position">
            <span className="player-number">#{player.number}</span> · {player.position}
          </span>
        </div>
      </div>
      <div className="player-card-stats">
        <StatRow label="Pass Accuracy" value={player.stats.passAccuracy} unit="%" />
        <StatRow label="Shots" value={`${player.stats.shotsOnTarget}/${player.stats.shots}`} />
      </div>
      <div className="player-card-expand-hint">
        <span>Click to view POV</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </div>
    </div>
  );
}
