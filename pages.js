import { GAME_MODES } from "./constants.js";
import {
  startGameWithModeBtn,
  gameStartCountdown,
  renderGrid,
  renderRecordPannel,
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
  GAME_MODES.forEach((l) => {
    document.body.appendChild(startGameWithModeBtn(l));
  });
}
