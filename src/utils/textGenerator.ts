import { sentence, paragraph } from '@ndaidong/txtgen';
import { TestConfig } from '../types';

/**
 * Generate text based on test configuration
 * For time mode: generate ~200 words (enough for most typing speeds)
 * For word mode: generate exact word count
 */
export const generateText = (config: TestConfig): string => {
  if (config.mode === 'words' && config.wordCount) {
    // Generate text until we have the exact word count
    let words: string[] = [];

    while (words.length < config.wordCount) {
      const newSentence = sentence();
      words = words.concat(newSentence.split(' '));
    }

    // Trim to exact word count
    return words.slice(0, config.wordCount).join(' ');
  } else {
    // For time mode, generate a paragraph with multiple sentences
    // This generates enough text for most typing speeds
    return paragraph(10); // 10 sentences should be plenty
  }
};

/**
 * Split text into words array
 */
export const textToWords = (text: string): string[] => {
  return text.split(' ').filter(word => word.length > 0);
};
