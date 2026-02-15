import { useState, useCallback, useEffect } from 'react';
import { isVowel } from '../utils/calculations';

interface UseTypingTestProps {
  text: string;
  targetScore: number;
  activeUpgrades: string[]; // Array of active upgrade IDs
  onComplete: (finalScore: number, elapsedSeconds: number) => void;
}

export const useTypingTest = ({ text, targetScore, activeUpgrades, onComplete }: UseTypingTestProps) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>(new Array(text.length).fill(''));
  const [score, setScore] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTest = useCallback(() => {
    setIsActive(true);
    setStartTime(Date.now());
  }, []);

  // Method to manually adjust score (for upgrade purchases)
  const adjustScore = useCallback((amount: number) => {
    setScore(prev => Math.max(0, prev + amount));
  }, []);

  // Track elapsed time while active
  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const handleKeyPress = useCallback((key: string) => {
    if (!isActive) return;

    // Handle backspace
    if (key === 'Backspace') {
      if (currentCharIndex > 0) {
        const prevIndex = currentCharIndex - 1;

        // Clear the previous character
        const newTypedChars = [...typedChars];
        newTypedChars[prevIndex] = '';
        setTypedChars(newTypedChars);

        // Move back one position
        setCurrentCharIndex(prevIndex);
      }
      return;
    }

    // Don't allow typing past the end
    if (currentCharIndex >= text.length) return;

    // Ignore modifier keys
    const modifierKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'Enter'];
    if (modifierKeys.includes(key) || key.length > 1) return;

    const expectedChar = text[currentCharIndex];
    const newTypedChars = [...typedChars];
    newTypedChars[currentCharIndex] = key;
    setTypedChars(newTypedChars);

    if (key === expectedChar) {
      // Correct character - calculate points
      let points = 1;

      // Check for vowel boost upgrade
      if (activeUpgrades.includes('vowel-boost') && isVowel(expectedChar)) {
        points = 2;
      }

      // Increment score
      setScore(prev => {
        const newScore = prev + points;

        // Check win condition
        if (newScore >= targetScore) {
          setIsActive(false);
          const finalElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
          onComplete(newScore, finalElapsed);
        }

        return newScore;
      });
    } else {
      // Incorrect character - decrement score (permanent penalty)
      setScore(prev => Math.max(0, prev - 1));
      setTotalMistakes(prev => prev + 1);

      // Trigger shake animation
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 300);
    }

    // Always move to next character
    const nextIndex = currentCharIndex + 1;
    setCurrentCharIndex(nextIndex);
  }, [isActive, currentCharIndex, text, typedChars, targetScore, activeUpgrades, startTime, onComplete]);

  return {
    currentCharIndex,
    typedChars,
    score,
    totalMistakes,
    isActive,
    shouldShake,
    elapsedTime,
    startTest,
    handleKeyPress,
    adjustScore,
    expectedText: text,
  };
};
