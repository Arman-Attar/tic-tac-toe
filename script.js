const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (position, marker) => {
    if (board[position] === "") {
      board[position] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, updateBoard, resetBoard };
})();

const gameController = (() => {
  const winningCombos = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal
    [2, 4, 6], // diagonal
  ];

  const player1 = Player("X");
  const player2 = Player("O");
  let currentPlayer = player1;
  let gameOver = false;

  const playRound = (index) => {
    if (gameOver) return;

    const moveSuccess = gameBoard.updateBoard(index, currentPlayer.marker);

    if (!moveSuccess) {
      console.log("Spot is already taken");
      return;
    }


    if (checkWinner(gameBoard.getBoard(), currentPlayer.marker)) {
      alert(`${currentPlayer.marker} wins!`);
      gameOver = true;
      restartGame()
      return;
    }

    if (checkTie(gameBoard.getBoard())) {
      alert("It's a tie");
      gameOver = true;
      restartGame()
      return;
    }

    switchPlayer();
    console.log(`It's ${currentPlayer.marker}'s turn`);
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const checkWinner = (board, marker) => {
    return winningCombos.some((combo) =>
      combo.every((index) => board[index] === marker)
    );
  };

  const checkTie = (board) => {
    return board.every((cell) => cell != "");
  };

  const restartGame = () => {
    gameBoard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    console.log("Game restarted!");
  };

  return { switchPlayer, getCurrentPlayer, restartGame, playRound, checkWinner, checkTie };
})();

function Player(marker) {
  return {
    marker,
  };
}

const DisplayController = (() => {
    const boardElement = document.querySelector('.board')

    const renderBoard = () => {
        boardElement.textContent = ""
        gameBoard.getBoard().forEach((cell, index) => {
            const cellElement = document.createElement("div")
            cellElement.classList.add("cell")
            cellElement.dataset.index = index
            cellElement.textContent = cell
            cellElement.addEventListener("click", () => makeMove(index))
            boardElement.appendChild(cellElement)
        });
    }

    const makeMove = (index) => {
        if (gameBoard.getBoard()[index] !== "") return
        gameController.playRound(index);
        renderBoard()
    }


    return {renderBoard}
})()


DisplayController.renderBoard()