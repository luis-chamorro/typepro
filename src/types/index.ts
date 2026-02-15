// Game state types
export type GameState = 'welcome' | 'countdown' | 'playing' | 'completed';

// Upgrade types
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  isActive: boolean;
}

// Game completion data
export interface GameCompletion {
  finalScore: number;
  elapsedSeconds: number;
  scorePerMinute: number;
}
