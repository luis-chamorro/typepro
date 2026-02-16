/**
 * Game utility functions for scoring and calculations
 */

/**
 * Check if a character is a vowel
 */
export const isVowel = (char: string): boolean => {
  return 'aeiouAEIOU'.includes(char);
};

/**
 * Check if a character is a consonant (letter but not vowel)
 */
export const isConsonant = (char: string): boolean => {
  return /[a-zA-Z]/.test(char) && !isVowel(char);
};

/**
 * Calculate WPM from a list of character timestamps
 * @param timestamps - Array of timestamps (in milliseconds) for recent characters
 * @returns Current WPM, or 0 if not enough data
 */
export const calculateWPM = (timestamps: number[]): number => {
  if (timestamps.length < 2) return 0;

  // Calculate time span from oldest to newest timestamp
  const timeSpanMs = timestamps[timestamps.length - 1] - timestamps[0];
  const timeSpanMinutes = timeSpanMs / 60000;

  if (timeSpanMinutes === 0) return 0;

  // Calculate characters per minute
  const charsPerMinute = timestamps.length / timeSpanMinutes;

  // Convert to words per minute (assuming 5 characters per word)
  const wpm = charsPerMinute / 5;

  return Math.round(wpm);
};
