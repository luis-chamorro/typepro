import { paragraph, addTemplates } from '@ndaidong/txtgen';
import { moreSentenceTemplates } from './templates';

addTemplates(moreSentenceTemplates);

/**
 * Generate random text for typing game
 * Generates enough text for continuous gameplay
 */
export const generateText = (): string => {
  // Generate a large paragraph to ensure continuous typing
  return paragraph(15); // 15 sentences for continuous gameplay
};
