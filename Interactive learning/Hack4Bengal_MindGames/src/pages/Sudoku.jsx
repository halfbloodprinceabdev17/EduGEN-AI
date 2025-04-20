import React, { useState, useEffect, useRef } from "react";
import InstructionBoxComponent from "../components/InstructionBoxComponent";
import instructions from "../data/gamesData";
import InstructionOnHover from "../components/InstructionOnHover";
import HomeButton from "../components/HomeButton";

const SudokuGame = () => {
  const initialPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const ruleSet = instructions.sudoku.rules;

  const [grid, setGrid] = useState(initialPuzzle);
  const [errors, setErrors] = useState([]);
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [moves, setMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const cellRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (!showInstructions) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showInstructions]);

  useEffect(() => {
    const gridCopy = initialPuzzle.map((row) => [...row]);
    solveSudoku(gridCopy);
    setSolvedBoard(gridCopy);
  }, []);

  useEffect(() => {
    const { row, col } = selectedCell;
    const currentRef = cellRefs.current[row]?.[col];
    if (currentRef && currentRef.current) {
      currentRef.current.focus();
    }
  }, [selectedCell]);

  const typeSound = new Audio("/sounds/type.wav");

  useEffect(() => {
    let row = 0;
    let col = 0;

    while (initialPuzzle[row][col] !== 0) {
      if (col < 8) {
        col++;
      } else {
        col = 0;
        row++;
      }
      if (row === 9) break;
    }

    setSelectedCell({ row, col });
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isValid = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
      if (
        grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][
          3 * Math.floor(col / 3) + (x % 3)
        ] === num
      )
        return false;
    }
    return true;
  };

  const solveSudoku = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveSudoku(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const checkGrid = () => {
    const newErrors = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0 && grid[row][col] !== solvedBoard[row][col]) {
          newErrors.push({ row, col });
        }
      }
    }
    setErrors(newErrors);
  };

  const handleInputChange = (row, col, value) => {
    const newGrid = grid.map((rowArr, i) =>
      rowArr.map((cell, j) => (i === row && j === col ? value : cell))
    );
    setGrid(newGrid);
    setErrors([]);
    if (grid[row][col] === 0 && value !== 0) {
      setMoves((prev) => prev + 1);
      typeSound.play();
    }
  };

  const handleKeyPress = (e) => {
    let { row, col } = selectedCell;

    const isPrefilled = (row, col) => initialPuzzle[row][col] !== 0;

    const moveToNextValidCell = (direction) => {
      let newRow = row;
      let newCol = col;

      switch (direction) {
        case "up":
          newRow = row === 0 ? 8 : row - 1;
          break;
        case "down":
          newRow = row === 8 ? 0 : row + 1;
          break;
        case "left":
          newCol = col === 0 ? 8 : col - 1;
          break;
        case "right":
          newCol = col === 8 ? 0 : col + 1;
          break;
        default:
          return;
      }

      while (isPrefilled(newRow, newCol)) {
        switch (direction) {
          case "up":
            newRow = newRow === 0 ? 8 : newRow - 1;
            break;
          case "down":
            newRow = newRow === 8 ? 0 : newRow + 1;
            break;
          case "left":
            newCol = newCol === 0 ? 8 : newCol - 1;
            break;
          case "right":
            newCol = newCol === 8 ? 0 : newCol + 1;
            break;
          default:
            return;
        }
      }

      setSelectedCell({ row: newRow, col: newCol });
    };

    if (e.key === "ArrowUp") moveToNextValidCell("up");
    if (e.key === "ArrowDown") moveToNextValidCell("down");
    if (e.key === "ArrowLeft") moveToNextValidCell("left");
    if (e.key === "ArrowRight") moveToNextValidCell("right");
  };

  const renderCell = (row, col) => {
    const isError = errors.some(
      (error) => error.row === row && error.col === col
    );
    const isPrefilled = initialPuzzle[row][col] !== 0;
    const isSelected = selectedCell.row === row && selectedCell.col === col;

    if (!cellRefs.current[row]) cellRefs.current[row] = [];
    if (!cellRefs.current[row][col])
      cellRefs.current[row][col] = React.createRef();

    return (
      <input
        key={`${row}-${col}`}
        type="text"
        maxLength={1}
        disabled={isPrefilled}
        ref={cellRefs.current[row][col]}
        className={`w-12 h-12 border-2 text-center font-bold text-lg rounded-md
          ${
            isPrefilled
              ? "bg-blue-800 text-blue-100 font-bold"
              : "bg-white hover:bg-blue-50 transition-colors duration-150"
          }
          ${
            isError
              ? "bg-pink-100 text-red-500 border-2 border-red-500"
              : "border-blue-500"
          }
          ${isSelected ? "ring-2 ring-blue-500" : ""}
          focus:outline-none focus:ring-2 focus:ring-blue-400
        `}
        value={grid[row][col] || ""}
        onFocus={() => setSelectedCell({ row, col })}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value) && value >= 1 && value <= 9) {
            handleInputChange(row, col, value);
          } else if (e.target.value === "") {
            handleInputChange(row, col, 0);
          }
        }}
        onKeyDown={handleKeyPress}
      />
    );
  };

  return (
    <>
      {showInstructions ? (
        <InstructionBoxComponent
          onProceed={() => setShowInstructions(false)}
          color={"blue"}
          rules={ruleSet}
        />
      ) : (
        <div className="flex flex-col items-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 min-h-screen p-4">
          <div className="absolute lg:block hidden bg-blue-400 rounded-full w-96 h-96 opacity-30 top-100 -left-20"></div>
          <div className="absolute lg:block hidden bg-blue-500 rounded-full w-80 h-80 opacity-20 bottom-10 right-10"></div>
          <div className="absolute lg:block hidden bg-blue-600 rounded-full w-64 h-64 opacity-15 -top-36 left-[850px]"></div>

          <div className="bg-white z-10 px-10 py-4 rounded-3xl relative">
            <InstructionOnHover ruleSet={ruleSet} color="blue" />
            <HomeButton color="blue" />
            <h1 className="text-4xl text-center font-extrabold text-blue-600 mb-4">
              Sudoku Master
            </h1>
            <div className="flex justify-between items-center pt-6 w-full max-w-xl px-4 mb-6 text-blue-600 font-medium">
              <p className="text-3xl font-bold">Moves: {moves}</p>
              <p className="text-3xl font-bold">
                Timer: {formatTime(elapsedTime)}
              </p>
              <button
                className="px-8 py-3 bg-blue-600 text-white text-xl font-bold rounded-full shadow hover:bg-blue-700 transition-colors duration-150"
                onClick={checkGrid}
              >
                Check
              </button>
            </div>
            <div className="grid grid-cols-9 gap-1 border-4 border-blue-500 rounded-lg p-4 bg-white shadow-lg">
              {grid.map((row, rowIndex) =>
                row.map((_, colIndex) => renderCell(rowIndex, colIndex))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SudokuGame;
