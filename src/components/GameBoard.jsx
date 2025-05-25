import { useState, useEffect } from 'react';
import { emojiCategories } from './CategorySelector';

const GameBoard = ({ player1Category, player2Category, onPlayAgain }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Moves, setPlayer1Moves] = useState([]);
  const [player2Moves, setPlayer2Moves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [vanishingCell, setVanishingCell] = useState(null);

  const getRandomEmoji = (category) => {
    const emojis = emojiCategories[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const checkWinner = (newBoard) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoard[a] && newBoard[b] && newBoard[c]) {
        // Check if all three belong to the same player
        const playerA = newBoard[a].player;
        const playerB = newBoard[b].player;
        const playerC = newBoard[c].player;
        
        if (playerA === playerB && playerB === playerC) {
          return playerA;
        }
      }
    }
    return null;
  };

  const makeMove = (cellIndex) => {
    if (board[cellIndex] || winner) return;

    const emoji = getRandomEmoji(currentPlayer === 1 ? player1Category : player2Category);
    const newBoard = [...board];
    const playerMoves = currentPlayer === 1 ? [...player1Moves] : [...player2Moves];

    // Add new move
    const newMove = { cellIndex, emoji, player: currentPlayer };
    newBoard[cellIndex] = newMove;
    playerMoves.push(newMove);

    // Handle vanishing rule (max 3 emojis per player)
    if (playerMoves.length > 3) {
      const oldestMove = playerMoves.shift();
      
      // Check if trying to place on the same spot as the oldest emoji
      if (oldestMove.cellIndex === cellIndex) {
        return; // Invalid move
      }

      setVanishingCell(oldestMove.cellIndex);
      
      // Remove the oldest emoji after animation
      setTimeout(() => {
        setBoard(prevBoard => {
          const updatedBoard = [...prevBoard];
          updatedBoard[oldestMove.cellIndex] = null;
          return updatedBoard;
        });
        setVanishingCell(null);
      }, 800);
    }

    // Update state
    setBoard(newBoard);
    if (currentPlayer === 1) {
      setPlayer1Moves(playerMoves);
    } else {
      setPlayer2Moves(playerMoves);
    }

    // Check for winner
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setPlayer1Moves([]);
    setPlayer2Moves([]);
    setWinner(null);
    setVanishingCell(null);
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
      {/* Game Status */}
      <div className="text-center mb-6">
        {winner ? (
          <div className="animate-scale-in">
            <p className="text-3xl font-bold text-white mb-2">🎉 Player {winner} Wins! 🎉</p>
            <button
              onClick={onPlayAgain}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div>
            <p className="text-2xl font-semibold text-white mb-2">
              <span className={currentPlayer === 1 ? 'text-cyan-400' : 'text-pink-400'}>
                Player {currentPlayer}
              </span>
              's Turn
            </p>
            <p className="text-sm text-white/70">
              Category: {currentPlayer === 1 ? player1Category : player2Category}
            </p>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => makeMove(index)}
            disabled={winner || vanishingCell === index}
            className={`
              w-24 h-24 bg-white/5 backdrop-blur-sm border-2 border-white/20 
              rounded-xl text-4xl font-bold transition-all duration-300 
              hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95
              flex items-center justify-center relative overflow-hidden
              ${vanishingCell === index ? 'animate-pulse bg-yellow-400/30' : ''}
              ${cell ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {cell && (
              <span className={`relative z-10 ${vanishingCell === index ? 'opacity-50' : ''}`}>
                {cell.emoji}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-3">
          <h4 className="text-cyan-400 font-semibold">Player 1</h4>
          <p className="text-white/70 text-sm">{player1Category}</p>
          <p className="text-white text-sm">Emojis: {player1Moves.length}/3</p>
        </div>
        <div className="bg-pink-400/10 border border-pink-400/30 rounded-xl p-3">
          <h4 className="text-pink-400 font-semibold">Player 2</h4>
          <p className="text-white/70 text-sm">{player2Category}</p>
          <p className="text-white text-sm">Emojis: {player2Moves.length}/3</p>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-6 text-center">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
