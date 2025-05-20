// js/grid.js

import { gameGrid } from './domElements.js'; // A gameGrid most már egy DIV elem
import { gridSize } from './constants.js'; // Feltételezve, hogy a gridSize itt van definiálva (pl. 10)

export function createGrid() {
    gameGrid.innerHTML = ''; // Töröljük a korábbi tartalmat
    gameGrid.style.display = 'grid'; // Beállítjuk a gameGrid-et CSS Grid-ként
    gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`; // Oszlopok beállítása, 50px szélesek legyenek a cellák
    gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 50px)`; // Sorok beállítása, 50px magasak legyenek a cellák

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div'); // DIV elemet hozunk létre cellaként
            cell.classList.add('grid-cell'); // Adunk neki egy osztályt a stílusozáshoz
            cell.dataset.row = row; // Adats attribútumok a sor és oszlop tárolásához
            cell.dataset.col = col;
            gameGrid.appendChild(cell); // Hozzáadjuk a cellát a gameGrid DIV-hez
        }
    }
}

export function findUnitCell(unitName) {
    // Ezt a függvényt is módosítani kell, hogy DIV cellákon keressen
    const cells = gameGrid.querySelectorAll('.grid-cell');
    for (let cell of cells) {
        if (cell.textContent === unitName) {
            return cell;
        }
    }
    return null;
}
