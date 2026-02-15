import React from 'react';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onStartGame: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Title */}
        <h1 className={styles.title}>
          <span className={styles.titleGlow}>TypePro</span>
        </h1>
        <p className={styles.subtitle}>Incremental Typing Game</p>

        {/* Start Button */}
        <button
          className={styles.startButton}
          onClick={onStartGame}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
