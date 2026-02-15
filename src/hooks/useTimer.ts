import { useState, useEffect, useCallback, useRef } from 'react';
import { TestConfig } from '../types';

interface UseTimerProps {
  config: TestConfig;
  isActive: boolean;
  onTimeUp?: () => void;
}

export const useTimer = ({ config, isActive, onTimeUp }: UseTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Use ref to avoid recreating interval on every render
  const onTimeUpRef = useRef(onTimeUp);

  // Keep ref up to date
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Initialize timer based on mode
  useEffect(() => {
    if (config.mode === 'time' && config.duration) {
      setTimeRemaining(config.duration);
    }
  }, [config]);

  // Timer countdown logic
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        console.log('Timer tick:', newTime);
        return newTime;
      });

      if (config.mode === 'time') {
        setTimeRemaining(prev => {
          const newTime = prev - 1;

          // Time's up!
          if (newTime <= 0) {
            clearInterval(interval);
            if (onTimeUpRef.current) onTimeUpRef.current();
            return 0;
          }

          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, config.mode]); // Removed onTimeUp from dependencies!

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeRemaining,
    elapsedTime,
    formatTime,
  };
};
