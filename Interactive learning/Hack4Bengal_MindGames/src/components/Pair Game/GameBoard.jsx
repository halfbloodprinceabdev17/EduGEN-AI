import React from "react";
import Card from "./Card";

function GameBoard({ cards, flippedCards, matchedCards, onCardClick, difficulty }) {
  const gridColumns = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;
  console.log(gridColumns);
  return (
    <div className="flex justify-center items-center`">
      <div className={`border-4 border-purple-700 rounded-2xl grid ${gridColumns === 4 ? 'grid-cols-4' : gridColumns === 6 ? 'grid-cols-6' : 'grid-cols-8'} gap-4 p-4`}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            value={card.value}
            isFlipped={flippedCards.includes(index) || matchedCards.includes(index)}
            onClick={() => onCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
