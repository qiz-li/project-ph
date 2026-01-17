import { useState, useRef, useCallback, useEffect } from 'react';
import { StreamContainer } from './components/stream/StreamContainer';
import type { StreamContainerRef } from './components/stream/StreamContainer';
import { PenaltyScoreOverlay } from './components/stream/PenaltyScoreOverlay';
import { LiveBadge } from './components/stream/LiveBadge';
import { VideoControls } from './components/stream/VideoControls';
import { PlayerCard } from './components/player/PlayerCard';
import { POVVideoOverlay } from './components/player/POVVideoOverlay';
import type { Player } from './types';
import brunoVideo from './assets/bruno.mov';
import './App.css';

// Penalty shootout data - FA Cup 2024/25: Man United vs Arsenal
const penaltyData = {
  homeTeam: {
    name: 'Manchester United',
    shortName: 'MUN',
    flag: '🔴',
    color: '#DA291C',
  },
  awayTeam: {
    name: 'Arsenal',
    shortName: 'ARS',
    flag: '🔴',
    color: '#EF0107',
  },
  homePenalties: {
    scored: 0,
    taken: 0,
    saved: 0,
  },
  awayPenalties: {
    scored: 0,
    taken: 0,
    saved: 0,
  },
  currentRound: 1,
  isHomeTurn: true,
};

// Penalty-specific players - FA Cup 2024/25: Bruno vs Raya (First penalty)
const penaltyPlayers: Player[] = [
  {
    id: 'goalkeeper',
    name: 'David Raya',
    number: 22,
    position: 'Goalkeeper',
    team: 'away',
    teamColor: '#EF0107',
    avatar: '',
    stats: {
      passes: 0,
      passAccuracy: 0,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 0,
      distance: 0.2,
      speed: 0,
      sprints: 0,
    },
    fieldPosition: { x: 15, y: 50 },
  },
  {
    id: 'penalty-taker',
    name: 'Bruno Fernandes',
    number: 8,
    position: 'Penalty Taker',
    team: 'home',
    teamColor: '#DA291C',
    avatar: '',
    stats: {
      passes: 0,
      passAccuracy: 0,
      shots: 1,
      shotsOnTarget: 0,
      tackles: 0,
      distance: 0.1,
      speed: 0,
      sprints: 0,
    },
    fieldPosition: { x: 30, y: 50 },
  },
  {
    id: 'referee',
    name: 'A. Taylor',
    number: 0,
    position: 'Referee',
    team: 'home',
    teamColor: '#FFD700',
    avatar: '',
    stats: {
      passes: 0,
      passAccuracy: 0,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 0,
      distance: 1.8,
      speed: 11.2,
      sprints: 2,
    },
    fieldPosition: { x: 50, y: 30 },
  },
];

// Initial card positions on screen
const initialCardPositions: Record<string, { x: number; y: number }> = {
  'referee': { x: 24, y: 120 },
  'penalty-taker': { x: 24, y: 450 },
  'goalkeeper': { x: 1100, y: 180 },
};

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [cardPositions, setCardPositions] = useState(initialCardPositions);
  const [dragging, setDragging] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const streamRef = useRef<StreamContainerRef>(null);

  const handleMouseDown = (e: React.MouseEvent, playerId: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).closest('.player-card-wrapper')?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setDragging(playerId);
    }
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCardPositions((prev) => ({
        ...prev,
        [dragging]: {
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        },
      }));
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleTimeUpdate = useCallback((time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);
  }, []);

  const handleStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      streamRef.current?.pause();
    } else {
      streamRef.current?.play();
    }
  };

  const handleSeek = (time: number) => {
    streamRef.current?.seekTo(time);
  };

  const handleFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  const handlePlayerExpand = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleCloseOverlay = () => {
    setSelectedPlayer(null);
  };

  return (
    <div className="app">
      <StreamContainer
        ref={streamRef}
        videoSrc={brunoVideo}
        onTimeUpdate={handleTimeUpdate}
        onStateChange={handleStateChange}
      >
        <PenaltyScoreOverlay
          homeTeam={penaltyData.homeTeam}
          awayTeam={penaltyData.awayTeam}
          homePenalties={penaltyData.homePenalties}
          awayPenalties={penaltyData.awayPenalties}
          currentRound={penaltyData.currentRound}
          isHomeTurn={penaltyData.isHomeTurn}
        />

        <LiveBadge />

        {/* POV Player Cards */}
        {penaltyPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`player-card-wrapper ${dragging === player.id ? 'dragging' : ''}`}
            style={{
              left: cardPositions[player.id].x,
              top: cardPositions[player.id].y,
              animationDelay: `${index * 100}ms`,
              cursor: dragging === player.id ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, player.id)}
          >
            <PlayerCard
              player={player}
              onExpand={handlePlayerExpand}
            />
          </div>
        ))}

        <VideoControls
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onFullscreen={handleFullscreen}
        />
      </StreamContainer>

      {/* POV Video Overlay */}
      {selectedPlayer && (
        <POVVideoOverlay
          player={selectedPlayer}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}

export default App;
