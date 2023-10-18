import Snake from "./snake.js";

const COLS = 50;
const ROWS = 30;
const DIRS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const recordPannedContainer = document.getElementById("record-pannel");
const speedValueContainer = document.querySelector(
  ".record-pannel__title .title__value--speed",
);
const X_INC_SPEED = 10;
const SNAKE_MAX_SPEED = 30;
const SNAKE_START_SPEED = 200;

let snakePos = [Math.floor(COLS / 2), Math.floor(ROWS / 2)];
const snakeBody = new Snake(snakePos);
let beatPos = getBeatPosition();
let currentSnakeDirection = DIRS[Math.floor(Math.random() * DIRS.length)];
let snakeMovementSpeed = SNAKE_START_SPEED;
let score = 0;
let infervalId = null;

recordPannedContainer.style.width = `${COLS * 20}px`;
speedValueContainer.innerText = SNAKE_START_SPEED - snakeMovementSpeed + 10;

function isSnakeOutOfGrid() {
  let res = false;
  let snakePos = snakeBody.tail.value;
  switch (currentSnakeDirection) {
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
      throw Error(
        `ERROR: could not know direction of ${currentSnakeDirection}`,
      );
  }
  return res;
}

function moveSnake() {
  const isSnakeOut = isSnakeOutOfGrid();
  let snakePos = snakeBody.tail.value;
  switch (currentSnakeDirection) {
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
      throw Error(
        `ERROR: could not know direction of ${currentSnakeDirection}`,
      );
  }
}

function getBeatPosition() {
  const emptyCells = document.querySelectorAll(
    ".row__cell:not(.row__cell--snake-body-cell, .row__cell--snake-head-cell, .row__cell--beat-cell)",
  );

  if (!emptyCells.length) {
    return [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  const [col, row] = randomCell
    .getAttribute("cell-pos")
    .split(",")
    .map((n) => parseInt(n));

  return [col, row];
}

function checkIfBeatEaten() {
  const [beatCol, beatRow] = beatPos;
  const [snakeCol, snakeRow] = snakeBody.tail.value;

  if (beatCol !== snakeCol || beatRow !== snakeRow) {
    return;
  }
  updateGameScore();
  updateSnakeSpeed();
  beatPos = getBeatPosition();
  snakeBody.unshift();
  setSnakeMovementInterval();
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

function resetSnakeCell(cell) {
  const cellDot = document.createElement("span");
  cellDot.className = "cell__dot";
  cell.classList.remove("row__cell--snake-body-cell");
  cell.classList.remove("row__cell--snake-head-cell");
  cell.innerHtml = "";
  cell.appendChild(cellDot);
}

function changeCellToSnakeCell(cur, isHead = false) {
  const [bodyCol, bodyRow] = cur.value;
  const newBodyCell = document.querySelector(
    `[cell-pos="${bodyCol},${bodyRow}"]`,
  );
  const newBodyCellDot = newBodyCell.querySelector(".cell__dot");

  if (newBodyCellDot) {
    newBodyCellDot.remove();
  }

  if (isHead) {
    newBodyCell.classList.add("row__cell--snake-head-cell");
  } else {
    newBodyCell.classList.add("row__cell--snake-body-cell");
  }
}

function updateGridSnakeCells() {
  let cur = snakeBody.head;

  const curSnakeBodyCells = document.getElementsByClassName(
    "row__cell--snake-body-cell",
  );

  const curSnakeHeadCell = document.querySelector(
    ".row__cell--snake-head-cell",
  );

  Array.from(curSnakeBodyCells).forEach((cell) => {
    resetSnakeCell(cell);
  });

  resetSnakeCell(curSnakeHeadCell);

  while (cur.next) {
    changeCellToSnakeCell(cur);
    cur = cur.next;
  }

  changeCellToSnakeCell(cur, true);
}
function updateGridBeatCell() {
  const [beatCol, beatRow] = beatPos;
  const curBeatCell = document.querySelector(".row__cell--beat-cell");
  const newBeatCell = document.querySelector(
    `[cell-pos="${beatCol},${beatRow}"]`,
  );
  curBeatCell.classList.remove("row__cell--beat-cell");
  newBeatCell.classList.add("row__cell--beat-cell");
}

function updateGrid() {
  updateGridBeatCell();
  updateGridSnakeCells();
}

function updateGameScore() {
  score++;
  const scoreValueContainer = document.querySelector(
    ".record-pannel__title .title__value--score",
  );
  scoreValueContainer.innerText = score;
}

function updateSnakeSpeed() {
  snakeMovementSpeed = Math.max(
    SNAKE_MAX_SPEED,
    snakeMovementSpeed - X_INC_SPEED,
  );
  if (snakeMovementSpeed === SNAKE_MAX_SPEED) {
    speedValueContainer.classList.add("title__value--max");
    speedValueContainer.innerText = "Max speed";
    return;
  }
  speedValueContainer.innerText = SNAKE_START_SPEED - snakeMovementSpeed + 10;
}

function keyPressHandler(e) {
  const dir = e.key;
  if (!DIRS.includes(dir) || dir === currentSnakeDirection) {
    return;
  }
  currentSnakeDirection = dir;
}

function snakeAutoMoveHanlder() {
  moveSnake();
  checkIfBeatEaten();
  updateGrid();
}

function renderGrid() {
  const [beatCol, beatRow] = beatPos;

  const gridContainer = document.createElement("div");
  gridContainer.id = "grid";

  for (let i = 0; i < ROWS; ++i) {
    const rowContainer = document.createElement("div");
    rowContainer.className = "grid__row";

    for (let j = 0; j < COLS; ++j) {
      const [, isSnakeHead] = isSnakeCell([j, i]);
      const cell = document.createElement("div");

      cell.className = "row__cell";
      cell.setAttribute("cell-pos", `${j},${i}`);

      if (i === beatRow && j == beatCol) {
        cell.classList.add("row__cell--beat-cell");
      } else if (isSnakeHead) {
        cell.classList.add("row__cell--snake-head-cell");
      }

      if (!isSnakeHead) {
        const cellDot = document.createElement("span");
        cellDot.className = "cell__dot";
        cell.appendChild(cellDot);
      }

      rowContainer.appendChild(cell);
    }
    gridContainer.appendChild(rowContainer);
  }
  gridContainer.style.width = `${COLS * 20}px`;
  gridContainer.style.height = `${ROWS * 20}px`;
  document.body.appendChild(gridContainer);
}

function setSnakeMovementInterval() {
  if (infervalId !== null) {
    clearInterval(infervalId);
  }
  snakeAutoMoveHanlder();
  infervalId = setInterval(snakeAutoMoveHanlder, snakeMovementSpeed);
}

document.addEventListener("keydown", keyPressHandler);

renderGrid(snakePos);
setSnakeMovementInterval();
