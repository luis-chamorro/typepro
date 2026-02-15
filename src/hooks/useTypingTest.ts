import { useState, useCallback } from 'react';

interface UseTypingTestProps {
  text: string; // Full text including spaces
  onComplete: () => void;
}

export const useTypingTest = ({ text, onComplete }: UseTypingTestProps) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>(new Array(text.length).fill(''));
  const [strikes, setStrikes] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [shouldShake, setShouldShake] = useState(false);

  const startTest = useCallback(() => {
    setIsActive(true);
    setStartTime(Date.now());
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (!isActive) return;

    // Handle backspace
    if (key === 'Backspace') {
      if (currentCharIndex > 0) {
        const prevIndex = currentCharIndex - 1;
        const prevTypedChar = typedChars[prevIndex];
        const prevExpectedChar = text[prevIndex];

        // If removing an incorrect character, decrease strikes
        if (prevTypedChar !== '' && prevTypedChar !== prevExpectedChar) {
          setStrikes(prev => Math.max(0, prev - 1));
        }

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

    if (key !== expectedChar) {
      // Incorrect character - increment strikes and shake
      setStrikes(prev => prev + 1);

      // Trigger shake animation
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 300);
    }

    // Always move to next character
    const nextIndex = currentCharIndex + 1;
    setCurrentCharIndex(nextIndex);

    // Check if test is complete
    if (nextIndex >= text.length) {
      setIsActive(false);
      onComplete();
    }
  }, [isActive, currentCharIndex, text, typedChars, onComplete]);

  return {
    currentCharIndex,
    typedChars,
    strikes,
    isActive,
    startTime,
    shouldShake,
    startTest,
    handleKeyPress,
    expectedText: text,
  };
};
