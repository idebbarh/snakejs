import {
  COLS,
  ROWS,
  GAME_START_COUNTDOWN,
  X_INC_SPEED,
  SNAKE_MAX_SPEED,
  SNAKE_START_SPEED,
  GAME_MODES,
} from "./constants.js";

import { timeDelay } from "./utils.js";

import {
  getBeatPosition,
  isSnakeCell,
  keyPressHandler,
  moveSnake,
} from "./gameLogic.js";
import { gameSettings } from "./index.js";
import { renderPages } from "./pages.js";

export function checkIfBeatEaten() {
  const [beatCol, beatRow] = gameSettings.beatPos;
  const [snakeCol, snakeRow] = gameSettings.snakeBody.tail.value;

  if (beatCol !== snakeCol || beatRow !== snakeRow) {
    return;
  }
  updateGameScore();
  updateSnakeSpeed();
  gameSettings.beatPos = getBeatPosition();
  gameSettings.snakeBody.unshift();
  setSnakeMovementInterval();
}

export function resetSnakeCell(cell) {
  const newCellDot = document.createElement("span");
  const currCellDot = cell.querySelector(".cell__dot");
  //i think this will never be true
  if (currCellDot) {
    currCellDot.remove();
  }
  newCellDot.className = "cell__dot";
  cell.classList.remove("row__cell--snake-body-cell");
  cell.classList.remove("row__cell--snake-head-cell");
  cell.appendChild(newCellDot);
}

export function changeCellToSnakeCell(cur, isHead = false) {
  const [bodyCol, bodyRow] = cur.value;
  const newBodyCell = document.querySelector(
    `[cell-pos="${bodyCol},${bodyRow}"]`,
  );
  const newBodyCellDot = newBodyCell.querySelector(".cell__dot");

  if (newBodyCellDot) {
    newBodyCellDot.remove();
  }

  if (isHead) {
    newBodyCell.classList.remove("row__cell--snake-body-cell");
    newBodyCell.classList.add("row__cell--snake-head-cell");
  } else {
    newBodyCell.classList.remove("row__cell--snake-head-cell");
    newBodyCell.classList.add("row__cell--snake-body-cell");
  }
}

export function updateGridSnakeCells() {
  let cur = gameSettings.snakeBody.head;

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

export function updateGridBeatCell() {
  const [beatCol, beatRow] = gameSettings.beatPos;
  const curBeatCell = document.querySelector(".row__cell--beat-cell");
  const newBeatCell = document.querySelector(
    `[cell-pos="${beatCol},${beatRow}"]`,
  );
  curBeatCell.classList.remove("row__cell--beat-cell");
  newBeatCell.classList.add("row__cell--beat-cell");
}

export function updateGrid() {
  updateGridBeatCell();
  updateGridSnakeCells();
}

export function updateGameScore() {
  gameSettings.score++;
  const scoreValueContainer = document.querySelector(
    ".record-pannel__title .title__value--score",
  );
  scoreValueContainer.innerText = gameSettings.score * 10;
}

export function updateSnakeSpeed() {
  const speedValueContainer = document.querySelector(
    ".record-pannel__title .title__value--speed",
  );
  gameSettings.snakeMovementSpeed = Math.max(
    SNAKE_MAX_SPEED,
    gameSettings.snakeMovementSpeed - X_INC_SPEED,
  );
  if (gameSettings.snakeMovementSpeed === SNAKE_MAX_SPEED) {
    speedValueContainer.classList.add("title__value--max");
    speedValueContainer.innerText = "Max speed";
    return;
  }
  speedValueContainer.innerText =
    SNAKE_START_SPEED - gameSettings.snakeMovementSpeed + 10;
}

export function snakeAutoMoveHanlder() {
  moveSnake();
  checkIfBeatEaten();
  updateGrid();
}

export async function gameStartCountdown() {
  const gridOverlay = document.getElementById("grid-overlay");
  for (let i = 0; i < GAME_START_COUNTDOWN; i++) {
    gridOverlay.innerHTML = `<span class="grid-overlay__countdown">${
      GAME_START_COUNTDOWN - i
    }</span>`;
    await timeDelay(1000);
  }
}

export function renderGrid() {
  const [beatCol, beatRow] = gameSettings.beatPos;

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
  const gridOverlay = document.createElement("div");
  gridOverlay.id = "grid-overlay";
  gridContainer.appendChild(gridOverlay);
  gridContainer.style.width = `${COLS * 20}px`;
  gridContainer.style.height = `${ROWS * 20}px`;
  document.body.appendChild(gridContainer);
}

export function renderRecordPannel() {
  const recordPannedContainer = document.createElement("div");
  recordPannedContainer.id = "record-pannel";
  recordPannedContainer.innerHTML = `
      <h3 class="record-pannel__title">
        speed:<span class="title__value title__value--speed">0</span>
      </h3>
      <h3 class="record-pannel__title">
        score:<span class="title__value title__value--score">0</span>
      </h3>
`;
  recordPannedContainer.style.width = `${COLS * 20}px`;
  document.body.appendChild(recordPannedContainer);
}

export function startGameWithModeBtn(mode, elemClassName) {
  const linkElem = document.createElement("button");
  linkElem.className = elemClassName;
  linkElem.innerText = mode;
  linkElem.addEventListener("click", () => {
    gameSettings.gameMode = mode;
    renderPages("play");
  });

  return linkElem;
}

export function renderStartGameMenu() {
  const startGameMenuContainer = document.createElement("div");
  startGameMenuContainer.id = "start-game-menu";
  startGameMenuContainer.style.width = `${COLS * 20}px`;
  startGameMenuContainer.style.height = `${ROWS * 20}px`;
  startGameMenuContainer.innerHTML = `
    <h1 class="start-game-menu__title">snake</h1>
    <h3 class="start-game-menu__subtitle">choose game mode:</h1>
    <div class="start-game-menu__modes"></div>
`;

  GAME_MODES.forEach((l) => {
    startGameMenuContainer
      .querySelector(".start-game-menu__modes")
      .appendChild(startGameWithModeBtn(l, "modes__mode"));
  });
  document.body.appendChild(startGameMenuContainer);
}

export function setSnakeMovementInterval() {
  if (gameSettings.intervalId !== null) {
    clearInterval(gameSettings.intervalId);
  }
  snakeAutoMoveHanlder();
  gameSettings.intervalId = setInterval(
    snakeAutoMoveHanlder,
    gameSettings.snakeMovementSpeed,
  );
}

export async function startNewGame() {
  const gridOverlay = document.getElementById("grid-overlay");
  await timeDelay(GAME_START_COUNTDOWN * 1000);
  if (gridOverlay) {
    gridOverlay.remove();
  }
  document.addEventListener("keydown", keyPressHandler);
  setSnakeMovementInterval();
}
