import React, { useState, useRef, useEffect } from "react";
import InstructionBoxComponent from "../components/InstructionBoxComponent";
import instructions from "../data/gamesData";
import InstructionOnHover from "../components/InstructionOnHover";
import HomeButton from "../components/HomeButton";

const SpotTheDifference = () => {
  const [level, setLevel] = useState(1);
  const [cubes, setCubes] = useState([]);
  const [lastCube, setLastCube] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [levelSkipped, setLevelSkipped] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timer, setTimer] = useState(0);
  const [win, setWin] = useState(false);

  const ruleset = instructions.spotTheDifference.rules;

  const leftSideRef = useRef(null);

  const cubeSize = 50;

  const wrongSound = new Audio("/sounds/wrong.wav");
  const shades = ["300", "400", "500", "600", "700", "800", "900", "950"];

  const generatePosition = (containerSize, cubeSize) => {
    return Math.random() * (containerSize - cubeSize);
  };

  const generateCubes = (cubeCount) => {
    const newCubes = [];
    const containerWidth = leftSideRef.current.offsetWidth;
    const containerHeight = leftSideRef.current.offsetHeight;

    for (let i = 0; i < cubeCount - 1; i++) {
      newCubes.push({
        id: i,
        left: generatePosition(containerWidth, cubeSize),
        top: generatePosition(containerHeight, cubeSize),
      });
    }

    const uniqueCube = {
      id: cubeCount,
      left: generatePosition(containerWidth, cubeSize),
      top: generatePosition(containerHeight, cubeSize),
    };

    setCubes(newCubes);
    setLastCube(uniqueCube);
  };

  const handleCubeClick = (event) => {
    const clickSound = new Audio("/sounds/correct.wav");
    event.stopPropagation(); // Prevent click from propagating to the body
    setLevel((prev) => prev + 1);
    clickSound.play();
    generateCubes((level + 1) * 5);
  };

  const restartGame = (event) => {
    event.stopPropagation(); // Stop propagation to prevent body click interference
    setGameOver(false); // Reset gameOver
    setLevel(1);
    setTimer(0);
    setLevelSkipped(false);
    setWin(false);
    generateCubes(5); // Start a new game
  };

  const handleSkipLevel = (event) => {
    event.stopPropagation(); // Stop propagation to prevent body click interference
    setLevelSkipped(true);
    handleCubeClick(event);
  };

  useEffect(() => {
    generateCubes(5);
  }, [showInstructions]);

  useEffect(() => {
    if (level === 30) {
      setWin(true);
      const winSound = new Audio("/sounds/win.wav");
      winSound.play();
    }
  }, [level]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;
    if (!showInstructions && !gameOver && !win) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showInstructions, gameOver, win]);

  return (
    <>
      <div className="fixed inset-0"></div>
      {showInstructions && (
        <InstructionBoxComponent
          title={instructions.spotTheDifference.name}
          rules={ruleset}
          setShowInstructions={setShowInstructions}
          color={"teal"}
          onProceed={() => setShowInstructions(false)}
        />
      )}
      <div
        className={`${
          showInstructions ? "hidden" : "flex"
        } min-h-screen bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400 flex items-center justify-center p-2`}
      >
        <div className="absolute lg:block hidden bg-teal-400 rounded-full w-96 h-96 opacity-30 top-100 -left-20"></div>
        <div className="absolute lg:block hidden bg-teal-500 rounded-full w-80 h-80 opacity-20 bottom-10 right-10"></div>
        <div className="absolute lg:block hidden bg-teal-600 rounded-full w-64 h-64 opacity-15 -top-36 left-[850px]"></div>

        <div className="bg-white z-10 p-5 rounded-2xl shadow-lg max-w-6xl w-full">
          <div className="flex-1 p-4 rounded-lg shadow-md bg-white border-4 border-teal-300 w-full relative">
            <div className="flex justify-center items-center gap-x-12 px-6">
              <h1 className="text-4xl font-bold text-teal-600 text-center">
                {instructions.spotTheDifference.name}
              </h1>
              <h1 className="text-3xl font-bold text-teal-700 text-center">
                Timer: {formatTime(timer)}
              </h1>
              <button
                className="py-3 px-6 bg-rose-500 hover:bg-rose-700 text-white rounded-full text-xl font-bold"
                onClick={() => setGameOver(true)}
              >
                Restart
              </button>

              <button
                className="py-3 px-6 bg-emerald-500 hover:bg-emerald-700 text-white rounded-full text-xl font-bold disabled:bg-gray-400"
                onClick={handleSkipLevel}
                disabled={levelSkipped}
              >
                Skip Level
              </button>
            </div>
            <div
              id="container"
              className="max-w-4xl text-teal-700 text-4xl font-bold mx-auto p-4"
            >
              <h3 id="status" style={{ textAlign: "center" }}>
                Level {level}
              </h3>
              <div className="flex justify-around w-full py-3">
                <h2 className="text-rose-600 text-2xl font-bold">Wrong</h2>
                <h2 className="text-emerald-600 text-2xl font-bold">Correct</h2>
              </div>
              <div className="flex gap-2">
                <div
                  id="left"
                  ref={leftSideRef}
                  style={{
                    width: "50%",
                    height: "400px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="border-2 border-teal-500 bg-teal-100"
                >
                  {cubes.map((cube, index) => (
                    <div
                      key={cube.id}
                      className={`cube bg-teal-${
                        shades[index % shades.length]
                      } rounded-full border-teal-950 border-2 cursor-crosshair`}
                      style={{
                        width: "50px",
                        height: "50px",
                        position: "absolute",
                        left: cube.left,
                        top: cube.top,
                      }}
                      onClick={() => wrongSound.play()}
                    />
                  ))}
                  {lastCube && (
                    <div
                      key={lastCube.id}
                      className="cube bg-teal-700 rounded-full border-teal-950 border-2 cursor-crosshair"
                      style={{
                        width: "50px",
                        height: "50px",
                        position: "absolute",
                        left: lastCube.left,
                        top: lastCube.top,
                      }}
                      onClick={handleCubeClick}
                    />
                  )}
                </div>
                <div
                  id="right"
                  style={{
                    width: "50%",
                    height: "400px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="border-2 border-teal-500 bg-teal-100"
                >
                  {cubes.map((cube, index) => (
                    <div
                      key={cube.id}
                      className={`cube bg-teal-${
                        shades[index % shades.length]
                      } rounded-full border-teal-950 border-2 cursor-crosshair`}
                      style={{
                        width: "50px",
                        height: "50px",
                        position: "absolute",
                        left: cube.left,
                        top: cube.top,
                      }}
                    />
                  ))}
                </div>
              </div>
              {gameOver && (
                <>
                  <div className="absolute inset-0 bg-black/90 z-40" />
                  <div
                    className="bg-white p-10 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50  text-center text-lg flex flex-col items-center gap-1"
                    onClick={(e) => e.stopPropagation()} // Prevent clicks on dialog from propagating
                  >
                    <p className="text-4xl font-bold text-emerald-700">
                      Game Over!
                    </p>
                    <p className="text-xl text-gray-500">
                      You are on level {level}, Do you want to restart?
                    </p>
                    <button
                      onClick={restartGame} // Ensure click does not trigger the body click
                      className="py-2 px-6 bg-green-600 text-white rounded-lg text-2xl"
                    >
                      Yes
                    </button>
                  </div>
                </>
              )}

              <h3 className="font-bold text-red-500 text-center text-xl pt-3">
                {levelSkipped
                  ? "*You cannot skip any more levels."
                  : "*You can only skip once!"}
              </h3>

              {/* Instructions dropdown */}
              <InstructionOnHover ruleSet={ruleset} color="teal" />
              <HomeButton color="teal" />
            </div>
          </div>
        </div>
      </div>

      {win && (
        <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg py-14 px-20 shadow-lg max-w-md text-center">
            <h2 className="text-4xl font-bold text-teal-600 mb-4">
              Congratulations!
            </h2>
            <p className="text-2xl mb-4 text-teal-500 font-bold">
              You reached level 30!
            </p>
            <p className="text-2xl mb-4 font-bold text-teal-800">
              Time taken: {formatTime(timer)}
            </p>
            <button
              onClick={restartGame}
              className="mt-4 px-6 py-3 bg-teal-600 text-white text-xl font-semibold rounded-full hover:bg-teal-700 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SpotTheDifference;
