import React from 'react';
import { TestConfig, TimeDuration, WordCount } from '../../types';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onStartTest: (config: TestConfig) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartTest }) => {
  const handleTimeMode = (duration: TimeDuration) => {
    onStartTest({ mode: 'time', duration });
  };

  const handleWordsMode = (wordCount: WordCount) => {
    onStartTest({ mode: 'words', wordCount });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Title */}
        <h1 className={styles.title}>
          <span className={styles.titleGlow}>TypePro</span>
        </h1>
        <p className={styles.subtitle}>Test Your Typing Speed</p>

        {/* Mode Selection */}
        <div className={styles.modesContainer}>
          {/* Time Mode Card */}
          <div className={styles.modeCard}>
            <h2 className={styles.modeTitle}>Time Mode</h2>
            <p className={styles.modeDescription}>
              Type as many words as you can
            </p>
            <div className={styles.optionsContainer}>
              <button
                className={styles.optionButton}
                onClick={() => handleTimeMode(30)}
              >
                30s
              </button>
              <button
                className={styles.optionButton}
                onClick={() => handleTimeMode(60)}
              >
                60s
              </button>
              <button
                className={styles.optionButton}
                onClick={() => handleTimeMode(120)}
              >
                120s
              </button>
            </div>
          </div>

          {/* Word Count Mode Card */}
          <div className={styles.modeCard}>
            <h2 className={styles.modeTitle}>Word Mode</h2>
            <p className={styles.modeDescription}>
              Type a fixed number of words
            </p>
            <div className={styles.optionsContainer}>
              <button
                className={styles.optionButton}
                onClick={() => handleWordsMode(25)}
              >
                25 words
              </button>
              <button
                className={styles.optionButton}
                onClick={() => handleWordsMode(50)}
              >
                50 words
              </button>
              <button
                className={styles.optionButton}
                onClick={() => handleWordsMode(100)}
              >
                100 words
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
