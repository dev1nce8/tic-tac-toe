const BOARD_SIZE = 3;
const MARKER_O = "o";
const MARKER_X = "x";

//Create a gameController that handles the game flow
(function GameController() {
  let winner = null;
  const playerOne = Player("player one", MARKER_O);
  const playerTwo = Player("player Two", MARKER_X);
  const gameBoard = Gameboard({
    size: 3,
    playerOneMarker: playerOne.marker,
    playerTwoMarker: playerTwo.marker,
  });

  // GAME LOGIC
  function play() {
    const currentTurn = gameBoard.getCurrentTurn();
    const move = prompt(`${currentTurn}'s turn'`);
    const [y, x] = [Number(move[0]), Number(move[1])];

    gameBoard.play(y, x);
    gameBoard.switchTurn();
    draw();
    winner = gameBoard.evaluate();
  }

  function draw() {
    console.clear();
    const board = gameBoard.getBoard();
    board.forEach((row) => {
      console.log(row);
    });
  }
  while (!winner) {
    play();
  }

  if (winner === "o") {
    console.log("Player One Wins! Congrats");
  } else {
    console.log("Player Two Wins! Congrats");
  }
})();

/* 
  Create a Gameboard object that stores the cells that the user can click
  Create a Player object
  Create a gameController that handles the game flow
  Create a uiController that handles UI

  Little to not global code as possible
  Try to place a much as you can inside factories
  Wrap the factory inside IIFE if only one instance
*/

// Create a Gameboard object that stores the cells that the user can click
function Gameboard({ size, playerOneMarker, playerTwoMarker }) {
  const board = [];
  const p1Marker = playerOneMarker;
  const p2Marker = playerTwoMarker;
  let currentTurn = p1Marker;
  let winningMark = null;

  // generates a board
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push(null);
    }
    board.push(row);
  }
  // Main Logic

  const play = (y, x) => {
    if (board[y][x]) return;
    board[y][x] = currentTurn;
  };

  const getWinningMark = () => winningMark;

  // PRIVATE METHODS

  function switchTurn() {
    currentTurn = currentTurn === p1Marker ? p2Marker : p1Marker;
  }

  function evaluate() {
    //prettier-ignore
    const winningComb = [
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]],
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
    ];
    for (let i = 0; i < winningComb.length; i++) {
      const mark1 = board[winningComb[i][0][0]][winningComb[i][0][1]];
      const mark2 = board[winningComb[i][1][0]][winningComb[i][1][1]];
      const mark3 = board[winningComb[i][2][0]][winningComb[i][2][1]];
      if (mark1 === mark2 && mark2 === mark3) {
        return mark1;
      }
    }
    return null;
  }

  function getBoard() {
    return board;
  }

  function getCurrentTurn() {
    return currentTurn;
  }

  return {
    play,
    getWinningMark,
    evaluate,
    switchTurn,
    getBoard,
    getCurrentTurn,
  };
}

// Create a Player object
function Player(name, marker) {
  return { name, marker };
}

//   Create a uiController that handles UI
function UiController() {}
