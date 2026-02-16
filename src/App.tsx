import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import Countdown from './components/Countdown/Countdown';
import TypingChallenge from './components/TypingChallenge/TypingChallenge';
import { GameState, GameCompletion } from './types';
import { generateText } from './utils/textGenerator';

const TARGET_SCORE = 60_000; // Win after ~80 sec with all upgrades at 100 WPM

function App() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [text, setText] = useState<string>('');
  const [completionData, setCompletionData] = useState<GameCompletion | null>(null);

  const handleStartGame = () => {
    // Generate text for gameplay
    const generatedText = generateText();
    setText(generatedText);

    console.log('Game started! Text generated.');

    setGameState('countdown');
  };

  const handleCountdownComplete = () => {
    console.log('Countdown complete! Starting game...');
    setGameState('playing');
  };

  const handleGameComplete = (score: number, elapsedSeconds: number) => {
    // Calculate score per minute
    const minutes = elapsedSeconds / 60;
    const scorePerMinute = minutes > 0 ? Math.round(score / minutes) : score;

    const completion: GameCompletion = {
      finalScore: score,
      elapsedSeconds,
      scorePerMinute,
    };

    console.log('Game complete!', completion);
    setCompletionData(completion);
    setGameState('completed');
  };

  const handlePlayAgain = () => {
    setGameState('welcome');
    setCompletionData(null);
    setText('');
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderScreen = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStartGame={handleStartGame} />;
      case 'countdown':
        return (
          <>
            <TypingChallenge
              text={text}
              targetScore={TARGET_SCORE}
              isCountingDown={true}
            />
            <Countdown onComplete={handleCountdownComplete} />
          </>
        );
      case 'playing':
        return (
          <TypingChallenge
            text={text}
            targetScore={TARGET_SCORE}
            isCountingDown={false}
            onComplete={handleGameComplete}
          />
        );
      case 'completed':
        return completionData ? (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <h1 style={{
              fontSize: '3rem',
              color: 'var(--green-primary)',
              marginBottom: '1rem',
              textShadow: '0 0 20px var(--green-neon)',
              letterSpacing: '4px'
            }}>
              CONGRATULATIONS!
            </h1>
            <p style={{
              fontSize: '1.5rem',
              color: 'var(--green-secondary)',
              marginBottom: '3rem'
            }}>
              Game Completed!
            </p>

            {/* Statistics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '3rem',
              maxWidth: '600px'
            }}>
              <div style={{
                border: '3px solid var(--green-primary)',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-darker)',
                boxShadow: '0 0 15px var(--green-primary)'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--green-secondary)',
                  marginBottom: '0.5rem'
                }}>
                  FINAL SCORE
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'var(--green-primary)',
                  textShadow: '0 0 15px var(--green-neon)'
                }}>
                  {completionData.finalScore}
                </div>
              </div>

              <div style={{
                border: '3px solid var(--green-primary)',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-darker)',
                boxShadow: '0 0 15px var(--green-primary)'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--green-secondary)',
                  marginBottom: '0.5rem'
                }}>
                  SCORE/MIN
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'var(--green-primary)',
                  textShadow: '0 0 15px var(--green-neon)'
                }}>
                  {completionData.scorePerMinute}
                </div>
              </div>

              <div style={{
                border: '3px solid var(--green-primary)',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-darker)',
                boxShadow: '0 0 15px var(--green-primary)',
                gridColumn: '1 / -1'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--green-secondary)',
                  marginBottom: '0.5rem'
                }}>
                  TIME ELAPSED
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'var(--green-primary)',
                  textShadow: '0 0 15px var(--green-neon)'
                }}>
                  {formatTime(completionData.elapsedSeconds)}
                </div>
              </div>
            </div>

            <button
              onClick={handlePlayAgain}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1rem',
                color: 'var(--green-primary)',
                backgroundColor: 'var(--bg-dark)',
                border: '3px solid var(--green-primary)',
                padding: '1rem 2rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--green-primary)';
                e.currentTarget.style.color = 'var(--bg-dark)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 20px var(--green-neon)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
                e.currentTarget.style.color = 'var(--green-primary)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Play Again
            </button>
          </div>
        ) : (
          <WelcomeScreen onStartGame={handleStartGame} />
        );
      default:
        return <WelcomeScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <div className="App scanlines">
      {renderScreen()}
    </div>
  );
}

export default App;
