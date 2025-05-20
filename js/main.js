// js/main.js

import { gameGrid, moveButton, attackButton, endButton, armyPlacementTable, messageDisplayDiv } from './domElements.js'; // Fontos: messageDisplayDiv hozzáadása
import { createGrid, findUnitCell } from './grid.js';
import { initializeUnitPlacementForPlayer, handlePlacementClick } from './unitPlacement.js';
// A setCurrentAction kikerül innen:
import { handleMoveAction, selectUnit, highlightPossibleTargets, clearHighlights, updateActionButtons } from './unitActions.js';
import { handleAttackAction } from './combat.js';
import { startGame, endActivation } from './gameFlow.js';
// Itt importáljuk a setCurrentAction-t a gameState.js-ből:
import { gameStarted, currentAction, activeUnit, unitsData, unitsActivatedThisRound, setGameStarted, setSelectedUnitCell, setCurrentAction, setHasMoved, setHasAttacked } from './gameState.js';

// --- Játék Inicializálás ---
createGrid();
initializeArmyPlacement();

// --- Eseménykezelők ---

// Az armyPlacementTable elrejtése a startGame-ben történik, de a kezelőt itt távolítjuk el
// (handlePlacementClick)
// Itt inicializáljuk a gameGrid eseménykezelőjét
for (let i = 0; i < gameGrid.rows.length; i++) {
    for (let j = 0; j < gameGrid.rows[i].cells.length; j++) {
        gameGrid.rows[i].cells[j].addEventListener('click', handleGameClick);
    }
}

moveButton.addEventListener('click', () => {
    if (gameStarted && activeUnit && !unitsActivatedThisRound[activeUnit.textContent.replace(/\d$/, '')]) { // Frissített ellenőrzés
        setCurrentAction('move');
        clearHighlights();
        highlightPossibleTargets('move', activeUnit);
        messageDisplayDiv.textContent = "";
    }
});

attackButton.addEventListener('click', () => {
    if (gameStarted && activeUnit && !unitsActivatedThisRound[activeUnit.textContent.replace(/\d$/, '')]) { // Frissített ellenőrzés
        setCurrentAction('attack');
        clearHighlights();
        highlightPossibleTargets('attack', activeUnit);
        messageDisplayDiv.textContent = "Válaszd ki a célpontot a támadáshoz!";
    }
});

endButton.addEventListener('click', () => {
    if (gameStarted && activeUnit) {
        endActivation();
    }
});

// Fő játéktér kattintáskezelő
function handleGameClick(event) {
    if (!gameStarted) return; // gameStarted a gameState-ből

    let clickedCell = event.target;
    let unitName = clickedCell.textContent.replace(/\d$/, '');

    if (currentAction === 'move') { // currentAction a gameState-ből
        handleMoveAction(clickedCell);
    } else if (currentAction === 'attack') { // currentAction a gameState-ből
        handleAttackAction(clickedCell);
    } else {
        // Csak akkor választhatunk egységet, ha még nem aktiválódott ebben a körben
        if (unitName && unitsData[unitName] && !unitsActivatedThisRound[unitName]) { // unitsData, unitsActivatedThisRound a gameState-ből
            selectUnit(clickedCell);
        } else if (selectedUnitCell && clickedCell === selectedUnitCell) { // selectedUnitCell a gameState-ből
            clearSelection();
        }
    }
}

// Az startGame függvényt felülírjuk itt a fő logikához, ami a DOM-ot érinti
// Ez az a startGame, ami a unitPlacement-ből hívódik, miután elhelyeztük az összes egységet.
window.startGame = () => {
    console.log("main.js startGame() lefutott!");
    setGameStarted(true);
    roundCounterDiv.style.display = 'block';
    armyPlacementTable.style.display = 'none'; // Elrejtjük az egységelhelyező táblát
    messageDisplayDiv.textContent = "A játék elkezdődött!";

    // A gameGrid eseménykezelőit már a fájl elején beállítjuk, így nem kell itt újra
    // Bár érdemes lenne itt *lecserélni* a handlePlacementClick-ről a handleGameClick-re.
    // Most a legegyszerűbb, ha a handleGameClick a belső logikájában ellenőrzi, hogy gameStarted.
    // Jelenleg mindkét listener rajta van, de a handlePlacementClick csak akkor működik, ha selectedArmyUnit van.
    // Ha gameStarted=true, selectedArmyUnit=null, akkor nem fog lefutni a handlePlacementClick.
    // Ez a megoldás most elegendő, de egy komplexebb rendszerben valószínűleg lecserélnénk az eventListenereket.
};

// Az endGame függvényt is exportáljuk a gameFlow-ból, de ideiglenesen felülírjuk a main.js-ben a grid eseménykezelőjének eltávolítására
window.endGame = (message) => { // window-ra tesszük, hogy hívható legyen, ha a gameFlow nem importálja
    alert(message);
    messageDisplayDiv.textContent = message;
    moveButton.disabled = true;
    attackButton.disabled = true;
    endButton.disabled = true;
    setGameStarted(false);

    // Eltávolítjuk a játék eseménykezelőjét a gameGrid-ről
    for (let i = 0; i < gameGrid.rows.length; i++) {
        for (let j = 0; j < gameGrid.rows[i].cells.length; j++) {
            gameGrid.rows[i].cells[j].removeEventListener('click', handleGameClick);
        }
    }
};
