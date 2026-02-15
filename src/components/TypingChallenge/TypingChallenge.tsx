import React, { useRef, useEffect, useState } from 'react';
import PixelTypewriter from '../PixelTypewriter/PixelTypewriter';
import Shop, { Upgrade } from '../Shop/Shop';
import { useTypingTest } from '../../hooks/useTypingTest';
import cartIcon from '../../assets/cart.svg';
import styles from './TypingChallenge.module.css';

interface TypingChallengeProps {
  text: string;
  targetScore: number;
  isCountingDown?: boolean;
  onComplete?: (finalScore: number, elapsedSeconds: number) => void;
}

const TypingChallenge: React.FC<TypingChallengeProps> = ({
  text,
  targetScore,
  isCountingDown = false,
  onComplete
}) => {
  const handleComplete = (finalScore: number, elapsedSeconds: number) => {
    if (onComplete) {
      onComplete(finalScore, elapsedSeconds);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const textPreviewRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('');

  // Shop state
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'vowel-boost',
      name: 'Vowel Boost',
      description: 'Vowels (a, e, i, o, u) now give 2 points instead of 1',
      cost: 50,
      isPurchased: false,
    },
  ]);

  // Get list of active upgrade IDs
  const activeUpgrades = upgrades.filter(u => u.isPurchased).map(u => u.id);

  const {
    currentCharIndex,
    typedChars,
    score,
    shouldShake,
    startTest,
    handleKeyPress,
    adjustScore,
    expectedText,
  } = useTypingTest({
    text,
    targetScore,
    activeUpgrades,
    onComplete: handleComplete,
  });

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

  // Shop handlers
  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const handlePurchase = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.isPurchased) return;

    // Check if player can afford it
    if (score < upgrade.cost) return;

    // Deduct cost from score
    adjustScore(-upgrade.cost);

    // Mark upgrade as purchased
    setUpgrades(upgrades.map(u =>
      u.id === upgradeId ? { ...u, isPurchased: true } : u
    ));

    console.log(`Purchased upgrade: ${upgradeId}. Cost: ${upgrade.cost} points.`);
  };

  return (
    <div className={styles.container} onClick={() => inputRef.current?.focus()}>
      {/* Score Display - Top Center (Prominent) */}
      {!isCountingDown && (
        <div className={`${styles.scoreDisplay} ${shouldShake ? styles.shake : ''}`}>
          <div className={styles.scoreLabel}>SCORE</div>
          <div className={styles.scoreValue}>{score}</div>
        </div>
      )}

      {/* Shop Icon - Top Right */}
      {!isCountingDown && (
        <div className={styles.shopIcon} onClick={handleShopToggle}>
          <img src={cartIcon} alt="Shop" className={styles.shopIconImage} />
        </div>
      )}

      {/* Shop Modal */}
      <Shop
        isOpen={isShopOpen}
        onClose={handleShopToggle}
        upgrades={upgrades}
        currentScore={score}
        onPurchase={handlePurchase}
      />

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
