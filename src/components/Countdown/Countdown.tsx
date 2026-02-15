import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      // Show "GO!" for a brief moment before transitioning
      const goTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(goTimer);
    }

    // Countdown from 5 to 1
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.countdownBox}>
        {count > 0 ? (
          <div className={styles.number} key={count}>
            {count}
          </div>
        ) : (
          <div className={styles.go} key="go">
            GO!
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;
