import React, { useState, useEffect } from 'react';
import TokenStorage from '../utils/tokenStorage';
import './SessionTimer.css';

interface SessionTimerProps {
  onSessionExpired: () => void;
  warningThresholdMinutes?: number;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ 
  onSessionExpired, 
  warningThresholdMinutes = 1 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = TokenStorage.getRemainingTime();
      setTimeRemaining(remaining);

      const remainingMinutes = remaining / (1000 * 60);
      
      if (remaining <= 0) {
        onSessionExpired();
        return;
      }

      if (remainingMinutes <= warningThresholdMinutes && remainingMinutes > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [onSessionExpired, warningThresholdMinutes]);

  const handleExtendSession = () => {
    TokenStorage.extendToken(3); // Extend by 3 more minutes
    setShowWarning(false);
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) {
    return null;
  }

  return (
    <div className="session-timer-overlay">
      <div className="session-timer-modal">
        <div className="session-timer-content">
          <h3>Session Expiring Soon</h3>
          <p>Your session will expire in {formatTime(timeRemaining)}</p>
          <div className="session-timer-actions">
            <button 
              className="extend-session-btn" 
              onClick={handleExtendSession}
            >
              Extend Session
            </button>
            <button 
              className="logout-btn" 
              onClick={onSessionExpired}
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;
