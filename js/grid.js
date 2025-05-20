// js/grid.js

import { gameGrid } from './domElements.js';
import { gridSize } from './constants.js';

export function createGrid() {
    gameGrid.innerHTML = ''; // Töröljük a korábbi tartalmat, ha volt
    gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`; // Feltételezzük, hogy a .grid-container display: grid;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            gameGrid.appendChild(cell);
        }
    }
}

export function findUnitCell(unitName) {
    const cells = gameGrid.querySelectorAll('.grid-cell'); // Módosított
    for (let cell of cells) {
        if (cell.textContent === unitName) {
            return cell;
        }
    }
    return null;
}
