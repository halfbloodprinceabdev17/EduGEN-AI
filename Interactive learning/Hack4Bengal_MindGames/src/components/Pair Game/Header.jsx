import React from "react";

function Header({ moves, time, onRestart }) {
  return (
    <div className="flex gap-x-10 justify-center items-center mb-4">
      <div className="text-3xl font-bold">Moves: {moves}</div>
      <div className="text-3xl font-bold">Time: {time}s</div>
      <button
        onClick={onRestart}
        className="px-12 py-3 bg-red-500 text-white text-xl font-semibold rounded-full hover:bg-red-600"
      >
        Restart
      </button>
    </div>
  );
}

export default Header;
