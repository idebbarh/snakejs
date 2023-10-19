import { DIRS, SNAKE_START_POS, SNAKE_START_SPEED } from "./constants.js";
import {
  gameStartCountdown,
  renderGrid,
  startNewGame,
} from "./domManipulation.js";
import { getBeatPosition } from "./gameLogic.js";
import Snake from "./snake.js";

export const gameSettings = {
  beatPos: getBeatPosition(),
  snakeBody: new Snake(SNAKE_START_POS),
  snakeMovementSpeed: SNAKE_START_SPEED,
  score: 0,
  intervalId: null,
  currentSnakeDirection: DIRS[Math.floor(Math.random() * DIRS.length)],
};

renderGrid();

gameStartCountdown();

startNewGame();
