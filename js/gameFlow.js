// js/gameFlow.js

import { roundCounterDiv, messageDisplayDiv, moveButton, attackButton, endButton, actionButtonsDiv, unitInfoDiv, dice1Div, dice2Div, bonusDiceContainer } from './domElements.js';
import { unitsData, unitsActivatedThisRound, currentRound, gameStarted, activeUnit, incrementRound, resetUnitsActivatedThisRound, setGameStarted, setHasMoved, setHasAttacked, setCurrentAction, setSelectedUnitCell, unitsPlaced, player1Faction, player2Faction } from './gameState.js';
import { findUnitCell } from './grid.js';
import { clearSelection, updateActionButtons } from './unitActions.js';
import { totalRounds } from './constants.js';

let activePlayer = 1; // Kezdetben az 1. játékos az aktív

export function startGame() {
    setGameStarted(true);
    messageDisplayDiv.textContent = `A játék elkezdődött! Játékos 1 (Frakció: ${player1Faction}) következik!`;
    roundCounterDiv.textContent = `Kör: ${currentRound}/${totalRounds}`;
    // Megjelenítjük a játékhoz szükséges UI elemeket
    actionButtonsDiv.style.display = 'block';
    endButton.style.display = 'block';
    unitInfoDiv.style.display = 'block';
    dice1Div.style.display = 'block';
    dice2Div.style.display = 'block';
    bonusDiceContainer.style.display = 'block';
    // Aktív egység kiválasztása (ez majd a játékosra vár)
    // Ideiglenesen beállítjuk az akció gombok állapotát
    updateActionButtons();
}

export function endActivation() {
    // Ellenőrizni kell, hogy az aktív egység valóban aktiválva lett-e ebben a körben
    if (activeUnit && activeUnit.dataset.unit) {
        unitsActivatedThisRound[activeUnit.dataset.unit] = true;
    }

    // Töröljük a kijelölést
    clearSelection();
    setActiveUnit(null); // Nincs többé aktív egység
    setCurrentAction(null); // Nincs többé aktuális akció
    setHasMoved(false); // Visszaállítjuk a mozgott állapotot
    setHasAttacked(false); // Visszaállítjuk a támadott állapotot
    updateActionButtons(); // Frissítjük a gombokat

    messageDisplayDiv.textContent = `Egység aktiválás befejezve.`;

    // Ellenőrizzük, hogy minden egység aktiválva lett-e ebben a körben az aktuális játékosnál
    const activePlayerUnits = Object.keys(unitsData).filter(unitName => unitsData[unitName].player === activePlayer);
    const allUnitsActivatedForPlayer = activePlayerUnits.every(unitName => unitsActivatedThisRound[unitName]);

    if (allUnitsActivatedForPlayer) {
        endRound();
    } else {
        messageDisplayDiv.textContent = `Játékos ${activePlayer}, válassz ki egy másik egységet!`;
    }
}

export function endRound() {
    incrementRound(); // Növeljük a kör számlálót
    if (currentRound > totalRounds) {
        messageDisplayDiv.textContent = "A játék véget ért! (TODO: Győzelmi feltételek)";
        setGameStarted(false); // Leállítjuk a játékot
        // Itt lehetne egy "Új játék" gombot megjeleníteni
    } else {
        // Kör vége, játékos váltás
        resetUnitsActivatedThisRound(); // Visszaállítjuk az egységek aktiválási állapotát
        activePlayer = activePlayer === 1 ? 2 : 1; // Játékos váltás
        messageDisplayDiv.textContent = `Kör vége. Játékos ${activePlayer} (Frakció: ${activePlayer === 1 ? player1Faction : player2Faction}) következik! Kör: ${currentRound}/${totalRounds}`;
        roundCounterDiv.textContent = `Kör: ${currentRound}/${totalRounds}`;
        // Egység kiválasztásra vár a következő játékos
    }
}

// Új függvény, ha később szükség van a kör újraindítására (pl. játék vége után)
export function startNewRound() {
    // ... (a jövőbeni logikához)
}
