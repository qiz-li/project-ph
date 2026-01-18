import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProcessingAnimation, ProcessingStatus } from '../components/processing/ProcessingAnimation';
import '../components/processing/processing-glass.css';

const statusMessages = [
  'Initializing neural tracking...',
  'Detecting player positions...',
  'Calibrating POV cameras...',
  'Processing depth mapping...',
  'Synchronizing feeds...',
  'Stream ready',
];

export function ProcessingPage() {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const duration = 4000; // 4 seconds total
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const progressPerStep = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressPerStep;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Update message based on progress
    const messageThresholds = [0, 15, 35, 55, 75, 95];
    const newIndex = messageThresholds.findIndex(
      (threshold, i) =>
        progress >= threshold &&
        (i === messageThresholds.length - 1 || progress < messageThresholds[i + 1])
    );
    if (newIndex !== -1 && newIndex !== messageIndex) {
      setMessageIndex(newIndex);
    }
  }, [progress, messageIndex]);

  useEffect(() => {
    // Navigate to stream when complete
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        navigate(`/stream/${gameId}`);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, navigate, gameId]);

  return (
    <div className="processing-page">
      {/* Full screen neural network background */}
      <div className="processing-canvas-wrapper">
        <ProcessingAnimation />
      </div>

      {/* Centered content overlay */}
      <div className="processing-container">
        <div className="processing-content">
          <header className="processing-header">
            <div className="processing-brand">
              <span className="processing-brand-title">Project Horizon</span>
            </div>
          </header>

          <ProcessingStatus
            progress={progress}
            message={statusMessages[messageIndex]}
          />

          <p className="processing-hint">Preparing immersive experience</p>
        </div>
      </div>
    </div>
  );
}
