import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import Countdown from './components/Countdown/Countdown';
import TypingChallenge from './components/TypingChallenge/TypingChallenge';
import ResultsScreen from './components/ResultsScreen/ResultsScreen';
import { GameState, TestConfig, TestResult } from './types';
import { generateText, textToWords } from './utils/textGenerator';

function App() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [text, setText] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult | null>(null);

  const handleStartTest = (config: TestConfig) => {
    setTestConfig(config);

    // Generate text based on config
    const generatedText = generateText(config);
    const generatedWords = textToWords(generatedText);

    setText(generatedText);
    setWords(generatedWords);

    console.log('Test config selected:', config);
    console.log('Generated words:', generatedWords.length);

    setGameState('countdown');
  };

  const handleCountdownComplete = () => {
    console.log('Countdown complete! Starting typing test...');
    setGameState('typing');
  };

  const handleTypingComplete = (results: TestResult) => {
    console.log('Typing test complete!', results);
    setTestResults(results);
    setGameState('results');
  };

  const handleGoBack = () => {
    setGameState('welcome');
    setTestResults(null);
    setTestConfig(null);
    setText('');
    setWords([]);
  };

  const renderScreen = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStartTest={handleStartTest} />;
      case 'countdown':
        return (
          <>
            <TypingChallenge
              config={testConfig!}
              text={text}
              words={words}
              isCountingDown={true}
            />
            <Countdown onComplete={handleCountdownComplete} />
          </>
        );
      case 'typing':
        return (
          <TypingChallenge
            config={testConfig!}
            text={text}
            words={words}
            isCountingDown={false}
            onComplete={handleTypingComplete}
          />
        );
      case 'results':
        return testResults && testConfig ? (
          <ResultsScreen
            results={testResults}
            config={testConfig}
            onGoBack={handleGoBack}
          />
        ) : (
          <WelcomeScreen onStartTest={handleStartTest} />
        );
      default:
        return <WelcomeScreen onStartTest={handleStartTest} />;
    }
  };

  return (
    <div className="App scanlines">
      {renderScreen()}
    </div>
  );
}

export default App;
