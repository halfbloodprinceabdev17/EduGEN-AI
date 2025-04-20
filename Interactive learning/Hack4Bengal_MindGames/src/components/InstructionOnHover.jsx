import React from "react";

const InstructionOnHover = ({ ruleSet, color }) => {
  return (
    <>
      <button
        className={`absolute top-5 right-5 peer cursor-help p-1 bg-${color}-100 rounded-full z-10`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#222222"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </button>
      <div className="absolute top-12 right-12 bg-gray-800 p-5 rounded-lg shadow-lg hidden peer-hover:block opacity-90 z-50">
        <h1 className={`text-2xl font-bold text-${color}-200 mb-4 text-center`}>
          Instructions
        </h1>
        <ol className="list-decimal list-inside">
          {ruleSet.map((rule) => (
            <li className="text-lg text-gray-200">{rule}</li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default InstructionOnHover;
