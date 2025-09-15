const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const scoreboard = document.getElementById('scoreboard');
const restartBtn = document.getElementById('restart');

const pvpBtn = document.getElementById('pvpBtn'); // New
const pvcBtn = document.getElementById('pvcBtn'); // New

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let scores = { X: 0, O: 0, Draws: 0 };
let mode = "PvP"; // default mode is Player vs Player

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Cols
  [0,4,8], [2,4,6]           // Diags
];

function handleClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || !isGameActive) return;

  makeMove(index, currentPlayer);

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    scores[currentPlayer]++;
    isGameActive = false;
  } else if (isDraw()) {
    statusText.textContent = "It's a draw!";
    scores.Draws++;
    isGameActive = false;
  } else {
    if (mode === "PvP") {
      // Player vs Player: Switch player
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    } else if (mode === "PvC") {
      // Player vs Computer: Computer plays next
      currentPlayer = "O";
      statusText.textContent = "Computer's turn...";
      setTimeout(computerMove, 500); // Delay for realism
    }
  }

  updateScoreboard();
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function computerMove() {
  if (!isGameActive) return;

  const available = board.map((val, idx) => val === "" ? idx : null).filter(i => i !== null);

  // Simple random AI
  const choice = available[Math.floor(Math.random() * available.length)];
  makeMove(choice, "O");

  if (checkWinner("O")) {
    statusText.textContent = "Computer wins!";
    scores.O++;
    isGameActive = false;
  } else if (isDraw()) {
    statusText.textContent = "It's a draw!";
    scores.Draws++;
    isGameActive = false;
  } else {
    currentPlayer = "X";
    statusText.textContent = "Player X's turn";
  }

  updateScoreboard();
}

function checkWinner(player) {
  return winningCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function isDraw() {
  return board.every(cell => cell !== "");
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  cells.forEach(cell => cell.textContent = "");
  statusText.textContent = `Player X's turn (${mode})`;
}

function updateScoreboard() {
  scoreboard.textContent = `X: ${scores.X} | O: ${scores.O} | Draws: ${scores.Draws}`;
}

function setMode(newMode) {
  mode = newMode;
  restartGame();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

// New: Mode switch buttons
pvpBtn.addEventListener('click', () => setMode("PvP"));
pvcBtn.addEventListener('click', () => setMode("PvC"));

updateScoreboard();
statusText.textContent = `Player X's turn (${mode})`;

