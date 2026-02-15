// Game state types
export type GameState = 'welcome' | 'countdown' | 'typing' | 'results';

// Test mode types
export type TestMode = 'time' | 'words';

// Time duration options (in seconds)
export type TimeDuration = 30 | 60 | 120;

// Word count options
export type WordCount = 25 | 50 | 100;

// Test configuration
export interface TestConfig {
  mode: TestMode;
  duration?: TimeDuration;  // For time mode
  wordCount?: WordCount;    // For words mode
}

// Test results
export interface TestResult {
  wpm: number;              // Words per minute
  rawWpm: number;           // WPM before penalty
  accuracy: number;         // Percentage (0-100)
  strikes: number;          // Number of incorrect words
  timeElapsed: number;      // Time in seconds
  totalWords: number;       // Total words typed
  correctWords: number;     // Correctly typed words
  incorrectWords: number;   // Incorrectly typed words
}

// Typing state
export interface TypingState {
  currentWordIndex: number;
  currentInput: string;
  completedWords: string[];
  wordStatuses: ('correct' | 'incorrect' | 'pending')[];
  strikes: number;
  startTime: number | null;
  endTime: number | null;
}
