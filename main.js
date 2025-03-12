const BOARD_SIZE = 3;
const MARKER_X = "x";
const MARKER_O = "o";

const TicTacToe = (function () {
  let gameBoard = createGameBoard();
  let currentTurn = 1;

  // public methods
  const getBlocks = () => gameBoard;
  const markBlock = (y, x) => {
    if (gameBoard[y][x].getMarker()) return;
    const marker = currentTurn === 1 ? MARKER_X : MARKER_O;
    gameBoard[y][x].setMarker(marker);
    currentTurn = currentTurn === 1 ? 2 : 1;
    return evaluate();
  };
  const resetBlocks = () => {
    gameBoard = createGameBoard();
  };

  // private methods

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
      const mark1 =
        gameBoard[winningComb[i][0][0]][winningComb[i][0][1]].getMarker();
      const mark2 =
        gameBoard[winningComb[i][1][0]][winningComb[i][1][1]].getMarker();
      const mark3 =
        gameBoard[winningComb[i][2][0]][winningComb[i][2][1]].getMarker();
      if (mark1 === mark2 && mark2 === mark3) {
        return mark1;
      }
    }
    return null;
  }

  function createGameBoard() {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      const row = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        row.push(createBlock(y, x));
      }
      board.push(row);
    }
    return board;
  }

  function createBlock(y, x) {
    // IFFE method that returns the y,x position
    // this way it can't be modified outside
    let marker = null;
    const getPos = () => ({ y, x });
    const setMarker = (m) => (marker = m);
    const getMarker = () => marker;
    return { getPos, setMarker, getMarker };
  }

  return { getBlocks, markBlock, resetBlocks };
})();

const boardEl = document.getElementById("board");
function displayBlocks(blocks, markers) {
  boardEl.innerHTML = "";
  blocks.forEach((b) => {
    const blockEl = document.createElement("div");
    const markerImg = document.createElement("img");
    blockEl.className = "block";
    markerImg.className = "marker";

    if (b.getMarker() === MARKER_X) markerImg.src = "./asset/sword.svg";
    else if (b.getMarker() === MARKER_O) {
      markerImg.src = "./asset/shield.svg";
    }
    blockEl.dataset.y = b.getPos().y;
    blockEl.dataset.x = b.getPos().x;

    blockEl.append(markerImg);
    boardEl.append(blockEl);

    blockEl.addEventListener("click", (e) => {
      const b = e.target;
      const winningMark = TicTacToe.markBlock(b.dataset.y, b.dataset.x);
      let flattenBlocksArray = TicTacToe.getBlocks().flat();

      if (winningMark) {
        const player = winningMark === MARKER_O ? "Player Two" : "Player One";
        alert(`${player} WINS!`); // TODO: add a UI to dispaly the winner instead of just alert
        TicTacToe.resetBlocks();
        flattenBlocksArray = TicTacToe.getBlocks().flat(); // re-evaluate the flatten array to the new value of the gameboard;
      }

      displayBlocks(flattenBlocksArray);
    });
  });
}

// MAIN PROCESS
const flattenBlocksArray = TicTacToe.getBlocks().flat();
displayBlocks(flattenBlocksArray);
