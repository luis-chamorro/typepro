import { SENTENCES } from './sentences';

const getRandomSentence = (): string => {
  const randomInt = Math.floor(Math.random() * SENTENCES.length);
  return SENTENCES[randomInt];
}

/**
 * Generate random text for typing game
 * Generates a very large buffer for continuous gameplay
 */
export const generateText = (): string => {
  // Generate a massive paragraph to ensure we never run out
  // 300 sentences = ~15,000 characters = plenty for testing
  const paragraph = [];
  for (let i = 0; i < 300; i++) {
    paragraph.push(getRandomSentence());
  }
  return paragraph.join(" ");
};
