import Snake from "./snake.js";

const COLS = 100;
const ROWS = 40;
let snakePos = [Math.floor(COLS / 2), Math.floor(ROWS / 2)];
const snakeBody = new Snake(snakePos);

let beatPos = getBeatPosition();
const DIRS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

function isSnakeOutOfGrid(dir) {
  let res = false;
  let snakePos = snakeBody.tail.value;
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
  let snakePos = snakeBody.tail.value;
  switch (dir) {
    case "ArrowUp":
      snakeBody.moveSnake([
        snakePos[0],
        isSnakeOut ? ROWS - 1 : snakePos[1] - 1,
      ]);
      break;
    case "ArrowDown":
      snakeBody.moveSnake([snakePos[0], isSnakeOut ? 0 : snakePos[1] + 1]);
      break;
    case "ArrowLeft":
      snakeBody.moveSnake([
        isSnakeOut ? COLS - 1 : snakePos[0] - 1,
        snakePos[1],
      ]);
      break;
    case "ArrowRight":
      snakeBody.moveSnake([isSnakeOut ? 0 : snakePos[0] + 1, snakePos[1]]);
      break;
    default:
      throw Error(`ERROR: could not know direction of ${dir}`);
  }

  let cur = snakeBody.head;
  while (cur) {
    console.log(cur.value);
    cur = cur.next;
  }
}

function getBeatPosition() {
  let col = Math.floor(Math.random() * COLS);
  let row = Math.floor(Math.random() * ROWS);
  if (isSnakeCell([col, row])) {
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
  const [snakeCol, snakeRow] = snakeBody.tail.value;

  if (beatCol !== snakeCol || beatRow !== snakeRow) {
    return;
  }

  beatPos = getBeatPosition();
  snakeBody.unshift();
}

function isSnakeCell(pos) {
  const [posCol, posRow] = pos;
  const isSnakeHead =
    posCol === snakeBody.tail.value[0] && snakeBody.tail.value[1] === posRow;
  let cur = snakeBody.head;

  while (cur) {
    if (cur.value[0] === posCol && cur.value[1] === posRow) {
      return [true, isSnakeHead];
    }
    cur = cur.next;
  }
  return [false, isSnakeHead];
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

  const gridContainer = document.createElement("div");
  gridContainer.id = "grid";

  for (let i = 0; i < ROWS; ++i) {
    const rowContainer = document.createElement("div");
    rowContainer.className = "grid__row";
    for (let j = 0; j < COLS; ++j) {
      const [_isSnakeCell, isSnakeHead] = isSnakeCell([j, i]);
      const cell = document.createElement("div");
      cell.className = "row__cell";
      cell.setAttribute("cell-pos", `${j},${i}`);
      if (i === beatRow && j == beatCol) {
        cell.classList.add("row__cell--beat-cell");
      } else if (_isSnakeCell) {
        if (isSnakeHead) {
          cell.classList.add("row__cell--snake-head-cell");
        } else {
          cell.classList.add("row__cell--snake-body-cell");
        }
      }
      if (!_isSnakeCell) {
        const cellDot = document.createElement("span");
        cellDot.className = "cell__dot";
        cell.appendChild(cellDot);
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
