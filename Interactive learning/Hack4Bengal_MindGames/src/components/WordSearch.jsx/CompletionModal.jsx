import React from "react";

const CompletionModal = ({ isOpen, time, onPlayAgain }) => {
  if (!isOpen) return null;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg py-14 px-20 shadow-lg max-w-md text-center">
        <h2 className="text-4xl font-bold text-orange-600 mb-4">Congratulations!</h2>
        <p className="text-2xl mb-4 text-orange-500 font-bold">You found all the words!</p>
        <p className="text-2xl mb-4 font-bold text-orange-800">
          Time taken:{formatTime(time)}
        </p>
        <button
          onClick={onPlayAgain}
          className="mt-4 px-6 py-3 bg-orange-600 text-white text-xl font-semibold rounded-full hover:bg-orange-700 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;
