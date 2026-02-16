# TypePro - Incremental Typing Game

An exponential multiplier-based typing game with a retro green terminal aesthetic. Type to earn points, unlock upgrades, and watch your score skyrocket!

![Status](https://img.shields.io/badge/status-complete-brightgreen)
![React](https://img.shields.io/badge/react-18.x-blue)
![TypeScript](https://img.shields.io/badge/typescript-4.x-blue)

## 🎮 Quick Start

```bash
npm install
npm start
```

Visit **http://localhost:3000**

## ✨ Features

### Core Gameplay
- ⚡ **Exponential progression** - Start at 1pt/char, scale to 2,500× multiplier
- 🔥 **Combo system** - Type fast (60-80 WPM) for massive multipliers
- 🛒 **9 upgrades** - Unlock vowel/consonant/base/combo multipliers
- 🎯 **Win condition** - Reach 60,000 points (~7-10 minutes)
- 📊 **Score tracking** - Real-time score with comma formatting

### Multiplier System
```
Score = Base × Key Multiplier × Combo Multiplier
```
- **Base**: 1 → 5 → 20 (from upgrades)
- **Keys**: Vowels/Consonants 1× → 3× → 5×
- **Combo**: 3× at 60 WPM, 5× at 80 WPM
- **Maximum**: 20 × 5 × 5 = **2,500× multiplier**

### Combo Mechanics
- Activate by typing 60+ WPM with combo unlocked
- Requires 20 correct characters after ANY mistake
- Visual indicator: 🔥 COMBO 5× 🔥
- "Unbreakable Focus" upgrade removes reset penalty

### Visual Design
- 🖥️ Retro green terminal theme
- 🎨 Pixel art keyboard (Press Start 2P font)
- 💥 Red flash on mistakes
- ✨ Pulsing combo indicator
- 🏪 Clean shop modal with upgrade tree

## 🛠️ Tech Stack

- React 18 + TypeScript
- CSS Modules (scoped styling)
- 300+ sentences for continuous gameplay
- Performance optimizations (windowed rendering)
- Create React App

## 📚 Game Progression

### Early Game (0-1,000 pts)
- **Upgrade 1-3** - Vowel/Consonant boost, Base 1→5
- Multiplier: 3-9×
- Time: ~2 minutes

### Mid Game (1,000-10,000 pts)
- **Upgrade 4-6** - Key mastery, Combo unlock
- Multiplier: 15-125×
- Time: ~3-4 minutes

### Late Game (10,000-60,000 pts)
- **Upgrade 7-9** - Base 5→20, Speed combos
- Multiplier: 375-2,500×
- Time: ~2-3 minutes

## 🎯 Upgrade Tree

```
[1] Vowel 3× (50)
    ├─ [2] Consonant 3× (200)
    │   └─ [5] Consonant 5× (3,000)
    ├─ [3] Base 1→5 (600)
    │   ├─ [10] Base 5→20 (12,000)
    │   └─ [9] Unbreakable (50,000)
    └─ [4] Vowel 5× (1,500)

[3,4,5] → [6] Combo 3× @60wpm (6,000)
              ├─ [7] Combo @40wpm (20,000)
              └─ [8] Combo 5× @80wpm (35,000)
```

## 🔧 Development

```bash
npm start      # Dev server (localhost:3000)
npm run build  # Production build
```

### Dev Mode
Press `|` to toggle dev mode:
- Any key = correct (auto-advance)
- Backspace = mistake
- Perfect for testing upgrades quickly

## 📁 Project Structure

```
src/
├── components/
│   ├── WelcomeScreen/      # Start game screen
│   ├── Countdown/          # 5-second countdown
│   ├── TypingChallenge/    # Main game loop
│   ├── PixelTypewriter/    # Visual keyboard
│   ├── Shop/               # Upgrade shop modal
│   └── CompletionScreen/   # Win screen
├── hooks/
│   └── useTypingTest.ts    # Core game logic
├── data/
│   ├── upgrades.ts         # Upgrade definitions & tree
│   └── UPGRADE_TREE.md     # Visual upgrade documentation
├── types/index.ts          # TypeScript definitions
├── utils/
│   ├── textGenerator.ts    # 300 sentence pool
│   ├── calculations.ts     # WPM, vowel/consonant checks
│   └── sentences.ts        # Sentence database
└── App.tsx                 # Game state management
```

## 🎨 Color Palette

```css
--bg-dark: #0d1117       /* Main background */
--bg-darker: #010409     /* Modals, panels */
--green-primary: #00ff41 /* Primary text */
--green-secondary: #008f11
--green-neon: #39ff14    /* Highlights, glow */
--green-dim: #00662b
--error: #ff3333         /* Mistakes */
```

## 🚀 Performance

- **Windowed rendering**: Only 800 DOM nodes (was 15,000+)
- **Cleanup on shop open**: Removes old characters
- **Optimized re-renders**: Minimal state updates
- **Fast WPM calculation**: Rolling 20-character buffer

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete technical documentation
- **[src/data/UPGRADE_TREE.md](./src/data/UPGRADE_TREE.md)** - Upgrade progression details

---

**Status**: ✅ Complete and playable
**Game Time**: ~7-10 minutes for full playthrough
**Built with**: Create React App + TypeScript
