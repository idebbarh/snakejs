export const COLS = 50;
export const ROWS = 30;
export const GAME_START_COUNTDOWN = 5;
export const DIRS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
export const OPPOSITE_DIRS = {
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
};
export const X_INC_SPEED = 10;
export const SNAKE_MAX_SPEED = 30;
export const SNAKE_START_SPEED = 200;
export const SNAKE_START_POS = [Math.floor(COLS / 2), Math.floor(ROWS / 2)];
/* export const GAME_MODES = ["solo", "computer", "online"]; */
export const GAME_MODES = ["play"];
