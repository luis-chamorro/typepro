# TypePro - Incremental Typing Game

## Project Overview
Retro green terminal-themed incremental typing game built with React + TypeScript. Score points by typing correctly, buy upgrades, and reach the target score to win.

---

## Current Status: Core Complete (Phases 1-5)

### ✅ Completed:
1. **Core Game Mechanics** - Score-based typing (+1 per char, -1 per mistake)
2. **Welcome Screen** - Single "Start Game" button
3. **HUD** - Prominent score display, shop cart icon
4. **Shop System** - Modal with upgrade purchase logic
5. **Upgrades** - Vowel Boost (vowels = 2 points, cost: 50)
6. **Completion Screen** - Final score, score/min, time elapsed

### 🔄 Next Steps:
- Add more upgrades to shop
- Continuous text generation (prevent running out)
- Polish animations and transitions
- Responsive design & testing

---

## Game Mechanics

### Scoring
- Correct character: **+1 point** (or +2 if vowel with upgrade)
- Wrong character: **-1 point** (permanent penalty)
- Backspace: Removes character, but points stay lost
- Win condition: Reach 400 points (configurable)

### Upgrades
- **Vowel Boost** (50 points) - Vowels give 2 points instead of 1
- More upgrades to be added

### Visual Elements
- 5-second countdown before typing starts
- 3-line scrolling text window
- Pixel typewriter keyboard at bottom
- Score display shakes on mistakes
- Shop modal with upgrade cards

---

## Technical Architecture

### Key Files

**Hooks** (`src/hooks/`)
- `useTypingTest.ts` - Core logic: scoring, vowel detection, time tracking

**Components** (`src/components/`)
- `WelcomeScreen/` - Start game button
- `Countdown/` - 5-second countdown overlay
- `TypingChallenge/` - Main game interface
- `PixelTypewriter/` - Visual keyboard
- `Shop/` - Upgrade shop modal

**Utils** (`src/utils/`)
- `textGenerator.ts` - Random text via @ndaidong/txtgen
- `calculations.ts` - isVowel utility

**Types** (`src/types/index.ts`)
- GameState, Upgrade, GameCompletion

**Assets** (`src/assets/`)
- `cart.svg` - Shop icon (neon green)

---

## CSS Modules
Files named `*.module.css` are scoped to their component via webpack's css-loader. Class names are automatically prefixed (e.g., `Shop_modal__x7k2a`) to prevent conflicts.

---

## Color Palette
```css
--bg-dark: #0d1117
--bg-darker: #010409
--green-primary: #00ff41
--green-secondary: #008f11
--green-neon: #39ff14
--green-dim: #00662b
--error: #ff3333
```

**Font**: Press Start 2P (Google Fonts)

---

## File Structure
```
typepro/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen/
│   │   ├── Countdown/
│   │   ├── TypingChallenge/
│   │   ├── PixelTypewriter/
│   │   └── Shop/
│   ├── hooks/
│   │   └── useTypingTest.ts
│   ├── types/index.ts
│   ├── utils/
│   │   ├── textGenerator.ts
│   │   └── calculations.ts
│   ├── assets/cart.svg
│   ├── styles/variables.css
│   └── App.tsx
├── package.json
└── CLAUDE.md
```

---

## Development

```bash
npm start          # localhost:3000
npm run build      # Production build
```

---

## Implementation Notes

### useTypingTest Hook
- Tracks: currentCharIndex, score, elapsedTime, mistakes
- Parameters: text, targetScore, activeUpgrades[], onComplete
- Returns: score, adjustScore (for purchases), elapsedTime, handlers

### Shop System
- Opens/closes via cart icon click
- Displays upgrades with cost and description
- Purchase: deducts cost, marks purchased, shows checkmark
- Active upgrades passed to typing hook on every keystroke

### Time Tracking
- Starts on game begin, updates every second
- Calculates score per minute: `(score / minutes)`
- Displays on completion screen as MM:SS

---

**Last Updated**: Phase 5 complete - Shop & upgrades fully functional
**Status**: Core gameplay ready, ready for expansion
