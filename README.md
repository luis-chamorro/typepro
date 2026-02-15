# TypePro - Retro Typing Speed Test

A pixel art typing speed test application with a retro green terminal aesthetic.

![Status](https://img.shields.io/badge/status-90%25%20complete-brightgreen)
![React](https://img.shields.io/badge/react-18.x-blue)
![TypeScript](https://img.shields.io/badge/typescript-4.x-blue)

## Quick Start

```bash
npm install
npm start
```

Visit **http://localhost:3000**

## Features

✅ **Two test modes**: Timed (30s/60s/120s) or Word-based (25/50/100 words)
✅ **Character-by-character tracking** with live feedback
✅ **Visual keyboard** with key press animations
✅ **Real-time WPM calculation** with strike penalties
✅ **Backspace correction** support
✅ **Retro green terminal aesthetic** (Press Start 2P font)
✅ **Performance badges** and detailed results

## Project Status

**Phase 8/10 Complete** - Core functionality done, ready for polish and responsive design.

See **[CLAUDE.md](./CLAUDE.md)** for comprehensive documentation and continuation guide.

## Tech Stack

- React 18 + TypeScript
- CSS Modules
- @ndaidong/txtgen (text generation)
- Press Start 2P font (pixel art)
- Create React App

## Development

```bash
npm start      # Dev server (localhost:3000)
npm run build  # Production build
npm test       # Run tests
```

## Project Structure

```
src/
├── components/     # React components (WelcomeScreen, TypingChallenge, etc.)
├── hooks/          # Custom hooks (useTypingTest, useTimer)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (calculations, text generation)
└── styles/         # Global styles and CSS variables
```

## Next Steps

- [ ] Phase 9: Polish & Visual Effects
- [ ] Phase 10: Responsive Design & Testing
- [ ] Deploy to production

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete project documentation for AI continuation
- **[outline.txt](./outline.txt)** - Original project requirements

---

Built with Create React App + TypeScript
