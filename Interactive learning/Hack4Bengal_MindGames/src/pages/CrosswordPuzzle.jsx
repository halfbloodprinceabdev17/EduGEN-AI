import { useEffect, useState } from "react";
import InstructionBoxComponent from "../components/InstructionBoxComponent";
import puzzles from "../data/crosswords";
import instructions from "../data/gamesData.js";
import InstructionOnHover from "../components/InstructionOnHover.jsx";
import HomeButton from "../components/HomeButton.jsx";

const Crossword = () => {
  const ruleSet = instructions.crosswordPuzzle.rules;
  const hints = puzzles[3].hints;
  const grid = puzzles[3].grid;

  const [answers, setAnswers] = useState(grid.map((row) => row.map(() => "")));
  const [isWinner, setIsWinner] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const keySound = new Audio("/sounds/type.wav");
  const [gameStarted, setGameStarted] = useState(false);

  const [completedHints, setCompletedHints] = useState({
    across: [],
    down: [],
  });

  const handleKeyDown = (e) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const totalRows = grid.length;
    const totalCols = grid[0].length;

    const findNextValidCellWithWrap = (
      startRow,
      startCol,
      rowStep,
      colStep
    ) => {
      let newRow = startRow;
      let newCol = startCol;

      while (true) {
        newRow += rowStep;
        newCol += colStep;

        if (newRow < 0) newRow = totalRows - 1;
        if (newRow >= totalRows) newRow = 0;
        if (newCol < 0) newCol = totalCols - 1;
        if (newCol >= totalCols) newCol = 0;

        if (grid[newRow]?.[newCol] !== "") {
          return { row: newRow, col: newCol };
        }

        if (newRow === startRow && newCol === startCol) {
          break;
        }
      }
      return null;
    };

    let nextCell = null;

    switch (e.key) {
      case "ArrowUp":
        nextCell = findNextValidCellWithWrap(row, col, -1, 0);
        break;
      case "ArrowDown":
        nextCell = findNextValidCellWithWrap(row, col, 1, 0);
        break;
      case "ArrowLeft":
        nextCell = findNextValidCellWithWrap(row, col, 0, -1);
        break;
      case "ArrowRight":
        nextCell = findNextValidCellWithWrap(row, col, 0, 1);
        break;
      case "Backspace":
        handleChange({ target: { value: "" } }, row, col);
        break;
      default:
        break;
    }

    if (nextCell) {
      setSelectedCell(nextCell);
      makeCellEditable(nextCell.row, nextCell.col);
    }
  };

  const makeCellEditable = (row, col) => {
    const cell = document.querySelector(`#cell-${row}-${col}`);
    if (cell) {
      cell.focus();
      cell.readOnly = false;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell]);

  const checkWordCompletion = (row, col, direction, word, number) => {
    if (direction === "across") {
      let userWord = "";
      for (let index = 0; index < word.length; index++) {
        userWord += answers[row][col + index];
      }

      setCompletedHints((prevHints) => {
        const isCompleted = userWord === word;
        const isAlreadyInList = prevHints.across.includes(number);

        return {
          ...prevHints,
          across: isCompleted
            ? isAlreadyInList
              ? prevHints.across
              : [...prevHints.across, number] // Add the number if the word is completed
            : prevHints.across.filter((n) => n !== number), // Remove the number if the word is not completed
        };
      });
    } else if (direction === "down") {
      let userWord = "";
      for (let index = 0; index < word.length; index++) {
        userWord += answers[row + index][col];
      }

      setCompletedHints((prevHints) => {
        const isCompleted = userWord === word;
        const isAlreadyInList = prevHints.down.includes(number);

        return {
          ...prevHints,
          down: isCompleted
            ? isAlreadyInList
              ? prevHints.down
              : [...prevHints.down, number] // Add the number if the word is completed
            : prevHints.down.filter((n) => n !== number), // Remove the number if the word is not completed
        };
      });
    }
  };

  useEffect(() => {
    for (let i = 0; i < hints.across.length; i++) {
      const hint = hints.across[i];
      checkWordCompletion(hint.row, hint.col, "across", hint.word, hint.number);
    }

    for (let i = 0; i < hints.down.length; i++) {
      const hint = hints.down[i];
      checkWordCompletion(hint.row, hint.col, "down", hint.word, hint.number);
    }
  }, [answers]);

  const handleChange = (e, rowIndex, colIndex) => {
    const value = e.target.value.toUpperCase().slice(0, 1);
    keySound.play();

    const newAnswers = answers.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );

    setAnswers(newAnswers);
    checkWin(newAnswers);
  };

  const checkWin = (userAnswers) => {
    const isCorrect = grid.every((row, rowIndex) =>
      row.every((cell, colIndex) => {
        if (cell === "") return true;
        return userAnswers[rowIndex][colIndex] === grid[rowIndex][colIndex];
      })
    );
    setIsWinner(isCorrect);
  };

  const resetGame = () => {
    setAnswers(grid.map((row) => row.map(() => "")));
    setIsWinner(false);
    setCompletedHints({
      across: [],
      down: [],
    });
  };

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  const getNumber = (rowIndex, colIndex) => {
    const across = hints.across.find(
      (hint) => hint.row === rowIndex && hint.col === colIndex
    );
    const down = hints.down.find(
      (hint) => hint.row === rowIndex && hint.col === colIndex
    );
    return across?.number || down?.number || null;
  };

  useEffect(() => {
    if (isWinner) {
      const sound = new Audio("/sounds/game-win.wav"); // Specify your sound file path
      sound.play();
    }
  }, [isWinner]);

  return !gameStarted ? (
    <InstructionBoxComponent
      onProceed={() => setGameStarted(true)}
      color="rose"
      rules={ruleSet}
    />
  ) : (
    <div className="min-h-screen bg-rose-100 p-10 flex items-center justify-center">
      <div className=" flex flex-col items-center bg-white rounded-xl p-10 w-max mx-auto relative">
        <InstructionOnHover ruleSet={ruleSet} color="rose" />
        <HomeButton color="rose" />
        <h1 className="text-4xl font-bold text-rose-600 uppercase">
          Crossword Puzzle
        </h1>
        <div className="flex lg:flex-row flex-col md:space-x-10 py-10">
          {/* Crossword Grid */}
          <div
            className={`flex flex-col h-max items-center border-rose-700 border-2 w-max mx-auto ${
              isWinner && "pointer-events-none"
            }`}
          >
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center">
                {row.map((cell, colIndex) => {
                  const isCompletedAcross = hints.across.some(
                    (hint) =>
                      hint.row === rowIndex &&
                      colIndex >= hint.col &&
                      colIndex < hint.col + hint.word.length &&
                      completedHints.across.includes(hint.number)
                  );

                  const isCompletedDown = hints.down.some(
                    (hint) =>
                      hint.col === colIndex &&
                      rowIndex >= hint.row &&
                      rowIndex < hint.row + hint.word.length &&
                      completedHints.down.includes(hint.number)
                  );

                  // If either across or down word is completed, mark as green
                  const isCompleted = isCompletedAcross || isCompletedDown;

                  return (
                    <div
                      className={`relative p-2  border-rose-700 border-2 overflow-clip focus-within:border-rose-500 ${
                        isCompleted
                          ? "bg-emerald-100"
                          : selectedCell?.row === rowIndex &&
                            selectedCell?.col === colIndex
                          ? "bg-red-100"
                          : "bg-rose-50 hover:bg-red-100"
                      } ${cell === "" ? "" : ""}`}
                      key={`${rowIndex}-${colIndex}`}
                    >
                      {getNumber(rowIndex, colIndex) && (
                        <span className="absolute top-1 left-1 text-xs font-bold">
                          {getNumber(rowIndex, colIndex)}
                        </span>
                      )}
                      {cell === "" ? (
                        <div className="w-10 h-10 bg-rose-700 shadow-[0_0_0_1rem_#be123c] pointer-events-none"></div>
                      ) : (
                        <input
                          id={`cell-${rowIndex}-${colIndex}`}
                          type="text"
                          value={answers[rowIndex][colIndex]}
                          onChange={(e) => handleChange(e, rowIndex, colIndex)}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className={`w-10 h-10 text-center text-2xl font-bold bg-transparent focus:outline-none focus:border-blue-500 ${
                            isCompleted ? "text-emerald-600" : "text-rose-950"
                          } ${
                            selectedCell?.row === rowIndex &&
                            selectedCell?.col === colIndex
                              ? "bg-red-100"
                              : ""
                          }`}
                          disabled={isCompleted}
                          readOnly={grid[rowIndex][colIndex] === ""}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Hints Section */}
          <div className="mb-5 md:mb-0 py-5">
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="font-bold text-2xl text-rose-500">Across</h3>
                <ul className="mb-3 text-xl list-outside">
                  {hints.across.map((hint) => (
                    <li
                      key={hint.number}
                      className={`list-item text-gray-800 max-w-[30ch] ${
                        completedHints.across.includes(hint.number) &&
                        "opacity-70 line-through"
                      }`}
                    >
                      <span className="font-semibold text-right text-gray-600">
                        {hint.number}.
                      </span>{" "}
                      {hint.clue}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-rose-500">Down</h3>
                <ul className="text-xl list-outside list">
                  {hints.down.map((hint) => (
                    <li
                      key={hint.number}
                      className={`list-item text-gray-800 max-w-[30ch] ${
                        completedHints.down.includes(hint.number) &&
                        "opacity-70 line-through"
                      }`}
                    >
                      <span className="font-semibold text-right text-gray-600">
                        {hint.number}.
                      </span>{" "}
                      {hint.clue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {isWinner && (
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-80 flex flex-col justify-center items-center">
            <div className="bg-white p-10 rounded-xl shadow-xl border-rose-200 border-4 flex flex-col justify-center items-center">
              <h5 className="text-green-600 font-bold text-2xl mb-5">
                🎉 Congratulations! You solved the crossword! 🎉
              </h5>
              <button
                onClick={resetGame}
                className="bg-rose-600 py-2 px-5 rounded-lg text-center font-extrabold text-white tracking-wide text-xl"
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crossword;
