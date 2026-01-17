import { useState, useRef, useCallback } from 'react';
import type { Player } from './types';
import { TopNav } from './components/navigation/TopNav';
import { Sidebar } from './components/navigation/Sidebar';
import { StreamContainer } from './components/stream/StreamContainer';
import type { StreamContainerRef } from './components/stream/StreamContainer';
import { ScoreOverlay } from './components/stream/ScoreOverlay';
import { MatchActions } from './components/stream/MatchActions';
import { CommentaryOverlay } from './components/stream/CommentaryOverlay';
import { VideoControls } from './components/stream/VideoControls';
import { PlayerCard } from './components/player/PlayerCard';
import { PlayerMarker } from './components/player/PlayerMarker';
import { POVVideoOverlay } from './components/player/POVVideoOverlay';
import { mockMatch, mockPlayers, mockCommentaries } from './data/mockData';
import './App.css';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const streamRef = useRef<StreamContainerRef>(null);

  const handlePlayerExpand = (player: Player) => {
    setSelectedPlayer(player);
    setActiveMarkerId(player.id);
  };

  const handleCloseOverlay = () => {
    setSelectedPlayer(null);
    setActiveMarkerId(null);
  };

  const handleMarkerClick = (player: Player) => {
    if (activeMarkerId === player.id) {
      handleCloseOverlay();
    } else {
      handlePlayerExpand(player);
    }
  };

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

  const handleSeekForward = () => {
    streamRef.current?.seekForward(10);
  };

  const handleSeekBackward = () => {
    streamRef.current?.seekBackward(10);
  };

  const handleSeek = (time: number) => {
    streamRef.current?.seekTo(time);
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  // Position player cards around the field
  const playerCardPositions: Record<string, { top: string; left?: string; right?: string }> = {
    'player-001': { top: '20%', right: '100px' },
    'player-002': { top: '45%', left: '100px' },
    'player-003': { top: '15%', right: '280px' },
    'player-004': { top: '60%', left: '100px' },
    'player-005': { top: '55%', right: '100px' },
  };

  return (
    <div className="app">
      <TopNav />
      <Sidebar />

      <StreamContainer
        ref={streamRef}
        youtubeId="PQrekQOY-VY"
        onTimeUpdate={handleTimeUpdate}
        onStateChange={handleStateChange}
      >
        <ScoreOverlay match={mockMatch} />
        <MatchActions />

        {/* Player Markers on Field */}
        <div className="field-markers">
          {mockPlayers.map((player) => (
            <PlayerMarker
              key={player.id}
              player={player}
              isActive={activeMarkerId === player.id}
              onClick={() => handleMarkerClick(player)}
            />
          ))}
        </div>

        {/* Player Cards */}
        {mockPlayers.slice(0, 3).map((player, index) => (
          <div
            key={player.id}
            className="player-card-wrapper"
            style={{
              ...playerCardPositions[player.id],
              animationDelay: `${index * 100}ms`,
            }}
          >
            <PlayerCard
              player={player}
              onExpand={handlePlayerExpand}
            />
          </div>
        ))}

        <CommentaryOverlay commentaries={mockCommentaries} />
        <VideoControls
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSeekForward={handleSeekForward}
          onSeekBackward={handleSeekBackward}
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
