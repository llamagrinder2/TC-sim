// js/grid.js

import { gridSize } from './constants.js';
import { gameGrid } from './domElements.js';
import { handlePlacementClick } from './unitPlacement.js'; // Fontos: a handlePlacementClick itt kell

export function createGrid() {
  for (let i = 0; i < gridSize; i++) {
    let row = gameGrid.insertRow();
    for (let j = 0; j < gridSize; j++) {
      let cell = row.insertCell();
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handlePlacementClick);
    }
  }
}

export function findUnitCell(unitName) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (gameGrid.rows[i].cells[j].textContent.startsWith(unitName)) {
        return gameGrid.rows[i].cells[j];
      }
    }
  }
  return null;
}