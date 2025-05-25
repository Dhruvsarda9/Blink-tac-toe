import { useState } from 'react';
import GameBoard from './components/GameBoard';
import CategorySelector from './components/CategorySelector';
import './App.css';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Category, setPlayer1Category] = useState(null);
  const [player2Category, setPlayer2Category] = useState(null);

  const handleCategoriesSelected = (p1Category, p2Category) => {
    setPlayer1Category(p1Category);
    setPlayer2Category(p2Category);
    setGameStarted(true);
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setPlayer1Category(null);
    setPlayer2Category(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-20"></div>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 animate-fade-in">
          Emoji Tic Tac Toe
        </h1>

        {!gameStarted ? (
          <CategorySelector onCategoriesSelected={handleCategoriesSelected} />
        ) : (
          <GameBoard 
            player1Category={player1Category}
            player2Category={player2Category}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
};

export default App;
