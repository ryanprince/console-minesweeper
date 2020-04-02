const prompt = require('prompt-sync')({ sigint: true });
const Board = require('./Board');

const mRows = 5;
const nCols = 5;
const nMines = 5;

const gameBoard = new Board(mRows, nCols, nMines);

function playerHasLost(board) {
  return board.revealedMineCount() !== 0;
}

function playerHasWon(board) {
  return (board.revealedCount() === board.mRows * board.nCols - board.mineCount)
    && !playerHasLost(board);
}

while (!playerHasWon(gameBoard) && !playerHasLost(gameBoard)) {
  console.log(gameBoard.toPlayerView());
  const rowIndex = Number(prompt('Enter the row: '));
  const colIndex = Number(prompt('Enter the col: '));
  gameBoard.revealSpace(rowIndex, colIndex);
  console.log('');
}

console.log(gameBoard.toPlayerView());

if (playerHasWon(gameBoard)) {
  console.log('Congratulations! You won!');
}

if (playerHasLost(gameBoard)) {
  console.log('Better luck next time!');
}

console.log('\nSolution:');
console.log(gameBoard.toSolutionView());
