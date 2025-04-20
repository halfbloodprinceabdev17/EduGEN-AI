import { Routes, Route, BrowserRouter } from "react-router-dom";
// import PairGame from "./pages/PairGame";
// import Home from "./pages/Home";
// import SudokuGame from "./pages/Sudoku";
import Crossword from "./pages/CrosswordPuzzle";
import SlidingPuzzleGame from "./pages/SlidingPuzzleGame";
import WordSearchGame from "./pages/wordsearchgame";
// import SpotTheDifference from "./pages/SpotTheDifference";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="pair-game" element={<PairGame />} /> */}
        {/* <Route path="sudoku-game" element={<SudokuGame />} /> */}
        <Route path="crossword-game" element={<Crossword />} />
        <Route path="sliding-puzzle" element={<SlidingPuzzleGame />} />
        <Route path="word-search" element={<WordSearchGame />} />
        {/* <Route path="spot-the-difference" element={<SpotTheDifference />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
