import { useState, useCallback, useEffect } from 'react';
import { isVowel, isConsonant, calculateWPM } from '../utils/calculations';
import { Multipliers, ComboState } from '../types';

interface UseTypingTestProps {
  text: string;
  targetScore: number;
  purchasedUpgradeIds: number[]; // Array of purchased upgrade IDs
  onComplete: (finalScore: number, elapsedSeconds: number) => void;
}

export const useTypingTest = ({ text, targetScore, purchasedUpgradeIds, onComplete }: UseTypingTestProps) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>(new Array(text.length).fill(''));
  const [score, setScore] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lastMistake, setLastMistake] = useState(false); // For UI feedback (red flash)
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // New: Multiplier system
  const [multipliers, setMultipliers] = useState<Multipliers>({
    base: 1,
    vowel: 1,
    consonant: 1,
    combo: 1,
  });

  // New: WPM tracking (rolling 20 character buffer)
  const [charTimestamps, setCharTimestamps] = useState<number[]>([]);
  const [currentWPM, setCurrentWPM] = useState(0);

  // New: Combo system
  const [comboState, setComboState] = useState<ComboState>({
    isActive: false,
    multiplier: 1,
    threshold: 0,
    noBreak: false,
    availableThresholds: [],
  });

  // Combo reset counter - requires 20 correct chars after mistake
  const [comboResetCounter, setComboResetCounter] = useState(20);

  // Dev mode - any key = correct, backspace = incorrect
  const [devMode, setDevMode] = useState(false);

  // Update multipliers and combo state based on purchased upgrades
  useEffect(() => {
    const newMultipliers: Multipliers = { base: 1, vowel: 1, consonant: 1, combo: 1 };
    const comboThresholds: { wpm: number; multiplier: number }[] = [];
    let noBreak = false;

    purchasedUpgradeIds.forEach(id => {
      switch (id) {
        case 1: // Vowel Power (2x)
          newMultipliers.vowel = 2;
          break;
        case 2: // Consonant Boost (2x)
          newMultipliers.consonant = 2;
          break;
        case 3: // Keyboard Upgrade I (base 1 → 3)
          newMultipliers.base = 3;
          break;
        case 4: // Vowel Mastery (3x)
          newMultipliers.vowel = 3;
          break;
        case 5: // Consonant Mastery (3x)
          newMultipliers.consonant = 3;
          break;
        case 6: // Combo System (3x at 60 WPM)
          comboThresholds.push({ wpm: 60, multiplier: 3 });
          break;
        case 10: // Keyboard Upgrade II (base 5 → 20)
          newMultipliers.base = 20;
          break;
        case 7: // Combo Efficiency (3x at 40 WPM)
          comboThresholds.push({ wpm: 40, multiplier: 3 });
          break;
        case 8: // Speed Demon (5x at 80 WPM)
          comboThresholds.push({ wpm: 80, multiplier: 5 });
          break;
        case 9: // Unbreakable Focus (no combo break)
          noBreak = true;
          break;
      }
    });

    setMultipliers(newMultipliers);
    setComboState(prev => ({
      ...prev,
      availableThresholds: comboThresholds.sort((a, b) => b.multiplier - a.multiplier), // Highest multiplier first
      noBreak,
    }));
  }, [purchasedUpgradeIds]);

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

    // Toggle dev mode with "|"
    if (key === '|') {
      setDevMode(prev => !prev);
      console.log(devMode ? '[DEV MODE] Disabled' : '[DEV MODE] Enabled - Any key = correct, Backspace = incorrect');
      return;
    }

    // Handle backspace
    if (key === 'Backspace') {
      // In dev mode, backspace = mistake (don't actually delete)
      if (devMode) {
        setTotalMistakes(prev => prev + 1);
        setLastMistake(true);
        setTimeout(() => setLastMistake(false), 300);

        // Break combo and reset counter unless noBreak upgrade is active
        if (!comboState.noBreak) {
          setComboState(prev => ({ ...prev, isActive: false, multiplier: 1 }));
          setComboResetCounter(0);
        }
        return;
      }

      // Normal backspace behavior
      if (currentCharIndex > 0) {
        const prevIndex = currentCharIndex - 1;

        // Clear the previous character
        const newTypedChars = [...typedChars];
        newTypedChars[prevIndex] = '';
        setTypedChars(newTypedChars);

        // Move back one position
        setCurrentCharIndex(prevIndex);

        // Break combo and reset counter unless noBreak upgrade is active
        if (!comboState.noBreak) {
          setComboState(prev => ({ ...prev, isActive: false, multiplier: 1 }));
          setComboResetCounter(0); // Require 20 correct chars before combo can reactivate
        }
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
    newTypedChars[currentCharIndex] = devMode ? expectedChar : key; // In dev mode, always store correct char
    setTypedChars(newTypedChars);

    const isCorrect = devMode || key === expectedChar; // In dev mode, always correct

    if (isCorrect) {
      // Increment combo reset counter (max 20)
      setComboResetCounter(prev => Math.min(20, prev + 1));

      // Update WPM tracking (rolling 20 character buffer)
      const now = Date.now();
      const updatedTimestamps = [...charTimestamps, now];
      if (updatedTimestamps.length > 20) {
        updatedTimestamps.shift(); // Keep only last 20
      }
      setCharTimestamps(updatedTimestamps);

      // Calculate current WPM
      const wpm = calculateWPM(updatedTimestamps);
      setCurrentWPM(wpm);

      // Check combo activation based on WPM (only if reset counter is full)
      if (comboState.availableThresholds.length > 0 && comboResetCounter >= 20) {
        // Find the highest multiplier combo that we qualify for
        const activeCombo = comboState.availableThresholds.find(
          threshold => wpm >= threshold.wpm
        );

        if (activeCombo) {
          setComboState(prev => ({
            ...prev,
            isActive: true,
            multiplier: activeCombo.multiplier,
            threshold: activeCombo.wpm,
          }));
        } else {
          // WPM too low, deactivate combo
          setComboState(prev => ({
            ...prev,
            isActive: false,
            multiplier: 1,
          }));
        }
      } else if (comboResetCounter < 20) {
        // Still in reset period, keep combo inactive
        setComboState(prev => ({
          ...prev,
          isActive: false,
          multiplier: 1,
        }));
      }

      // Calculate score using new formula: Base × Key Multiplier × Combo Multiplier
      let keyMultiplier = 1;
      if (isVowel(expectedChar)) {
        keyMultiplier = multipliers.vowel;
      } else if (isConsonant(expectedChar)) {
        keyMultiplier = multipliers.consonant;
      }

      const activeComboMultiplier = comboState.isActive ? comboState.multiplier : 1;
      const points = multipliers.base * keyMultiplier * activeComboMultiplier;

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
      // Incorrect character - NO score penalty, but break combo and track mistake
      setTotalMistakes(prev => prev + 1);

      // Trigger red flash animation
      setLastMistake(true);
      setTimeout(() => setLastMistake(false), 300);

      // Break combo and reset counter unless noBreak upgrade is active
      if (!comboState.noBreak) {
        setComboState(prev => ({ ...prev, isActive: false, multiplier: 1 }));
        setComboResetCounter(0); // Require 20 correct chars before combo can reactivate
      }
    }

    // Always move to next character
    const nextIndex = currentCharIndex + 1;
    setCurrentCharIndex(nextIndex);
  }, [
    isActive,
    currentCharIndex,
    text,
    typedChars,
    targetScore,
    startTime,
    onComplete,
    multipliers,
    comboState,
    charTimestamps,
    comboResetCounter,
    devMode,
  ]);

  return {
    currentCharIndex,
    typedChars,
    score,
    totalMistakes,
    isActive,
    lastMistake, // For red flash on mistakes
    elapsedTime,
    startTest,
    handleKeyPress,
    adjustScore,
    expectedText: text,
    // New: Multiplier and combo info for UI
    multipliers,
    comboState,
    currentWPM,
    devMode,
  };
};
