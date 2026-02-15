import React, { useRef, useEffect } from 'react';
import PixelTypewriter from '../PixelTypewriter/PixelTypewriter';
import { TestConfig, TestResult } from '../../types';
import { useTypingTest } from '../../hooks/useTypingTest';
import { useTimer } from '../../hooks/useTimer';
import { calculateWPM, calculateAccuracy, applyStrikePenalty } from '../../utils/calculations';
import styles from './TypingChallenge.module.css';

interface TypingChallengeProps {
  config: TestConfig;
  text: string;
  words: string[];
  isCountingDown?: boolean;
  onComplete?: (results: TestResult) => void;
}

const TypingChallenge: React.FC<TypingChallengeProps> = ({
  config,
  text,
  words,
  isCountingDown = false,
  onComplete
}) => {
  const handleComplete = () => {
    if (!onComplete) return;

    // Calculate final statistics
    const totalChars = typedChars.filter(char => char !== '').length;
    const correctChars = typedChars.filter(
      (char, index) => char !== '' && char === expectedText[index]
    ).length;

    const accuracy = calculateAccuracy(correctChars, totalChars);
    const rawWPM = calculateWPM(correctChars, Math.max(1, elapsedTime));
    const finalWPM = applyStrikePenalty(rawWPM, strikes);

    const totalWords = text.split(' ').filter(w => w.length > 0).length;
    const completedWords = text
      .slice(0, currentCharIndex)
      .split(' ')
      .filter(w => w.length > 0).length;

    const results: TestResult = {
      wpm: finalWPM,
      rawWpm: rawWPM,
      accuracy,
      strikes,
      timeElapsed: elapsedTime,
      totalWords: totalWords,
      correctWords: completedWords - strikes,
      incorrectWords: strikes,
    };

    onComplete(results);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const textPreviewRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [lastKeyPressed, setLastKeyPressed] = React.useState<string>('');

  const {
    currentCharIndex,
    typedChars,
    strikes,
    shouldShake,
    startTest,
    handleKeyPress,
    expectedText,
    isActive,
  } = useTypingTest({
    text,
    onComplete: handleComplete,
  });

  const { timeRemaining, elapsedTime, formatTime } = useTimer({
    config,
    isActive,
    onTimeUp: handleComplete,
  });

  // Calculate live WPM
  const correctChars = typedChars.filter(
    (char, index) => char !== '' && char === expectedText[index]
  ).length;
  const currentWPM = calculateWPM(correctChars, Math.max(1, elapsedTime));

  // Start test when countdown completes
  useEffect(() => {
    if (!isCountingDown && inputRef.current) {
      startTest();
      inputRef.current.focus();
    }
  }, [isCountingDown, startTest]);

  // Keep input focused
  useEffect(() => {
    if (!isCountingDown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCountingDown]);

  // Auto-scroll text as user types
  useEffect(() => {
    if (cursorRef.current && textPreviewRef.current) {
      const cursorElement = cursorRef.current;
      const container = textPreviewRef.current;

      // Get the position of the cursor relative to container
      const cursorTop = cursorElement.offsetTop;
      const containerHeight = container.clientHeight;
      const lineHeight = parseFloat(getComputedStyle(cursorElement).lineHeight || '32');

      // Scroll to keep cursor in view (centered if possible)
      const scrollTarget = cursorTop - (containerHeight / 2) + (lineHeight / 2);
      container.scrollTop = Math.max(0, scrollTarget);
    }
  }, [currentCharIndex]);

  // Handle key presses for typing and typewriter animation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const key = e.key;

    // Set visual key press for typewriter
    const displayKey = key === ' ' ? 'SPACE' : key.toUpperCase();
    setLastKeyPressed(displayKey);
    setTimeout(() => setLastKeyPressed(''), 100);

    // Handle the actual typing
    handleKeyPress(key);
  };

  const getCharClassName = (index: number) => {
    const hasBeenTyped = typedChars[index] !== '';
    const isCurrent = index === currentCharIndex;

    let className = '';

    if (!hasBeenTyped) {
      className = styles.char; // Untyped - dim
    } else {
      const isCorrect = typedChars[index] === expectedText[index];
      className = isCorrect ? styles.correctChar : styles.incorrectChar;
    }

    // Add current position highlight
    if (isCurrent) {
      className += ` ${styles.currentChar}`;
    }

    return className;
  };

  const getDisplayChar = (index: number) => {
    const hasBeenTyped = typedChars[index] !== '';

    if (!hasBeenTyped) {
      return expectedText[index]; // Show expected character
    }

    return typedChars[index]; // Show what user actually typed
  };

  // Calculate progress for word mode
  const totalWords = config.mode === 'words' ? config.wordCount || 0 : 0;
  const completedWords = text
    .slice(0, currentCharIndex)
    .split(' ')
    .filter(w => w.length > 0).length;

  return (
    <div className={styles.container} onClick={() => inputRef.current?.focus()}>
      {/* Timer/Progress Display - Top Left */}
      {!isCountingDown && (
        <div className={styles.timerDisplay}>
          {config.mode === 'time' ? (
            <>
              <div className={styles.timerLabel}>TIME</div>
              <div className={styles.timerValue}>{formatTime(timeRemaining)}</div>
            </>
          ) : (
            <>
              <div className={styles.timerLabel}>PROGRESS</div>
              <div className={styles.timerValue}>
                {completedWords}/{totalWords}
              </div>
            </>
          )}
        </div>
      )}

      {/* WPM Display - Top Center */}
      {!isCountingDown && elapsedTime > 0 && (
        <div className={styles.wpmDisplay}>
          <div className={styles.wpmLabel}>WPM</div>
          <div className={styles.wpmValue}>{currentWPM}</div>
        </div>
      )}

      {/* Strike Counter - Top Right */}
      {!isCountingDown && (
        <div className={`${styles.strikeCounter} ${shouldShake ? styles.shake : ''}`}>
          STRIKES: {strikes}
        </div>
      )}

      {/* Hidden Input Field */}
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        className={styles.hiddenInput}
        disabled={isCountingDown}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Top section - Text preview */}
      <div className={styles.textSection}>
        <div className={styles.textPreview} ref={textPreviewRef}>
          {text.length > 0 ? (
            text.split('').map((char, index) => (
              <span
                key={index}
                className={getCharClassName(index)}
                ref={index === currentCharIndex ? cursorRef : null}
              >
                {getDisplayChar(index)}
              </span>
            ))
          ) : (
            <span>Loading text...</span>
          )}
        </div>
      </div>

      {/* Bottom section - Typewriter */}
      <div className={styles.typewriterSection}>
        <PixelTypewriter greyed={isCountingDown} activeKey={lastKeyPressed} />
      </div>
    </div>
  );
};

export default TypingChallenge;
