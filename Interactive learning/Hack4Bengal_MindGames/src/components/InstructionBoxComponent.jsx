import React from "react";

function InstructionBoxComponent({ onProceed, color, rules }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Glowing blur background */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 rounded-full blur-[120px] opacity-20 animate-pulse z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-[100px] opacity-20 animate-pulse z-0" />

      {/* Glassmorphic Instruction Card */}
      <div className="relative z-10 backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-3xl max-w-3xl w-full p-10 text-white">
        <h1 className={`text-4xl font-extrabold text-${color}-400 mb-8 text-center drop-shadow-md`}>
          📜 How to Play
        </h1>

        <div className="max-h-[300px] overflow-y-auto pr-2">
          <ul className="list-decimal list-inside space-y-4 text-lg font-medium text-white/90">
            {rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onProceed}
            className={`bg-${color}-600 hover:bg-${color}-700 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md transition duration-200 ease-in-out`}
          >
            Let’s Begin 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructionBoxComponent;
