import {
  gameStartCountdown,
  renderGrid,
  renderRecordPannel,
  renderStartGameMenu,
  startNewGame,
} from "./domManipulation.js";

export function renderPages(page) {
  window.history.pushState({}, "", "/");
  document.body.innerHTML = "";
  switch (page) {
    case "home":
      homePage();
      break;
    case "play":
      gamePage();
      break;
    default:
      renderPages("home");
  }
}

function gamePage() {
  renderGrid();
  renderRecordPannel();
  gameStartCountdown();
  startNewGame();
}

function homePage() {
  renderStartGameMenu();
}
