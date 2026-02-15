import React from 'react';
import styles from './PixelTypewriter.module.css';

interface PixelTypewriterProps {
  greyed?: boolean;
  activeKey?: string;
}

const PixelTypewriter: React.FC<PixelTypewriterProps> = ({ greyed = false, activeKey = '' }) => {
  const getKeyClassName = (key: string) => {
    const isActive = activeKey === key;
    return `${styles.key} ${isActive ? styles.keyPressed : ''}`;
  };

  const getSpaceBarClassName = () => {
    const isActive = activeKey === 'SPACE';
    return `${styles.spaceBar} ${isActive ? styles.keyPressed : ''}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.typewriter}>
        <div className={styles.paper}></div>
        <div className={styles.body}>
          <div className={styles.roller}></div>
          <div className={`${styles.keyboard} ${greyed ? styles.greyed : ''}`}>
            {/* Simplified keyboard representation */}
            <div className={styles.keyRow}>
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
                <div key={key} className={getKeyClassName(key)}>{key}</div>
              ))}
            </div>
            <div className={styles.keyRow}>
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
                <div key={key} className={getKeyClassName(key)}>{key}</div>
              ))}
            </div>
            <div className={styles.keyRow}>
              {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => (
                <div key={key} className={getKeyClassName(key)}>{key}</div>
              ))}
            </div>
            <div className={styles.keyRow}>
              <div className={getSpaceBarClassName()}>SPACE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelTypewriter;
