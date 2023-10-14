const COLS = 100;
const ROWS = 40;
let snakePos = [Math.floor(COLS / 2), Math.floor(ROWS / 2)];
let beatPos = getBeatPosition();
const DIRS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

function isSnakeOutOfGrid(dir) {
  let res = false;
  switch (dir) {
    case "ArrowUp":
      if (snakePos[1] === 0) {
        res = true;
      }
      break;
    case "ArrowDown":
      if (snakePos[1] === ROWS - 1) {
        res = true;
      }
      break;
    case "ArrowLeft":
      if (snakePos[0] === 0) {
        res = true;
      }
      break;
    case "ArrowRight":
      if (snakePos[0] === COLS - 1) {
        res = true;
      }
      break;
    default:
      throw Error(`ERROR: could not know direction of ${dir}`);
  }
  return res;
}

function moveSnake(dir) {
  const isSnakeOut = isSnakeOutOfGrid(dir);

  switch (dir) {
    case "ArrowUp":
      if (isSnakeOut) {
        snakePos = [snakePos[0], ROWS - 1];
      } else {
        snakePos = [snakePos[0], snakePos[1] - 1];
      }
      break;
    case "ArrowDown":
      if (isSnakeOut) {
        snakePos = [snakePos[0], 0];
      } else {
        snakePos = [snakePos[0], snakePos[1] + 1];
      }
      break;
    case "ArrowLeft":
      if (isSnakeOut) {
        snakePos = [COLS - 1, snakePos[1]];
      } else {
        snakePos = [snakePos[0] - 1, snakePos[1]];
      }
      break;
    case "ArrowRight":
      if (isSnakeOut) {
        snakePos = [0, snakePos[1]];
      } else {
        snakePos = [snakePos[0] + 1, snakePos[1]];
      }
      break;
    default:
      throw Error(`ERROR: could not know direction of ${dir}`);
  }
}

function getBeatPosition() {
  let col = Math.floor(Math.random() * COLS);
  let row = Math.floor(Math.random() * ROWS);
  if (col === snakePos[0] && row == snakePos[1]) {
    if (col < COLS - 1) {
      return [col + 1, row];
    } else if (col > 0) {
      return [col - 1, row];
    }
  }
  return [col, row];
}

function checkIfBeatEaten() {
  const [beatCol, beatRow] = beatPos;
  const [snakeCol, snakeRow] = snakePos;

  if (beatCol !== snakeCol || beatRow !== snakeRow) {
    return;
  }

  beatPos = getBeatPosition();
}

function keyPressHandler(e) {
  const dir = e.key;
  if (!DIRS.includes(dir)) {
    return;
  }
  moveSnake(dir);
  checkIfBeatEaten();
  renderGrid();
}

function renderGrid() {
  const [beatCol, beatRow] = beatPos;
  const [snakeCol, snakeRow] = snakePos;

  const gridContainer = document.createElement("div");
  gridContainer.id = "grid";

  for (let i = 0; i < ROWS; ++i) {
    const rowContainer = document.createElement("div");
    rowContainer.className = "row-container";
    for (let j = 0; j < COLS; ++j) {
      const cell = document.createElement("span");
      cell.className = "cell";
      if (i === beatRow && j == beatCol) {
        cell.classList.add("beat-cell");
      }
      if (i === snakeRow && j == snakeCol) {
        cell.classList.add("snake-cell");
      }

      rowContainer.appendChild(cell);
    }
    gridContainer.appendChild(rowContainer);
  }
  document.body.innerHTML = "";
  document.body.appendChild(gridContainer);
}

document.addEventListener("keydown", keyPressHandler);

renderGrid(snakePos);
