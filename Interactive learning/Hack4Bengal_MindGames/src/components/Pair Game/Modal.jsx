import React from "react";

function Modal({ moves, time, onRestart }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-gradient-to-br from-white via-purple-100 to-purple-300 p-10 rounded-2xl m-2 text-center">
        <h2 className="text-4xl mb-4 font-bold text-purple-600">🎉 Congratulations! 🎉</h2>
        <p className="mb-2 text-2xl font-bold text-purple-800">You completed the game!</p>
        <p className="mb-2 text-xl font-bold text-purple-900">Moves: {moves}</p>
        <p className="mb-4 text-xl font-bold text-purple-900">Time: {time}s</p>
        <button
          onClick={onRestart}
          className="mt-2 px-6 py-3 bg-purple-600 text-white text-xl font-bold rounded-full hover:bg-purple-800"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default Modal;
