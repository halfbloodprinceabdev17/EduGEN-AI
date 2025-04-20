const instructions = {
  slidingPuzzle: {
    name: "Slide Puzz",
    img: "/images/SlidePuzzle.webp",
    link: "/sliding-puzzle",
    description:
      "A sliding puzzle is a combination puzzle that challenges a player to slide (frequently flat) pieces along certain routes (usually on a board) to establish a certain end-configuration. The pieces to be moved may consist of simple shapes, or they may be imprinted with colors, patterns, sections of a larger image (like a jigsaw puzzle), numbers, or letters.",
    rules: [
      "The puzzle consists of a 4x4 grid with tiles that are mixed up.",
      "The objective is to rearrange the tiles to form the correct image or pattern.",
      "You can move a tile by clicking on it, and it will slide into the empty space.",
      "You can only move tiles adjacent to the empty space.",
      "Complete the puzzle by arranging the tiles in the correct order to win!",
    ],
  },
  sudoku: {
    name: "Sudoku",
    img: "/images/sudoku.jpg",
    link: "/sliding-puzzle",
    description:
      "Sudoku is a logic-based, combinatorial number-placement puzzle. The objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids that compose the grid contain all of the digits from 1 to 9.",
    rules: [
      "Fill the grid so every row, column, and 3x3 box contains numbers 1-9",
      "Use logical reasoning; no guessing is needed!",
      "Avoid duplicates in rows, columns, or 3x3 boxes.",
      "Use the Check button to highlight any mistakes.",
      "Complete the grid to win!",
    ],
  },
  crosswordPuzzle: {
    name: "Cross Word Victor",
    img: "/images/crossword-icon.jpg",
    link: "/crossword-game",
    description:
      "A crossword is a word puzzle that usually takes the form of a square or a rectangular grid of white-and black-shaded squares. The game's goal is to fill the white squares with letters, forming words or phrases, by solving clues that lead to the answers.",
    rules: [
      "Fill the grid with the correct words based on the clues provided.",
      "Clues are available for both Across and Down directions.",
      "Click on an empty cell to start typing your answer.",
      "The number will show up in the top-left corner of each starting cell",
      "Complete the crossword without any mistakes to win!",
    ],
  },
  flipFusion: {
    name: "Flip Fusion",
    img: "/images/fusion.webp",
    link: "/pair-game",
    description:
      "Flip Fusion is a memory game that challenges players to find matching pairs of cards. The objective is to match all the pairs in the fewest moves possible.",
    rules: [
      "Match all the pairs of cards to win the game.",
      "Click on a card to flip it and reveal its value.",
      "If two flipped cards match, they remain flipped.If they don’t match, they will flip back after a short delay.",
      "Choose difficulty: Easy (4x4), Medium (6x6), Hard (8x8).",
      "Try to complete the game in as few moves as possible!",
    ],
  },
  wordSearch: {
    name: "Word Search",
    img: "/images/word-search.jpg",
    link: "/word-search",
    description:
      "A word search is a puzzle that consists of letters of words placed in a grid, which usually has a rectangular or square shape. The objective is to find and mark all the words hidden inside the grid.",
    rules: [
      "Find all the hidden words in the grid.",
      "Words can be placed horizontally, vertically, or diagonally.",
      "Use the list of words to guide you through the grid.",
      "Click to select box and again click on selected box to deselect.",
      "Complete the word search to win!",
    ],
  },
  spotTheDifference: {
    name: "Spot The Difference",
    img: "/images/spot-the-difference.webp",
    link: "/sliding-puzzle",
    description:
      "Spot the Difference is a puzzle game where players are challenged to find the differences between two similar images. The objective is to find and click on all the differences before time runs out.",
    rules: [
      "Find and click on all the differences between the two images.",
      "Differences can be in color, shape, size, or position.",
      "Click the Skip button to move to the next set of images.",
      "Remember, you can skip only once.",
      "Click on the difference to pass the level.",
      "Reach level 30 to win!",
    ],
  },
};

export default instructions;
