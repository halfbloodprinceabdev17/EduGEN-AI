import React, { useState, useEffect, useRef } from "react";
import InstructionBoxComponent from "../components/InstructionBoxComponent";
import { Howl } from "howler";
import instructions from "../data/gamesData";
import InstructionOnHover from "../components/InstructionOnHover";
import HomeButton from "../components/HomeButton";

const SlidingPuzzleGame = () => {
  const ruleSet = instructions.slidingPuzzle.rules;

  const [image, setImage] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [solved, setSolved] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [time, setTime] = useState(0);
  const gridSize = 4;

  const generateTiles = () => {
    const totalTiles = gridSize * gridSize - 1;
    const numbers = Array.from({ length: totalTiles }, (_, i) => i + 1);
    return [...numbers, null];
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setTiles(generateTiles());
  }, []);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  const startGame = () => {
    const shuffledTiles = shuffleArray(generateTiles());
    setTiles(shuffledTiles);
    setEmptyIndex(shuffledTiles.indexOf(null));
    setGameStarted(true);
    setSolved(false);
    setMoveCount(0);
    setTime(0);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTileClick = (index) => {
    if (gameStarted && isAdjacent(index, emptyIndex)) {
      const slideSound = new Howl({
        src: ["/sounds/slide.wav"],
      });
      slideSound.play();
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index],
      ];
      setTiles(newTiles);
      setEmptyIndex(index);
      setMoveCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const solvedTiles = generateTiles();
    if (JSON.stringify(tiles) === JSON.stringify(solvedTiles) && gameStarted) {
      setSolved(true);
      setGameStarted(false);
    }
  }, [tiles]);

  const isAdjacent = (index1, index2) => {
    const row1 = Math.floor(index1 / gridSize);
    const col1 = index1 % gridSize;
    const row2 = Math.floor(index2 / gridSize);
    const col2 = index2 % gridSize;

    return (
      (row1 === row2 && Math.abs(col1 - col2) === 1) ||
      (col1 === col2 && Math.abs(row1 - row2) === 1)
    );
  };

  const getBackgroundPosition = (tile) => {
    if (tile === null || !image) return "none";

    const row = Math.floor((tile - 1) / gridSize);
    const col = (tile - 1) % gridSize;
    const sizePercentage = 100 / (gridSize - 1);

    return `${col * sizePercentage}% ${row * sizePercentage}%`;
  };

  return (
    <>
      {showInstructions ? (
        <InstructionBoxComponent
          onProceed={() => {
            setShowInstructions(false);
          }}
          color={"yellow"}
          rules={ruleSet}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="absolute lg:block hidden bg-yellow-400 rounded-full w-96 h-96 opacity-30 top-100 -left-20"></div>
          <div className="absolute lg:block hidden bg-yellow-500 rounded-full w-80 h-80 opacity-20 bottom-10 right-10"></div>
          <div className="absolute lg:block hidden bg-yellow-600 rounded-full w-64 h-64 opacity-15 -top-36 left-[850px]"></div>
          <div className="bg-white shadow-xl max-w-3xl flex flex-col items-center relative justify-center py-10 px-6 rounded-3xl space-y-8 z-10">
            <InstructionOnHover ruleSet={ruleSet} color="yellow" />
            <HomeButton color="yellow" />
            <h1 className="text-4xl font-extrabold text-yellow-700 drop-shadow-md">
              🧩Sliding Puzzle Game
            </h1>

            <div className="flex items-center space-x-6 max-w-2xl">
              <div className="text-3xl font-bold text-yellow-800">
                Moves: <span className="font-bold">{moveCount}</span>
              </div>
              <div className="text-3xl font-bold text-yellow-800">
                Timer:{" "}
                <span className="font-bold">
                  {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
                </span>
              </div>
              <button
                onClick={startGame}
                className="bg-yellow-500 text-yellow-950 text-xl font-bold px-6 py-2 rounded-full shadow-md hover:bg-yellow-600"
              >
                Start Game
              </button>
            </div>

            <div className="relative">
              <div
                className={`grid grid-cols-4 w-64 h-64 border-4 ${
                  solved ? "border-green-500" : "border-yellow-500"
                }`}
                style={{
                  backgroundImage: image ? `url(${image})` : "none",
                  backgroundSize: "100% 100%",
                }}
              >
                {tiles.map((tile, index) =>
                  tile !== null ? (
                    <div
                      key={index}
                      className={`flex items-center justify-center bg-yellow-200 text-yellow-800 font-bold text-xl border border-yellow-500 ${
                        gameStarted
                          ? "hover:bg-yellow-300 cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: image ? `url(${image})` : "none",
                        backgroundPosition: getBackgroundPosition(tile),
                        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                      }}
                      onClick={() => handleTileClick(index)}
                    >
                      {!image && tile}
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="border border-yellow-500 bg-yellow-50"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )
                )}
              </div>
              {solved && (
                <div className="absolute inset-0 flex items-center justify-center bg-yellow-50 bg-opacity-90">
                  <div className="text-xl font-bold text-green-600">
                    🎉 Congratulations! You solved the puzzle!
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <p className="text-yellow-700 font-bold text-xl">Upload image:</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={gameStarted}
                className={`w-7/12 bg-yellow-200 hover:bg-yellow-300 text-lg text-yellow-700 rounded p-2 cursor-pointer border border-yellow-300 ${
                  gameStarted && "opacity-50 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlidingPuzzleGame;
