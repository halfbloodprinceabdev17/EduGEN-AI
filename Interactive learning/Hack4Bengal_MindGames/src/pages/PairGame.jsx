import React, { useState, useEffect } from "react";
import GameBoard from "../components/Pair Game/GameBoard";
import Header from "../components/Pair Game/Header";
import Modal from "../components/Pair Game/Modal";
import InstructionBoxComponent from "../components/InstructionBoxComponent";
import { Howl } from "howler";
import instructions from "../data/gamesData";
import InstructionOnHOver from "../components/InstructionOnHover";
import HomeButton from "../components/HomeButton";

const generateCards = (difficulty) => {
  let cardsData;
  let doubledCards;
  switch (difficulty) {
    case "medium":
      cardsData = ["🍎", "🍌", "🍐", "🍉", "🍒"];
      doubledCards = [
        ...cardsData,
        ...cardsData,
        ...cardsData,
        ...cardsData,
        ...cardsData,
        ...cardsData,
      ];
      break;
    case "hard":
      cardsData = [
        "🍎",
        "🍌",
        "🍐",
        "🍉",
        "🍒",
        "🥝",
        "🍍",
        "🍓",
        "🍑",
        "🍈",
        "🍊",
        "🍋",
      ];
      doubledCards = [...cardsData, ...cardsData, ...cardsData, ...cardsData];
      break;
    default:
      cardsData = ["🍎", "🍌", "🍉", "🍒"];
      doubledCards = [...cardsData, ...cardsData, ...cardsData, ...cardsData];
      break;
  }

  return doubledCards
    .map((value, id) => ({ id, value, matched: false }))
    .sort(() => Math.random() - 0.5);
};

function PairGame() {
  const ruleSet = instructions.flipFusion.rules;
  const [cards, setCards] = useState(generateCards("easy"));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [showInstructions, setShowInstructions] = useState(true);
  console.log(difficulty);

  useEffect(() => {
    let timer;
    if (!showInstructions && !isGameComplete) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }

    return () => clearInterval(timer);
  }, [showInstructions, isGameComplete]);

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      setIsGameComplete(true);
      const victorySound = new Howl({
        src: ["/sounds/completion.wav"],
      });
      victorySound.play();
    }
  }, [matchedCards, cards]);

  const handleCardClick = (cardId) => {
    if (flippedCards.length < 2 && !flippedCards.includes(cardId)) {
      setFlippedCards((prev) => [...prev, cardId]);
      setMoves((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (cards[firstCard].value === cards[secondCard].value) {
        const matchSound = new Howl({
          src: ["/sounds/matching.wav"],
        });
        matchSound.play();
        setMatchedCards((prev) => [...prev, firstCard, secondCard]);
      }
      setTimeout(() => setFlippedCards([]), 500);
    }
  }, [flippedCards, cards]);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    setCards(generateCards(event.target.value));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setIsGameComplete(false);
  };

  const restartGame = () => {
    setCards(generateCards(difficulty));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setIsGameComplete(false);
  };

  return (
    <>
      {showInstructions ? (
        <InstructionBoxComponent
          onProceed={() => {
            setShowInstructions(false);
          }}
          color={"purple"}
          rules={ruleSet}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 flex flex-col items-center p-4">
          <div className="absolute lg:block hidden bg-purple-400 rounded-full w-96 h-96 opacity-30 top-100 -left-20"></div>
          <div className="absolute lg:block hidden bg-purple-500 rounded-full w-80 h-80 opacity-20 bottom-10 right-10"></div>
          <div className="absolute lg:block hidden bg-purple-600 rounded-full w-64 h-64 opacity-15 -top-36 left-[850px]"></div>
          <div className="w-full max-w-5xl bg-white m-2 z-10 px-10 py-5 my-auto rounded-3xl shadow-xl relative">
            <InstructionOnHOver ruleSet={ruleSet} color={"purple"} />
            <HomeButton color={"purple"} />
            <Header moves={moves} time={time} onRestart={restartGame} />
            <div className="mb-4 flex justify-center items-center">
              <label
                htmlFor="difficulty"
                className="mr-2 text-xl text-purple-800 font-extrabold"
              >
                Select Difficulty:
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
                className="p-2 border-2 border-black rounded-full"
              >
                <option className="" value="easy">
                  Easy (4x4)
                </option>
                <option value="medium">Medium (5x6)</option>
                <option value="hard">Hard (6x8)</option>
              </select>
            </div>
            <GameBoard
              cards={cards}
              flippedCards={flippedCards}
              matchedCards={matchedCards}
              onCardClick={handleCardClick}
              difficulty={difficulty}
            />
            {isGameComplete && (
              <Modal onRestart={restartGame} moves={moves} time={time} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PairGame;
