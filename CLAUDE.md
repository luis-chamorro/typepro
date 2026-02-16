# TypePro - Incremental Typing Game

## Project Overview
Retro green terminal-themed incremental typing game built with React + TypeScript. Features exponential multiplier progression, combo system, and 9 upgrades leading to 2,500× score multipliers.

---

## Current Status: ✅ COMPLETE

### All Features Implemented:
1. **Core Game Loop** - Type to earn points with multiplier-based scoring
2. **9-Upgrade System** - Exponential progression with dependency tree
3. **Combo Mechanics** - WPM-based multipliers with strict reset rules
4. **Performance** - Windowed rendering, optimized for 15,000+ characters
5. **Polish** - Visual feedback, animations, dev mode
6. **Win Condition** - 60,000 points (~7-10 minute gameplay)

---

## Game Mechanics

### Scoring Formula
```javascript
Score per keystroke = Base × Key Multiplier × Combo Multiplier
```

**Components:**
- **Base**: 1 → 5 (Keyboard I) → 20 (Keyboard II)
- **Key Multiplier**:
  - Vowels: 1 → 3 → 5
  - Consonants: 1 → 3 → 5
  - Other characters: 1×
- **Combo Multiplier**: 1 → 3 (60 WPM) → 5 (80 WPM)

**Progression Example:**
- Start: 1 × 1 × 1 = 1 pt/char
- Early: 5 × 3 × 1 = 15 pt/char
- Mid: 5 × 5 × 3 = 75 pt/char
- Max: 20 × 5 × 5 = 2,500 pt/char

### Combo System
**Activation:**
- Must have Combo upgrade unlocked
- Type at 60+ WPM (or 40+ with Efficiency upgrade)
- Requires 20 correct characters after ANY mistake/backspace

**Reset Conditions:**
- Any incorrect keystroke → combo breaks, reset counter to 0
- Backspace → combo breaks, reset counter to 0
- Must type 20 correct chars before combo can reactivate
- "Unbreakable Focus" upgrade (ID 9) bypasses reset

**Visual Indicator:**
- Shows "🔥 COMBO 3× 🔥" or "🔥 COMBO 5× 🔥"
- Pulses with green glow animation
- Only visible when combo is active

### Mistakes
- No score penalty (removed -1 system)
- Triggers red screen flash
- Breaks combo (unless Unbreakable Focus)
- Resets combo counter to 0

---

## Upgrade Tree

### Complete Upgrade List

| ID | Name | Cost | Effect | Prerequisites |
|----|------|------|--------|---------------|
| 1 | Vowel Power | 50 | Vowels 3× | — |
| 2 | Consonant Boost | 200 | Consonants 3× | 1 |
| 3 | Keyboard Upgrade I | 600 | Base 1→5 | 1 |
| 4 | Vowel Mastery | 1,500 | Vowels 5× | 1 |
| 5 | Consonant Mastery | 3,000 | Consonants 5× | 2 |
| 6 | Combo System | 6,000 | 3× combo at 60 WPM | 3, 4, 5 |
| 10 | Keyboard Upgrade II | 12,000 | Base 5→20 | 3 |
| 7 | Combo Efficiency | 20,000 | 3× combo at 40 WPM | 6 |
| 8 | Speed Demon | 35,000 | 5× combo at 80 WPM | 6 |
| 9 | Unbreakable Focus | 50,000 | No combo break | 3, 4, 5 |

### Dependency Graph
```
[1] Vowel Power
    ├─→ [2] Consonant Boost
    │       └─→ [5] Consonant Mastery
    ├─→ [3] Keyboard I
    │       ├─→ [10] Keyboard II
    │       └─→ [9] Unbreakable Focus*
    └─→ [4] Vowel Mastery
            └─→ [9] Unbreakable Focus*

[3,4,5] → [6] Combo System
              ├─→ [7] Combo Efficiency
              └─→ [8] Speed Demon

* Requires all three: 3, 4, 5
```

---

## Technical Architecture

### Key Files

#### Hooks (`src/hooks/`)
**`useTypingTest.ts`** - Core game logic
- Manages: score, multipliers, combo state, WPM tracking
- Calculates: scoring formula, combo activation, WPM from rolling buffer
- Handles: keystroke events, mistakes, combo resets
- Parameters: `text`, `targetScore`, `purchasedUpgradeIds[]`, `onComplete`
- Returns: `score`, `comboState`, `currentWPM`, `devMode`, handlers

Key features:
- Rolling 20-character WPM calculation
- Combo reset counter (requires 20 correct after mistake)
- Dev mode toggle with `|` key
- Multiplier state updated from purchased upgrades

#### Components (`src/components/`)

**`WelcomeScreen/`** - Start game button
- Single centered button
- Countdown starts on click

**`Countdown/`** - 5-second countdown overlay
- Full-screen overlay
- Large countdown numbers
- Auto-starts typing after 0

**`TypingChallenge/`** - Main game interface
- Score display (top-center)
- Combo indicator (top-left, only when active)
- Shop icon (top-right)
- Text preview window (windowed rendering)
- Pixel typewriter keyboard (bottom)
- Red flash on mistakes
- Focus restoration on shop close

**`PixelTypewriter/`** - Visual keyboard
- Pixel art keyboard layout
- Key press animations
- Active key highlighting

**`Shop/`** - Upgrade modal
- Shows all 9 upgrades
- Locked upgrades grayed out with 🔒
- Prerequisites listed: "Requires: X, Y"
- Purchase deducts cost, marks purchased
- Auto-focus input on close

**`CompletionScreen/`** - Victory screen
- Final score display
- Time elapsed (MM:SS)
- Score per minute calculation

#### Data (`src/data/`)

**`upgrades.ts`** - Upgrade definitions
- `UPGRADES` array with all 9 upgrades
- Helper functions:
  - `getUpgradeById(id)` - Fetch upgrade by ID
  - `canPurchaseUpgrade(id, purchased[])` - Check prerequisites
  - `getAvailableUpgrades(purchased[])` - Filter unlocked upgrades
  - `getPrerequisiteNames(upgrade)` - Get prerequisite names for UI

**`UPGRADE_TREE.md`** - Visual documentation
- Tree diagram
- Cost progression table
- Expected points/minute at each stage

#### Utils (`src/utils/`)

**`textGenerator.ts`** - Text generation
- Generates 300 random sentences
- ~15,000 characters total
- Uses random selection from sentence pool

**`calculations.ts`** - Utility functions
- `isVowel(char)` - Check if character is a, e, i, o, u
- `isConsonant(char)` - Check if letter but not vowel
- `calculateWPM(timestamps[])` - Calculate WPM from rolling buffer
  - Takes array of millisecond timestamps
  - Returns WPM (chars/min ÷ 5)

**`sentences.ts`** - Sentence database
- 301 pre-written sentences
- Short, typeable phrases
- Varied vocabulary

#### Types (`src/types/index.ts`)

**Core Types:**
```typescript
type GameState = 'welcome' | 'countdown' | 'playing' | 'completed';

interface Multipliers {
  base: number;
  vowel: number;
  consonant: number;
  combo: number;
}

interface ComboState {
  isActive: boolean;
  multiplier: number;
  threshold: number;
  noBreak: boolean;
  availableThresholds: { wpm: number; multiplier: number }[];
}

interface Upgrade {
  id: number;
  name: string;
  description: string;
  cost: number;
  effect: UpgradeEffect;
  requisiteIds: number[];
}
```

---

## Performance Optimizations

### Windowed Character Rendering
**Problem:** 15,000+ DOM nodes caused lag
**Solution:** Only render visible window

```javascript
// In TypingChallenge.tsx
const windowStart = cleanupThreshold; // Set on shop open
const windowEnd = currentCharIndex + 500;
const visibleChars = text.slice(windowStart, windowEnd);
```

**Benefits:**
- ~800 DOM nodes instead of 15,000
- Smooth typing performance
- Memory efficient

### Cleanup Strategy
- Cleanup threshold starts at 0
- On shop open: `threshold = Math.max(0, currentCharIndex - 300)`
- Keeps last 300 chars + 500 ahead
- Prevents text reflow during typing

### WPM Calculation
- Rolling buffer of last 20 character timestamps
- O(1) insertion/removal
- Calculated on every correct keystroke
- No expensive string operations

---

## Dev Mode

**Activation:** Press `|` (pipe key)

**Features:**
- Any key press = correct (auto-advances)
- Backspace = mistake (breaks combo)
- Visual indicator: Red "DEV MODE" pulses in corner
- Console log on toggle
- Perfect for testing upgrades quickly

**Implementation:**
```javascript
const [devMode, setDevMode] = useState(false);

// In handleKeyPress:
if (key === '|') {
  setDevMode(prev => !prev);
  return;
}

const isCorrect = devMode || key === expectedChar;
```

---

## CSS Modules

All component styles use CSS Modules:
- `*.module.css` files
- Auto-prefixed class names (e.g., `Shop_modal__x7k2a`)
- No global conflicts
- Imported as: `import styles from './Component.module.css'`

---

## Color Palette

```css
/* Main Colors */
--bg-dark: #0d1117         /* Primary background */
--bg-darker: #010409       /* Modals, panels */
--green-primary: #00ff41   /* Text, borders */
--green-secondary: #008f11 /* Dimmed text */
--green-neon: #39ff14      /* Highlights, glow */
--green-dim: #00662b       /* Locked items */
--error: #ff3333           /* Mistakes, dev mode */
```

**Font:** Press Start 2P (Google Fonts - pixel art style)

---

## State Management

### App-Level State (`App.tsx`)
```javascript
const [gameState, setGameState] = useState<GameState>('welcome');
const [text, setText] = useState<string>('');
const [completionData, setCompletionData] = useState<GameCompletion | null>(null);
```

### Component State (`TypingChallenge.tsx`)
```javascript
const [isShopOpen, setIsShopOpen] = useState(false);
const [purchasedUpgradeIds, setPurchasedUpgradeIds] = useState<number[]>([]);
const [cleanupThreshold, setCleanupThreshold] = useState(0);
```

### Hook State (`useTypingTest.ts`)
- Character tracking: `currentCharIndex`, `typedChars[]`
- Scoring: `score`, `totalMistakes`
- Time: `startTime`, `elapsedTime`
- Multipliers: `multipliers`, `comboState`
- WPM: `charTimestamps[]`, `currentWPM`
- Combo: `comboResetCounter`, `devMode`

---

## Game Balance

### Expected Progression (100 WPM)

| Time | Score Range | Upgrades | Multiplier |
|------|-------------|----------|------------|
| 0:00-2:00 | 0-1,000 | 1-3 | 3-15× |
| 2:00-5:00 | 1,000-10,000 | 4-6 | 15-125× |
| 5:00-10:00 | 10,000-60,000 | 7-9 | 125-2,500× |

**Total Game Time:** ~7-10 minutes to reach 60,000 points

### Upgrade Costs (Exponential)
- Start: 50 pts
- Mid: 6,000 pts (120× increase)
- End: 50,000 pts (1,000× increase from start)

### Multiplier Scaling
- Early game: 1 → 9× (9× increase)
- Mid game: 9 → 125× (14× increase)
- Late game: 125 → 2,500× (20× increase)

---

## Future Improvements (Optional)

### Possible Enhancements
- [ ] More upgrade tiers (extend to 15-20 upgrades)
- [ ] Prestige system (reset with permanent bonuses)
- [ ] Multiple text generation modes (quotes, code, etc.)
- [ ] Global leaderboard
- [ ] Achievement system
- [ ] Sound effects
- [ ] Mobile/touch support
- [ ] Settings menu (font size, theme)
- [ ] Statistics tracking (accuracy, peak WPM, etc.)

### Code Quality
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] E2E tests (Cypress)
- [ ] Accessibility improvements (ARIA labels)
- [ ] Mobile responsive design
- [ ] Dark/light theme toggle

---

## Development Commands

```bash
npm start          # Dev server (localhost:3000)
npm run build      # Production build
npm test           # Run tests (if added)
npm run eject      # Eject from CRA (not recommended)
```

---

## Project Statistics

- **Lines of Code:** ~2,000
- **Components:** 6 main + subcomponents
- **Upgrades:** 9 with dependency tree
- **Sentences:** 301 in database
- **Max Multiplier:** 2,500×
- **Win Condition:** 60,000 points
- **Average Playtime:** 7-10 minutes

---

**Last Updated:** Fully complete - All features implemented
**Status:** ✅ Playable and balanced
**Tech Stack:** React 18 + TypeScript + CSS Modules + Create React App
