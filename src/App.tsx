import { useState, useRef, useCallback } from 'react';
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

// Card positions on screen - positioned relative to players in video
const cardPositions: Record<string, { top?: string; bottom?: string; left?: string; right?: string }> = {
  'referee': { top: '120px', left: '24px' },
  'penalty-taker': { bottom: '80px', left: '24px' },
  'goalkeeper': { top: '180px', right: '24px' },
};

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const streamRef = useRef<StreamContainerRef>(null);

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
            className="player-card-wrapper"
            style={{
              ...cardPositions[player.id],
              animationDelay: `${index * 100}ms`,
            }}
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
