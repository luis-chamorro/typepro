import { Upgrade } from '../types';

/**
 * UPGRADE TREE SYSTEM
 *
 * Scoring Formula: Base × Key Multiplier × Combo Multiplier
 *
 * - Base: Starting value for each keystroke (starts at 1)
 * - Key Multiplier: Vowels and consonants can have different multipliers
 * - Combo Multiplier: Unlocked by maintaining WPM thresholds
 *
 * Costs are calculated for ~1 minute unlock intervals at 100 WPM (~500 chars/min baseline)
 */

export const UPGRADES: Upgrade[] = [
  {
    id: 1,
    name: 'Vowel Power',
    description: 'All vowels give 3× score',
    cost: 50, // ~6 seconds at start
    effect: {
      type: 'vowel_multiplier',
      value: 3
    },
    requisiteIds: []
  },
  {
    id: 2,
    name: 'Consonant Boost',
    description: 'All consonants give 3× score',
    cost: 200, // ~17 seconds
    effect: {
      type: 'consonant_multiplier',
      value: 3
    },
    requisiteIds: [1]
  },
  {
    id: 3,
    name: 'Keyboard Upgrade I',
    description: 'All keys are worth more (base 1 → 5)',
    cost: 600, // ~36 seconds
    effect: {
      type: 'base_score',
      value: 5
    },
    requisiteIds: [1]
  },
  {
    id: 4,
    name: 'Vowel Mastery',
    description: 'All vowels give 5× score',
    cost: 1500, // ~30 seconds
    effect: {
      type: 'vowel_multiplier',
      value: 5
    },
    requisiteIds: [1]
  },
  {
    id: 5,
    name: 'Consonant Mastery',
    description: 'All consonants give 5× score',
    cost: 3000, // ~50 seconds
    effect: {
      type: 'consonant_multiplier',
      value: 5
    },
    requisiteIds: [2]
  },
  {
    id: 6,
    name: 'Combo System',
    description: 'Unlocks 3× combo at 60 WPM',
    cost: 6000, // ~80 seconds
    effect: {
      type: 'combo_unlock',
      value: 60 // WPM threshold with multiplier encoded (60 WPM = 3x)
    },
    requisiteIds: [3, 4, 5]
  },
  {
    id: 10,
    name: 'Keyboard Upgrade II',
    description: 'All keys are worth much more (base 5 → 20)',
    cost: 12000, // ~80 seconds with combo
    effect: {
      type: 'base_score',
      value: 20
    },
    requisiteIds: [3]
  },
  {
    id: 7,
    name: 'Combo Efficiency',
    description: '3× combo threshold lowered to 40 WPM',
    cost: 20000, // ~40 seconds
    effect: {
      type: 'combo_threshold',
      value: 40 // Lower threshold for 3x combo
    },
    requisiteIds: [6]
  },
  {
    id: 8,
    name: 'Speed Demon',
    description: 'Unlocks 5× combo at 80 WPM',
    cost: 35000, // ~70 seconds
    effect: {
      type: 'combo_unlock',
      value: 80 // WPM threshold (80 WPM = 5x)
    },
    requisiteIds: [6]
  },
  {
    id: 9,
    name: 'Unbreakable Focus',
    description: 'Mistakes no longer disable combos',
    cost: 50000, // ~67 seconds
    effect: {
      type: 'combo_no_break',
      value: 1
    },
    requisiteIds: [3, 4, 5]
  }
];

/**
 * Helper function to get upgrade by ID
 */
export function getUpgradeById(id: number): Upgrade | undefined {
  return UPGRADES.find(upgrade => upgrade.id === id);
}

/**
 * Check if all prerequisites for an upgrade are met
 */
export function canPurchaseUpgrade(
  upgradeId: number,
  purchasedUpgradeIds: number[]
): boolean {
  const upgrade = getUpgradeById(upgradeId);
  if (!upgrade) return false;

  return upgrade.requisiteIds.every(reqId => purchasedUpgradeIds.includes(reqId));
}

/**
 * Get all upgrades that are currently available to purchase
 */
export function getAvailableUpgrades(
  purchasedUpgradeIds: number[]
): Upgrade[] {
  return UPGRADES.filter(upgrade =>
    !purchasedUpgradeIds.includes(upgrade.id) &&
    canPurchaseUpgrade(upgrade.id, purchasedUpgradeIds)
  );
}

/**
 * Get names of prerequisite upgrades
 */
export function getPrerequisiteNames(upgrade: Upgrade): string[] {
  return upgrade.requisiteIds
    .map(id => getUpgradeById(id)?.name)
    .filter((name): name is string => name !== undefined);
}
