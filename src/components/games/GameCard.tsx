import { useNavigate } from 'react-router-dom';
import './games-glass.css';

export interface Game {
  id: string;
  homeTeam: {
    name: string;
    shortName: string;
    color: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    color: string;
  };
  competition: string;
  competitionShort: string;
  time: string;
  status: 'live' | 'upcoming' | 'replay';
}

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/processing/${game.id}`);
  };

  return (
    <div
      className="game-card"
      onClick={handleClick}
    >
      <div className="game-card-content">
        {/* Teams - text only */}
        <div className="game-card-teams">
          <div className="game-card-team">
            <span className="game-card-team-name">{game.homeTeam.name}</span>
          </div>

          <div className="game-card-vs">
            <span>v</span>
          </div>

          <div className="game-card-team">
            <span className="game-card-team-name">{game.awayTeam.name}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className="game-card-footer">
          {game.status === 'live' ? (
            <div className="game-card-live">
              <span className="game-card-live-dot" />
              <span className="game-card-live-text">LIVE</span>
            </div>
          ) : game.status === 'replay' ? (
            <div className="game-card-replay">
              <span>REPLAY</span>
            </div>
          ) : (
            <div className="game-card-time">
              <span>{game.time}</span>
            </div>
          )}

          <span className="game-card-sep" />
          <span className="game-card-comp-text">{game.competition}</span>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="game-card-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
