import React, { useState, useEffect } from "react";
import CompletionModal from "../components/WordSearch.jsx/CompletionModal";
import InstructionBoxComponent from "../components/InstructionBoxComponent";
import instructions from "../data/gamesData";
import InstructionOnHover from "../components/InstructionOnHover";
import HomeButton from "../components/HomeButton";

const WordSearchGame = () => {
  const ruleSet = instructions.wordSearch.rules;

  const grid = [
    ["Q", "Z", "T", "L", "S", "L", "S", "S", "J", "T"],
    ["Y", "I", "S", "R", "F", "C", "A", "U", "E", "S"],
    ["G", "M", "O", "W", "A", "V", "N", "N", "N", "T"],
    ["M", "L", "E", "T", "N", "G", "A", "I", "K", "U"],
    ["R", "T", "F", "A", "U", "W", "E", "N", "O", "D"],
    ["W", "E", "C", "Y", "L", "L", "B", "D", "O", "Y"],
    ["S", "E", "B", "T", "L", "X", "B", "H", "Y", "H"],
    ["A", "R", "Z", "O", "H", "R", "X", "X", "E", "Y"],
    ["S", "G", "R", "S", "P", "I", "N", "T", "F", "N"],
    ["X", "D", "Q", "B", "R", "E", "P", "O", "R", "T"],
  ];

  const solutionGrid = [
    [-1, -1, 8, -1, -1, -1, -1, 0, -1, 4],
    [-1, -1, -1, 8, -1, -1, 0, -1, 4, 7],
    [-1, -1, -1, -1, 8, 0, -1, 4, -1, 7],
    [-1, -1, -1, -1, 0, 8, -1, -1, -1, 7],
    [-1, 2, -1, 0, -1, -1, 8, -1, -1, 7],
    [-1, 2, 0, -1, -1, 1, -1, 8, -1, 7],
    [-1, 2, -1, -1, 1, -1, -1, 3, 8, -1],
    [-1, 2, -1, 1, -1, -1, -1, -1, 3, -1],
    [-1, 2, 1, 6, 6, 6, 6, -1, -1, 3],
    [-1, 1, -1, -1, 5, 5, 5, 5, 5, 5],
  ];

  const wordsToFind = [
    "CANVAS",
    "DROLL",
    "GREET",
    "HEN",
    "NET",
    "REPORT",
    "SPIN",
    "STUDY",
    "TRAGEDY",
  ];
  const [clickedCells, setClickedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const keySound = new Audio("/sounds/type.wav");

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;
    if (!showInstructions && !isModalOpen) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showInstructions, isModalOpen]);

  useEffect(() => {
    if (foundWords.length === wordsToFind.length) {
      setIsModalOpen(true);
    }
  }, [foundWords]);

  // play sound on click or match
  const handleCellClick = (row, col) => {
    const wordIndex = solutionGrid[row][col];

    keySound.play();
    const isAlreadyClicked = clickedCells.some(
      (cell) => cell.row === row && cell.col === col
    );

    if (isAlreadyClicked) {
      setClickedCells((prev) =>
        prev.filter((cell) => cell.row !== row || cell.col !== col)
      );
      return;
    }

    const newClickedCells = [...clickedCells, { row, col, wordIndex }];
    setClickedCells(newClickedCells);

    const wordCells = [];
    solutionGrid.forEach((rowArr, rowIndex) => {
      rowArr.forEach((cellValue, colIndex) => {
        if (cellValue === wordIndex) {
          wordCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    const isWordFound = wordCells.every((cell) =>
      newClickedCells.some(
        (clickedCell) =>
          clickedCell.row === cell.row && clickedCell.col === cell.col
      )
    );

    if (isWordFound) {
      setFoundWords((prev) => [...prev, wordIndex]);

      const remainingClickedCells = newClickedCells.filter(
        (clickedCell) => clickedCell.wordIndex !== wordIndex
      );
      setClickedCells(remainingClickedCells);

      // play sound if word fount
      const wordFoundSound = new Audio("/sounds/matching.wav");
      wordFoundSound.play();
    }
  };

  const isCellInFoundWord = (row, col) => {
    const wordIndex = solutionGrid[row][col];
    return foundWords.includes(wordIndex);
  };

  const isCellClicked = (row, col) => {
    return clickedCells.some((cell) => cell.row === row && cell.col === col);
  };

  const resetGame = () => {
    setFoundWords([]);
    setClickedCells([]);
    setTimer(0);
    setIsModalOpen(false);
  };

return (
  <>
    {showInstructions ? (
      <InstructionBoxComponent
        onProceed={() => setShowInstructions(false)}
        color={"indigo"}
        rules={ruleSet}
      />
    ) : (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center p-5 text-white relative">
        {/* Glowing background orbs */}
        <div className="absolute bg-indigo-500 blur-3xl rounded-full w-96 h-96 opacity-20 top-20 left-10 animate-pulse"></div>
        <div className="absolute bg-purple-500 blur-3xl rounded-full w-72 h-72 opacity-20 bottom-10 right-10 animate-pulse"></div>

        <div className="z-10 p-6 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
          <InstructionOnHover ruleSet={ruleSet} color="indigo" />
          <HomeButton color="indigo" />

          <div className="p-4 rounded-xl bg-white/5 border border-white/20 shadow-inner">
            <div className="flex justify-between items-center px-4 mb-4">
              <h1 className="text-3xl font-bold text-indigo-200 tracking-wide">
                Word Search
              </h1>
              <h1 className="text-2xl font-mono font-bold text-indigo-300">
                ⏱ {formatTime(timer)}
              </h1>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => {
                  const isClicked = isCellClicked(rowIndex, colIndex);
                  const isFound = isCellInFoundWord(rowIndex, colIndex);

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`w-12 h-12 font-bold text-lg rounded-lg transition duration-200 ease-in-out shadow-md ${
                        isFound
                          ? "bg-indigo-700 text-white shadow-indigo-500/40 cursor-default"
                          : isClicked
                          ? "bg-indigo-400 text-white shadow-md shadow-indigo-300"
                          : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-col justify-start items-center p-4 rounded-xl bg-white/5 border border-white/20 shadow-inner max-h-[500px] overflow-y-auto">
            <h2 className="text-2xl font-bold text-indigo-200 mb-4">
              Words to Find
            </h2>
            <ul className="flex flex-col items-center gap-2">
              {wordsToFind.map((word, index) => (
                <li
                  key={word}
                  className={`text-lg font-semibold tracking-wide ${
                    foundWords.includes(index)
                      ? "text-green-300 line-through"
                      : "text-indigo-100"
                  }`}
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CompletionModal
          isOpen={isModalOpen}
          time={timer}
          onPlayAgain={resetGame}
        />
      </div>
    )}
  </>
);
}

export default WordSearchGame;
