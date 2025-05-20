// js/gameFlow.js

import { roundCounterDiv, messageDisplayDiv, moveButton, attackButton, endButton } from './domElements.js';
import { unitsData, unitsActivatedThisRound, currentRound, gameStarted, activeUnit, incrementRound, resetUnitsActivatedThisRound, setGameStarted } from './gameState.js'; // totalRounds eltávolítva innen
import { findUnitCell } from './grid.js';
import { clearSelection } from './unitActions.js';
import { totalRounds } from './constants.js'; // totalRounds importálása innen

export function startGame() {
  console.log("startGame() lefutott!");
  setGameStarted(true);
  roundCounterDiv.style.display = 'block';

  // Az armyPlacementTable a domElements.js-ből jönne, de direkt a main.js-ben kezeljük az eltüntetését.
  // Ezért itt nem is hivatkozunk rá.

  // Eseménykezelők áthelyezése a gameGrid-re a gameFlow.js-ben (vagy main.js-ben)
  // Ezt inkább a main.js-ben fogjuk megtenni, mert ott van a gameGrid elem inicializálva
  messageDisplayDiv.textContent = "A játék elkezdődött!";
}

export function endActivation() {
  if (gameStarted && activeUnit) {
    let unitName = activeUnit.textContent.replace(/\d$/, '');
    unitsActivatedThisRound[unitName] = true;
    activeUnit.classList.add('activated');
  }
  clearSelection();
  checkRoundEnd();
}

export function checkRoundEnd() {
  if (!gameStarted) return;

  let allActivated = true;
  const remainingUnits = Object.keys(unitsData);
  if (remainingUnits.length === 0) {
      endGame("A játék vége! Minden egység elpusztult.");
      return;
  }

  for (const unit of remainingUnits) {
    if (!unitsActivatedThisRound[unit]) {
      allActivated = false;
      break;
    }
  }

  if (allActivated) {
    incrementRound();
    roundCounterDiv.textContent = `Kör: ${currentRound} / ${totalRounds}`;
    resetUnitsActivatedThisRound();
    for (const unit of remainingUnits) {
      let unitCell = findUnitCell(unit);
      if (unitCell) {
        unitCell.classList.remove('activated');
      }
    }
    if (currentRound > totalRounds) {
      if (remainingUnits.length > 1) {
        endGame("A játék vége! Nincs győztes (döntetlen).");
      } else if (remainingUnits.length === 1) {
        endGame(`A játék vége! Győztes: ${remainingUnits[0]}`);
      } else {
          endGame("A játék vége! Minden egység elpusztult.");
      }
    }
  }
  if (remainingUnits.length === 1 && gameStarted) {
      endGame(`A játék vége! Győztes: ${remainingUnits[0]}`);
  }
}

export function endGame(message) {
  alert(message);
  messageDisplayDiv.textContent = message;
  moveButton.disabled = true;
  attackButton.disabled = true;
  endButton.disabled = true;
  setGameStarted(false); // Fontos, hogy a játék befejezését jelezzük
  // A gameGrid eseménykezelőjét a main.js-ben kell eltávolítani, mivel ott van a fő eseménykezelő loop.
}
