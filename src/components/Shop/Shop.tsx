import React from 'react';
import styles from './Shop.module.css';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  isPurchased: boolean;
}

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  upgrades: Upgrade[];
  currentScore: number;
  onPurchase: (upgradeId: string) => void;
}

const Shop: React.FC<ShopProps> = ({ isOpen, onClose, upgrades, currentScore, onPurchase }) => {
  if (!isOpen) return null;

  const canAfford = (cost: number) => currentScore >= cost;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header with close button */}
        <div className={styles.header}>
          <h2 className={styles.title}>SHOP</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Current score display */}
        <div className={styles.scoreInfo}>
          YOUR SCORE: {currentScore}
        </div>

        {/* Upgrades list */}
        <div className={styles.upgradeList}>
          {upgrades.map((upgrade) => (
            <div
              key={upgrade.id}
              className={`${styles.upgradeCard} ${upgrade.isPurchased ? styles.purchased : ''}`}
            >
              <div className={styles.upgradeContent}>
                <h3 className={styles.upgradeName}>{upgrade.name}</h3>
                <p className={styles.upgradeDescription}>{upgrade.description}</p>
                <div className={styles.upgradeCost}>Cost: {upgrade.cost} points</div>
              </div>

              {upgrade.isPurchased ? (
                <div className={styles.checkmark}>✓</div>
              ) : (
                <button
                  className={`${styles.buyButton} ${!canAfford(upgrade.cost) ? styles.disabled : ''}`}
                  onClick={() => onPurchase(upgrade.id)}
                  disabled={!canAfford(upgrade.cost)}
                >
                  BUY
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
