# TypePro - Typing Speed Test Application

## Project Overview
A retro pixel art typing speed test application built with React + TypeScript. Features a green terminal aesthetic, character-by-character tracking, and real-time WPM calculation.

---

## Current Status: ~90% Complete

### ✅ Completed Phases (1-8):
1. **Project Setup** - React + TypeScript, @ndaidong/txtgen for text generation
2. **Welcome Screen** - Mode selection (Time: 30s/60s/120s, Words: 25/50/100)
3. **Countdown** - 5→4→3→2→1→GO! overlay with greyed keyboard
4. **Text Generation** - Random text via txtgen, displays with 3-line scrolling window
5. **Core Typing Logic** - Character-by-character tracking with backspace support
6. **Timer & Progress** - Live WPM, countdown timer, progress tracking
7. **Pixel Typewriter** - Visual keyboard at bottom with key press animations
8. **Results Screen** - Performance badges, statistics, strike penalties

### 🔄 Remaining Phases:
- **Phase 9**: Polish & Visual Effects
- **Phase 10**: Responsive Design & Testing

---

## Key Features Implemented

### Typing Mechanics
- **Character-by-character tracking** (not word-based)
- **Immediate validation** - wrong chars show in red
- **Backspace support** - removes incorrect chars and decrements strikes
- **Strike system** - increments on wrong character, decreases on backspace removal
- **Visual cursor** - light green transparent block (40% opacity) shows current position
- **No blocking** - user can proceed after wrong character

### Display Elements
- **Text preview** - Shows 3 lines at a time, auto-scrolls with typing
- **Pixel typewriter** - Bottom keyboard animates on keypress
- **HUD displays**:
  - Top Left: Timer (time mode) or Progress (word mode)
  - Top Center: Live WPM
  - Top Right: Strikes counter (shakes on error)

### Results Screen
- Performance badges (⚡🔥👍💪📝)
- Large WPM display with strike penalty
- Statistics grid: Accuracy, Strikes, Time, Words
- "Go Back" button to restart

---

## Technical Architecture

### Key Files

#### **Hooks** (`src/hooks/`)
- `useTypingTest.ts` - Core typing logic, character tracking, strikes
- `useTimer.ts` - Timer countdown/elapsed time tracking (uses useRef for onTimeUp to avoid interval recreation)

#### **Components** (`src/components/`)
- `WelcomeScreen/` - Mode selection interface
- `Countdown/` - 5-second countdown overlay
- `TypingChallenge/` - Main typing interface with text + keyboard
- `PixelTypewriter/` - Visual keyboard with key animations
- `ResultsScreen/` - Final statistics display

#### **Utilities** (`src/utils/`)
- `textGenerator.ts` - Wrapper for @ndaidong/txtgen
- `calculations.ts` - WPM, accuracy, strike penalty formulas

#### **Types** (`src/types/index.ts`)
- Game states, test configs, test results

---

## Important Implementation Details

### WPM Calculation
**Formula**: `(correctChars / 5) / (elapsedTime / 60)`
- Standard: 5 characters = 1 word
- Strike penalty: Each strike = 10% WPM reduction
- Location: `src/utils/calculations.ts`

### Timer Issue (FIXED)
**Problem**: Timer was resetting on every keystroke
**Cause**: `onTimeUp` callback in useEffect dependencies caused interval recreation
**Solution**: Used `useRef` to stabilize callback reference
- File: `src/hooks/useTimer.ts` lines 11-14
- Dependencies changed from `[isActive, config.mode, onTimeUp]` to `[isActive, config.mode]`

### Character Tracking
- `currentCharIndex` - tracks position in text (0-based)
- `typedChars[]` - array storing what user actually typed at each position
- `expectedText` - the correct text to type
- Comparison happens on every keypress in `handleKeyPress()`

### Modifier Key Filtering
Ignored keys: Shift, Control, Alt, Meta, CapsLock, Tab, Escape, Enter
- Also filters any key with `length > 1`
- Location: `src/hooks/useTypingTest.ts` line 26

---

## Styling & Theme

### Color Palette
```css
--bg-dark: #0d1117
--bg-darker: #010409
--green-primary: #00ff41 (matrix green)
--green-secondary: #008f11
--green-neon: #39ff14 (highlights)
--green-dim: #00662b
--error: #ff3333
```

### Font
- **Press Start 2P** (Google Fonts) - pixel art font throughout
- Imported in `src/index.css`

### Key Design Decisions
- Text alignment: Left (not centered) for proper wrapping
- Text box: 3 lines max-height with overflow hidden
- Current char: `rgba(0, 255, 65, 0.4)` background
- Keyboard: 36px keys, larger than initial design
- Results: 2-column grid for stat boxes

---

## Known Issues & Notes

### Text Wrapping
- Using `white-space: pre-wrap` to preserve spaces
- Text splits into character spans which can affect line breaking
- Current solution: left-aligned with word-wrap

### Performance
- Dev server runs on `localhost:3000`
- React 18 with TypeScript
- No major performance issues noted

### Strike System
- Strikes increment on wrong character
- Strikes decrement on backspace of wrong character
- Formula: `finalWPM = rawWPM * (1 - strikes * 0.1)`

---

## File Structure
```
typepro/
├── public/
│   └── index.html (title: TypePro - Typing Speed Test)
├── src/
│   ├── components/
│   │   ├── WelcomeScreen/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   └── WelcomeScreen.module.css
│   │   ├── Countdown/
│   │   │   ├── Countdown.tsx
│   │   │   └── Countdown.module.css
│   │   ├── TypingChallenge/
│   │   │   ├── TypingChallenge.tsx
│   │   │   └── TypingChallenge.module.css
│   │   ├── PixelTypewriter/
│   │   │   ├── PixelTypewriter.tsx
│   │   │   └── PixelTypewriter.module.css
│   │   └── ResultsScreen/
│   │       ├── ResultsScreen.tsx
│   │       └── ResultsScreen.module.css
│   ├── hooks/
│   │   ├── useTypingTest.ts (core typing logic)
│   │   └── useTimer.ts (timer with useRef fix)
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── textGenerator.ts
│   │   └── calculations.ts
│   ├── styles/
│   │   └── variables.css (color palette)
│   ├── App.tsx (main game state machine)
│   ├── App.css
│   ├── index.css (global styles + Press Start 2P import)
│   └── index.tsx
├── package.json
├── outline.txt (original requirements)
└── CLAUDE.md (this file)
```

---

## Development Commands

```bash
npm start          # Start dev server (localhost:3000)
npm run build      # Production build
npm test           # Run tests
```

---

## Next Steps for Future Session

### Phase 9: Polish & Visual Effects
- Add scanline effects (optional enhancement)
- Smooth transitions between screens
- Sound effects (optional - keyboard clicks, countdown beeps)
- Loading states
- Error boundaries

### Phase 10: Responsive Design & Testing
- Mobile layout (currently desktop-optimized)
- Tablet breakpoints
- Touch screen support
- Cross-browser testing (Chrome, Firefox, Safari)
- Fix any remaining layout issues
- Ensure no scrolling on any screen size
- Performance optimization
- README documentation
- Deploy to Vercel/Netlify

---

## Testing Checklist

### Current Test Coverage Needed:
- [ ] All game state transitions work
- [ ] WPM calculation accuracy verified
- [ ] Strike system works correctly (increment/decrement)
- [ ] Backspace functionality correct
- [ ] Timer counts accurately in both modes
- [ ] Time mode auto-completes at 0:00
- [ ] Word mode completes at correct word count
- [ ] Results screen shows accurate stats
- [ ] "Go Back" button resets state properly

---

## Dependencies

```json
{
  "dependencies": {
    "@ndaidong/txtgen": "^4.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "typescript": "^4.x.x"
  }
}
```

---

## Git State
- Repository initialized
- No remote configured yet
- Consider adding .gitignore for node_modules, build/

---

## Additional Context

### Design Philosophy
- Retro terminal aesthetic (green-on-black)
- Pixel art style throughout
- Simple, focused on typing experience
- No unnecessary features or complexity

### User Feedback Incorporated
- Countdown positioned above keyboard (not center)
- Keyboard visible and greyed during countdown
- Text visible during countdown for preparation
- Larger keyboard than initial design
- Character-based (not word-based) tracking
- Backspace support added
- Strike removal on backspace
- Cursor made more visible (40% opacity)
- No blocking on wrong character

---

## Contact/Continuation
When resuming:
1. Check `npm start` works
2. Review this document
3. Test current functionality
4. Proceed with Phase 9 or 10
5. Ask user for any additional requirements

**Last updated**: Phase 8 complete, Timer fix implemented
**Status**: Fully functional, ready for polish and responsive design
