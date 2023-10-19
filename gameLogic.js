import { COLS, ROWS, DIRS, OPPOSITE_DIRS } from "./constants.js";
import { gameSettings } from "./index.js";

export function isSnakeOutOfGrid() {
  let res = false;
  let snakePos = gameSettings.snakeBody.tail.value;
  switch (gameSettings.currentSnakeDirection) {
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
        `ERROR: could not know direction of ${gameSettings.currentSnakeDirection}`,
      );
  }
  return res;
}

export function moveSnake() {
  const isSnakeOut = isSnakeOutOfGrid();
  let snakePos = gameSettings.snakeBody.tail.value;
  switch (gameSettings.currentSnakeDirection) {
    case "ArrowUp":
      gameSettings.snakeBody.moveSnake([
        snakePos[0],
        isSnakeOut ? ROWS - 1 : snakePos[1] - 1,
      ]);
      break;
    case "ArrowDown":
      gameSettings.snakeBody.moveSnake([
        snakePos[0],
        isSnakeOut ? 0 : snakePos[1] + 1,
      ]);
      break;
    case "ArrowLeft":
      gameSettings.snakeBody.moveSnake([
        isSnakeOut ? COLS - 1 : snakePos[0] - 1,
        snakePos[1],
      ]);
      break;
    case "ArrowRight":
      gameSettings.snakeBody.moveSnake([
        isSnakeOut ? 0 : snakePos[0] + 1,
        snakePos[1],
      ]);
      break;
    default:
      throw Error(
        `ERROR: could not know direction of ${gameSettings.currentSnakeDirection}`,
      );
  }
}

export function getBeatPosition() {
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

export function isSnakeCell(pos) {
  const [posCol, posRow] = pos;
  const isSnakeHead =
    posCol === gameSettings.snakeBody.tail.value[0] &&
    gameSettings.snakeBody.tail.value[1] === posRow;
  let cur = gameSettings.snakeBody.head;

  while (cur) {
    if (cur.value[0] === posCol && cur.value[1] === posRow) {
      return [true, isSnakeHead];
    }
    cur = cur.next;
  }
  return [false, isSnakeHead];
}

export function keyPressHandler(e) {
  const dir = e.key;
  if (
    !DIRS.includes(dir) ||
    dir === gameSettings.currentSnakeDirection ||
    OPPOSITE_DIRS[gameSettings.currentSnakeDirection] === dir
  ) {
    return;
  }
  gameSettings.currentSnakeDirection = dir;
}
