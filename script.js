// Gameboard Module
const Gameboard = (() => {
    const board = Array(9).fill(null);
  
    const resetBoard = () => board.fill(null);
  
    const placeMarker = (index, marker) => {
      if (board[index] === null) {
        board[index] = marker;
        return true;
      }
      return false;
    };
  
    const getBoard = () => [...board];
  
    return { resetBoard, placeMarker, getBoard };
  })();
  
  // Player Factory
  const Player = (name, marker) => {
    return { name, marker, score: 0 };
  };
  
  // Game Controller Module
  const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
    let gamesPlayed = 0;
    let totalGames = parseInt(document.getElementById("totalGames").value);
  
    const switchTurn = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const checkWin = () => {
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      const board = Gameboard.getBoard();
      return winningCombos.some(combo => 
        combo.every(index => board[index] === currentPlayer.marker)
      );
    };
  
    const checkTie = () => Gameboard.getBoard().every(cell => cell !== null);
  
    const playRound = (index) => {
      if (!gameOver && Gameboard.placeMarker(index, currentPlayer.marker)) {
        DisplayController.renderBoard();
  
        if (checkWin()) {
          currentPlayer.score++;
          gamesPlayed++;
          gameOver = true;
          DisplayController.updateScore(currentPlayer); // Update only the winner's score
          DisplayController.displayEndMessage(`${currentPlayer.name} wins!`);
          checkOverallWinner();
        } else if (checkTie()) {
          gamesPlayed++;
          gameOver = true;
          DisplayController.displayEndMessage("It's a tie!");
          checkOverallWinner();
        } else {
          switchTurn();
        }
      }
    };
  
    const resetGame = () => {
      Gameboard.resetBoard();
      currentPlayer = player1;
      gameOver = false;
      DisplayController.resetDisplay();
    };
  
    const checkOverallWinner = () => {
      if (gamesPlayed >= totalGames) {
        const overallWinner = player1.score > player2.score ? player1.name : player2.name;
        DisplayController.displayEndMessage(`${overallWinner} is the overall winner!`);
        gamesPlayed = 0;
        player1.score = 0;
        player2.score = 0;
        DisplayController.updateScore(); // Reset scores to 0 in display
      }
    };
  
    const updateTotalGames = () => {
      totalGames = parseInt(document.getElementById("totalGames").value);
    };
  
    document.getElementById("totalGames").addEventListener("input", updateTotalGames);
  
    return { playRound, resetGame, getCurrentPlayer: () => currentPlayer };
  })();
  
  // Display Controller Module
  const DisplayController = (() => {
    const boardContainer = document.querySelector("#board");
    const messageDisplay = document.querySelector("#message");
    const restartButton = document.querySelector("#restartButton");
  
    const renderBoard = () => {
      boardContainer.innerHTML = "";
      Gameboard.getBoard().forEach((marker, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = marker || "";
        cell.addEventListener("click", () => GameController.playRound(index));
        boardContainer.appendChild(cell);
      });
    };
  
    const displayEndMessage = (message) => {
      messageDisplay.textContent = message;
    };
  
    const resetDisplay = () => {
      renderBoard();
      messageDisplay.textContent = "";
    };
  
    const updateScore = (winner = null) => {
      if (winner) {
        // Update only the winner's score
        const scoreElementId = winner.marker === "X" ? "player1Score" : "player2Score";
        document.getElementById(scoreElementId).textContent = winner.score;
      } else {
        // Reset both scores (for overall reset)
        document.getElementById("player1Score").textContent = GameController.getCurrentPlayer().score;
        document.getElementById("player2Score").textContent = GameController.getCurrentPlayer().score;
      }
    };
  
    restartButton.addEventListener("click", GameController.resetGame);
  
    return { renderBoard, displayEndMessage, resetDisplay, updateScore };
  })();
  
  // Initial rendering of the board on page load
  document.addEventListener("DOMContentLoaded", () => {
    DisplayController.renderBoard();
  });
  