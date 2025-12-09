import { useState, useEffect } from 'react';
import './slidePuzzle.css';

const SlidePuzzle = () => {
  // Initialize solved puzzle state
  const solvedPuzzle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];

  const [tiles, setTiles] = useState(solvedPuzzle);
  const [moves, setMoves] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedTiles = localStorage.getItem('puzzleTiles');
    const savedMoves = localStorage.getItem('puzzleMoves');

    if (savedTiles) {
      setTiles(JSON.parse(savedTiles));
    }
    if (savedMoves) {
      setMoves(parseInt(savedMoves));
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('puzzleTiles', JSON.stringify(tiles));
    localStorage.setItem('puzzleMoves', moves.toString());
  }, [tiles, moves]);

  // Find the index of the empty tile (null)
  const getEmptyIndex = () => {
    return tiles.indexOf(null);
  };

  // Check if a tile can move (is in same row or column as empty spot)
  const canMove = (index) => {
    const emptyIndex = getEmptyIndex();
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    const tileRow = Math.floor(index / 4);
    const tileCol = index % 4;

    // Check if tile is in same row or column
    return (emptyRow === tileRow) || (emptyCol === tileCol);
  };

  // Handle tile click - slide entire row or column
  const handleTileClick = (index) => {
    if (canMove(index) && !animating) {
      setAnimating(true);

      const newTiles = [...tiles];
      const emptyIndex = getEmptyIndex();
      const emptyRow = Math.floor(emptyIndex / 4);
      const emptyCol = emptyIndex % 4;
      const tileRow = Math.floor(index / 4);
      const tileCol = index % 4;

      // Same row - slide horizontally
      if (emptyRow === tileRow) {
        const minCol = Math.min(emptyCol, tileCol);
        const maxCol = Math.max(emptyCol, tileCol);

        if (emptyCol < tileCol) {
          // Slide left - tiles move toward empty space
          for (let col = emptyCol; col < maxCol; col++) {
            const currentIndex = tileRow * 4 + col;
            const nextIndex = tileRow * 4 + (col + 1);
            newTiles[currentIndex] = newTiles[nextIndex];
          }
          newTiles[index] = null;
        } else {
          // Slide right - tiles move toward empty space
          for (let col = emptyCol; col > minCol; col--) {
            const currentIndex = tileRow * 4 + col;
            const prevIndex = tileRow * 4 + (col - 1);
            newTiles[currentIndex] = newTiles[prevIndex];
          }
          newTiles[index] = null;
        }
      }
      // Same column - slide vertically
      else if (emptyCol === tileCol) {
        const minRow = Math.min(emptyRow, tileRow);
        const maxRow = Math.max(emptyRow, tileRow);

        if (emptyRow < tileRow) {
          // Slide up - tiles move toward empty space
          for (let row = emptyRow; row < maxRow; row++) {
            const currentIndex = row * 4 + tileCol;
            const nextIndex = (row + 1) * 4 + tileCol;
            newTiles[currentIndex] = newTiles[nextIndex];
          }
          newTiles[index] = null;
        } else {
          // Slide down - tiles move toward empty space
          for (let row = emptyRow; row > minRow; row--) {
            const currentIndex = row * 4 + tileCol;
            const prevIndex = (row - 1) * 4 + tileCol;
            newTiles[currentIndex] = newTiles[prevIndex];
          }
          newTiles[index] = null;
        }
      }

      setTiles(newTiles);
      setMoves(moves + 1);

      // Reset animating state after animation completes
      setTimeout(() => {
        setAnimating(false);
      }, 750); // Match CSS transition time
    }
  };

  // Shuffle the puzzle
  const shuffle = () => {
    const newTiles = [...solvedPuzzle];

    // Fisher-Yates shuffle
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }

    setTiles(newTiles);
    setMoves(0);
  };

// Determine tile color based on your specific scheme
const isEvenNumber = (tile) => {
  // White tiles: 2, 4, 5, 7, 10, 12, 13, 15
  const whiteTiles = [2, 4, 5, 7, 10, 12, 13, 15];
  return tile !== null && whiteTiles.includes(tile);
};

  return (
    <div className="puzzle-container">
      <h1>Slide Puzzle</h1>
      <div className="game-info">
        <p>Moves: {moves}</p>
        <button onClick={shuffle}>Shuffle</button>
      </div>
      <div className="puzzle-grid">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === null ? 'empty' : ''} ${isEvenNumber(tile) ? 'even-tile' : 'odd-tile'} ${canMove(index) ? 'movable' : ''}`}
            onClick={() => handleTileClick(index)}
          >
            {tile}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidePuzzle;