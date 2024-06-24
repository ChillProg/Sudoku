let initialBoard = [];
let solutionBoard = [];
let startTime;
let timerInterval;

async function fetchSudoku() {
  try {
    const response = await fetch("https://sudoku-api.vercel.app/api/dosuku");
    const data = await response.json();
    if (
      data &&
      data.newboard &&
      data.newboard.grids &&
      data.newboard.grids[0]
    ) {
      initialBoard = data.newboard.grids[0].value.map((row) =>
        row.map((cell) => (cell === 0 ? null : cell))
      );
      solutionBoard = data.newboard.grids[0].solution;
      createBoard(initialBoard);
      startTime = Date.now(); // Iniciar el contador de tiempo
      startTimer();
    } else {
      alert("Error al obtener el Sudoku.");
    }
  } catch (error) {
    console.error("Error fetching Sudoku:", error);
    alert("Error al obtener el Sudoku.");
  }
}

function createBoard(board) {
  const container = document.getElementById("sudoku-container");
  container.innerHTML = "";

  for (let subgridRow = 0; subgridRow < 3; subgridRow++) {
    for (let subgridCol = 0; subgridCol < 3; subgridCol++) {
      const subgrid = document.createElement("div");
      subgrid.className = "subgrid";

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const cellRow = subgridRow * 3 + row;
          const cellCol = subgridCol * 3 + col;
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.className = "cell";
          cell.dataset.row = cellRow; // Añadir atributo data-row
          cell.dataset.col = cellCol; // Añadir atributo data-col
          if (board[cellRow][cellCol] !== null) {
            cell.textContent = board[cellRow][cellCol];
            cell.classList.add("fixed");
          } else {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.addEventListener("input", (e) => {
              const value = e.target.value;
              if (!/^[1-9]$/.test(value)) {
                e.target.value = "";
              }
              checkBoardCompletion();
            });
            cell.appendChild(input);
          }
          subgrid.appendChild(cell);
        }
      }

      container.appendChild(subgrid);
    }
  }
}

function checkBoardCompletion() {
  const cells = document.querySelectorAll(".cell");
  let complete = true;

  cells.forEach((cell) => {
    const input = cell.querySelector("input");
    if (input && !input.value) {
      complete = false;
    }
  });

  const checkButton = document.getElementById("check-button");
  checkButton.disabled = !complete;
}

function checkSudoku() {
  const cells = document.querySelectorAll(".cell");
  let correct = true;

  cells.forEach((cell) => {
    const input = cell.querySelector("input");
    if (input) {
      const cellRow = parseInt(cell.dataset.row);
      const cellCol = parseInt(cell.dataset.col);
      const value = parseInt(input.value);

      if (value !== solutionBoard[cellRow][cellCol]) {
        input.style.color = "red";
        correct = false;
      } else {
        input.style.color = "black";
      }
    }
  });

  if (correct) {
    stopTimer();
    alert("Sudoku successfully solved!");
  } else {
    alert("The Sudoku contains errors.");
  }
}

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  startTime = Date.now();
  updateTimer();
  startTimer();
}

function updateTimer() {
  const elapsedTime = Date.now() - startTime;
  const minutes = Math.floor(elapsedTime / (1000 * 60));
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  document.getElementById("timer").textContent = `Time: ${formattedTime}`;
}

function initializeSudoku() {
  fetchSudoku();
  document.getElementById("check-button").disabled = true;
}

window.onload = () => {
  initializeSudoku();
};
