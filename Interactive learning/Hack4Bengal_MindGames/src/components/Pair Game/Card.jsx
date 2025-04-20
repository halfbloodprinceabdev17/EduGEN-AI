import React from "react";
import { Howl } from "howler";

function Card({ value, isFlipped, onClick }) {
  // const playFlipSound = () => {
  //   const flipSound = new Howl({
  //     src: ['/sounds/sound.wav'],
  //           });
  //   flipSound.play();
  // };
  const flipSound = new Audio("/sounds/sound.wav");

  const handleCardClick = () => {
    if (!isFlipped) {
      flipSound.play();
      onClick();
    }
  };

  return (
    <div className="group perspective w-20 h-20" onClick={handleCardClick}>
      <div
        className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute backface-hidden w-full h-full bg-purple-500 flex justify-center items-center text-white font-extrabold text-4xl shadow-md rounded-lg">
          ?
        </div>
        <div className="absolute rotate-y-180 backface-hidden w-full h-full bg-purple-500 flex justify-center items-center text-white font-extrabold text-4xl shadow-md rounded-lg">
          {value}
        </div>
      </div>
    </div>
  );
}

export default Card;
