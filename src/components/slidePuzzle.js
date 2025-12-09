import { useState, useEffect } from 'react';
import './slidePuzzle.css';

const SlidePuzzle = () => {
  const solvedPuzzle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];

  const [tiles, setTiles] = useState(solvedPuzzle);
  const [moves, setMoves] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [draggedTile, setDraggedTile] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    localStorage.setItem('puzzleTiles', JSON.stringify(tiles));
    localStorage.setItem('puzzleMoves', moves.toString());
  }, [tiles, moves]);

  const getEmptyIndex = () => tiles.indexOf(null);

  const canMove = (index) => {
    const emptyIndex = getEmptyIndex();
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    const tileRow = Math.floor(index / 4);
    const tileCol = index % 4;
    return (emptyRow === tileRow) || (emptyCol === tileCol);
  };

  const handleTileClick = (index) => {
    if (!canMove(index)) return;

    const newTiles = [...tiles];
    const emptyIndex = getEmptyIndex();
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    const tileRow = Math.floor(index / 4);
    const tileCol = index % 4;

    if (emptyRow === tileRow) {
      if (emptyCol < tileCol) {
        for (let col = emptyCol; col < tileCol; col++) {
          newTiles[tileRow * 4 + col] = newTiles[tileRow * 4 + (col + 1)];
        }
      } else {
        for (let col = emptyCol; col > tileCol; col--) {
          newTiles[tileRow * 4 + col] = newTiles[tileRow * 4 + (col - 1)];
        }
      }
      newTiles[index] = null;
    } else if (emptyCol === tileCol) {
      if (emptyRow < tileRow) {
        for (let row = emptyRow; row < tileRow; row++) {
          newTiles[row * 4 + tileCol] = newTiles[(row + 1) * 4 + tileCol];
        }
      } else {
        for (let row = emptyRow; row > tileRow; row--) {
          newTiles[row * 4 + tileCol] = newTiles[(row - 1) * 4 + tileCol];
        }
      }
      newTiles[index] = null;
    }

    setTiles(newTiles);
    setMoves(moves + 1);
  };

  const shuffle = () => {
    const newTiles = [...solvedPuzzle];
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    setTiles(newTiles);
    setMoves(0);
  };

  const isWhiteTile = (tile) => {
    const whiteTiles = [2, 4, 5, 7, 10, 12, 13, 15];
    return tile !== null && whiteTiles.includes(tile);
  };

  const handleDragStart = (index, event) => {
    if (!canMove(index)) return;

    const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;

    setDragStart({ x: clientX, y: clientY });
    setDraggedTile(index);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDragMove = (event) => {
    if (!dragStart || draggedTile === null) return;

    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // Determine if we're moving horizontally or vertically
    const emptyIndex = getEmptyIndex();
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    const tileRow = Math.floor(draggedTile / 4);
    const tileCol = draggedTile % 4;

    // Constrain movement based on empty tile position
    if (emptyRow === tileRow) {
      // Moving horizontally
      const maxMove = Math.abs(emptyCol - tileCol) * 105; // 105px per tile
      const direction = emptyCol < tileCol ? -1 : 1;
      const constrainedX = Math.max(-maxMove, Math.min(maxMove, deltaX * direction)) * direction;
      setDragOffset({ x: constrainedX, y: 0 });
    } else if (emptyCol === tileCol) {
      // Moving vertically
      const maxMove = Math.abs(emptyRow - tileRow) * 105;
      const direction = emptyRow < tileRow ? -1 : 1;
      const constrainedY = Math.max(-maxMove, Math.min(maxMove, deltaY * direction)) * direction;
      setDragOffset({ x: 0, y: constrainedY });
    }
  };

  const handleDragEnd = (event) => {
    if (!dragStart || draggedTile === null) return;

    const threshold = 30;

    if (Math.abs(dragOffset.x) > threshold || Math.abs(dragOffset.y) > threshold) {
      handleTileClick(draggedTile);
    }

    setDragStart(null);
    setDraggedTile(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Add global mouse/touch move and up listeners
  useEffect(() => {
    const handleMove = (e) => handleDragMove(e);
    const handleUp = (e) => handleDragEnd(e);

    if (draggedTile !== null) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [draggedTile, dragStart, dragOffset]);

  const renderTiles = () => {
    const allTileValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];

    return allTileValues.map((tileValue) => {
      const currentIndex = tiles.indexOf(tileValue);
      if (currentIndex === -1) return null;

      const row = Math.floor(currentIndex / 4) + 1;
      const col = (currentIndex % 4) + 1;

      // Apply drag offset if this is the dragged tile
      const isDragging = draggedTile === currentIndex;
      const transform = isDragging
        ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
        : 'none';

      return (
        <div
          key={tileValue === null ? 'empty' : `tile-${tileValue}`}
          className={`tile ${tileValue === null ? 'empty' : ''} ${isWhiteTile(tileValue) ? 'even-tile' : 'odd-tile'} ${canMove(currentIndex) && tileValue !== null ? 'movable' : ''}`}
          style={{
            gridRow: row,
            gridColumn: col,
            transform: transform,
            transition: isDragging ? 'none' : 'all 0.3s ease'
          }}
          onClick={() => handleTileClick(currentIndex)}
          onMouseDown={(e) => handleDragStart(currentIndex, e)}
          onTouchStart={(e) => handleDragStart(currentIndex, e)}
        >
          {tileValue}
        </div>
      );
    });
  };

  return (
    <div className="puzzle-container">
      <h1>Slide Puzzle</h1>
      <div className="game-info">
        <p>Moves: {moves}</p>
        <button onClick={shuffle}>Shuffle</button>
      </div>
      <div className="puzzle-grid">
        {renderTiles()}
      </div>
    </div>
  );
};

export default SlidePuzzle;