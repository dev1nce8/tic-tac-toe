const BOARD_SIZE = 3;
const MARKER_O = "o";
const MARKER_X = "x";

(function GameController() {
  let winner = null;
  const playerOne = Player("player one", MARKER_O);
  const playerTwo = Player("player Two", MARKER_X);
  const gameBoard = Gameboard({
    size: 3,
    playerOneMarker: playerOne.marker,
    playerTwoMarker: playerTwo.marker,
  });
  const uiController = UiController();

  uiController.setRestartCallback(() => {
    gameBoard.restartGame();
    console.log(gameBoard.getBoard());
    winner = null;
    uiController.closeWinnerModal();
    let cells = gameBoard.getBoard();
    uiController.drawCells(cells.flat());
  });

  // GAME LOGIC
  function play() {
    let cells = gameBoard.getBoard();
    uiController.setClickCellCallback((cellEl) => {
      const [y, x] = [cellEl.dataset.y, cellEl.dataset.x];
      const isSuccessfullMove = gameBoard.play(y, x);
      winner = gameBoard.evaluate();
      if (isSuccessfullMove) {
        uiController.markCell(cellEl, gameBoard.getCurrentMarker());
        gameBoard.switchMarker();
      }
      cells = gameBoard.getBoard(); // update the cells array
      if (winner) {
        const name =
          playerOne.marker === winner ? playerOne.name : playerTwo.name;
        uiController.openWinnerModal(name);
      }
    });

    // the cells array from gameBoard is a 2d array
    // so inorder for drawCells to work we need to flatten out
    // the cells array
    uiController.drawCells(cells.flat());
  }

  play();
})();

function Gameboard({ size, playerOneMarker, playerTwoMarker }) {
  let board = [];
  const p1Marker = playerOneMarker;
  const p2Marker = playerTwoMarker;
  let currentMarker = p1Marker;

  generateBoard(); // initail board

  const play = (y, x) => {
    if (board[y][x].marker) return false;
    board[y][x].marker = currentMarker;
    return true;
  };

  const restartGame = () => {
    generateBoard();
    currentMarker = p1Marker;
  };

  const getWinningMark = () => winningMark;

  const switchMarker = () => {
    currentMarker = currentMarker === p1Marker ? p2Marker : p1Marker;
  };

  const evaluate = () => {
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
      const mark1 = board[winningComb[i][0][0]][winningComb[i][0][1]].marker;
      const mark2 = board[winningComb[i][1][0]][winningComb[i][1][1]].marker;
      const mark3 = board[winningComb[i][2][0]][winningComb[i][2][1]].marker;
      if (mark1 === mark2 && mark2 === mark3) {
        return mark1;
      }
    }
    return null;
  };

  const getBoard = () => board;

  const getCurrentMarker = () => currentMarker;

  // Privates
  function generateBoard() {
    board = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        row.push({ y, x, marker: null });
      }
      board.push(row);
    }
  }

  return {
    play,
    getWinningMark,
    evaluate,
    getBoard,
    switchMarker,
    getCurrentMarker,
    restartGame,
  };
}

function Player(name, marker) {
  return { name, marker };
}

function UiController() {
  const container = document.getElementById("board");
  const winnerBoard = document.getElementById("winner-board");
  const winnerName = document.querySelector("#winner-board #name");
  const playAgainButton = document.getElementById("play-again-button");
  let clickEventFunc;
  let restartCallback;

  playAgainButton.addEventListener("click", () => restartCallback());

  const drawCells = (cells) => {
    container.innerHTML = "";
    cells.forEach((c) => {
      const el = document.createElement("div");
      el.className = "cell";
      el.dataset.y = c.y;
      el.dataset.x = c.x;
      container.append(el);

      el.addEventListener("click", (e) => {
        clickEventFunc(e.target);
      });
    });
  };

  const markCell = (target, marker) => {
    const img = document.createElement("img");
    img.className = "marker"; // this class have set the pointer-events..
    // to none to prevent the eventListener from referring to this image
    // when reading data-y and data-x, causing an `undefined` bug when
    // passing it to the gameboard.play()
    const src =
      marker === MARKER_O ? "./asset/shield.svg" : "./asset/sword.svg";
    img.src = src;
    target.append(img);
  };

  const setClickCellCallback = (cb) => {
    clickEventFunc = cb;
  };
  const setRestartCallback = (cb) => {
    restartCallback = cb;
  };

  const openWinnerModal = (name) => {
    winnerName.innerText = name;
    winnerBoard.showModal();
  };
  const closeWinnerModal = () => {
    winnerBoard.close();
  };

  return {
    drawCells,
    setClickCellCallback,
    markCell,
    openWinnerModal,
    closeWinnerModal,
    setRestartCallback,
  };
}
