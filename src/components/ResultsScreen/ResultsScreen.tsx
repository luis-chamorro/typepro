import React from 'react';
import { TestResult, TestConfig } from '../../types';
import styles from './ResultsScreen.module.css';

interface ResultsScreenProps {
  results: TestResult;
  config: TestConfig;
  onGoBack: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, config, onGoBack }) => {
  // Determine performance level
  const getPerformanceLevel = () => {
    if (results.wpm >= 80) return 'Excellent';
    if (results.wpm >= 60) return 'Great';
    if (results.wpm >= 40) return 'Good';
    if (results.wpm >= 20) return 'Fair';
    return 'Keep Practicing';
  };

  const getPerformanceEmoji = () => {
    if (results.wpm >= 80) return '⚡';
    if (results.wpm >= 60) return '🔥';
    if (results.wpm >= 40) return '👍';
    if (results.wpm >= 20) return '💪';
    return '📝';
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Title */}
        <h1 className={styles.title}>Test Complete!</h1>

        {/* Performance Badge */}
        <div className={styles.badge}>
          <div className={styles.emoji}>{getPerformanceEmoji()}</div>
          <div className={styles.level}>{getPerformanceLevel()}</div>
        </div>

        {/* Main WPM Display */}
        <div className={styles.wpmSection}>
          <div className={styles.wpmLabel}>Words Per Minute</div>
          <div className={styles.wpmValue}>{results.wpm}</div>
          {results.wpm !== results.rawWpm && (
            <div className={styles.wpmNote}>
              (Raw: {results.rawWpm} - {results.strikes} strike penalty)
            </div>
          )}
        </div>

        {/* Statistics Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Accuracy</div>
            <div className={styles.statValue}>{results.accuracy}%</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statLabel}>Strikes</div>
            <div className={styles.statValue}>{results.strikes}</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statLabel}>Time</div>
            <div className={styles.statValue}>
              {Math.floor(results.timeElapsed / 60)}:{(results.timeElapsed % 60)
                .toString()
                .padStart(2, '0')}
            </div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statLabel}>
              {config.mode === 'time' ? 'Words Typed' : 'Words'}
            </div>
            <div className={styles.statValue}>
              {results.correctWords}/{results.totalWords}
            </div>
          </div>
        </div>

        {/* Go Back Button */}
        <button className={styles.backButton} onClick={onGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
