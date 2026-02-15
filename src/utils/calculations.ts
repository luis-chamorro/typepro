/**
 * Calculate Words Per Minute
 * Standard: 5 characters = 1 word
 */
export const calculateWPM = (characters: number, seconds: number): number => {
  if (seconds === 0) return 0;
  const minutes = seconds / 60;
  const words = characters / 5;
  return Math.round(words / minutes);
};

/**
 * Calculate accuracy percentage
 */
export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

/**
 * Apply strike penalty to WPM
 * Each strike reduces WPM by 10%
 */
export const applyStrikePenalty = (rawWPM: number, strikes: number): number => {
  const penaltyPercent = strikes * 0.1;
  const multiplier = Math.max(0, 1 - penaltyPercent);
  return Math.round(rawWPM * multiplier);
};
