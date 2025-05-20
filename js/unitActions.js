// js/unitActions.js

import { gameGrid, unitInfoDiv, actionButtonsDiv, endButton, dice1Div, dice2Div, bonusDiceContainer, messageDisplayDiv, moveButton, attackButton } from './domElements.js';
import { unitsData, unitsActivatedThisRound, activeUnit, hasMoved, hasAttacked, currentAction, setHasMoved, setHasAttacked, setCurrentAction, setActiveUnit, setSelectedUnitCell, gameStarted } from './gameState.js';
import { endActivation } from './gameFlow.js';
import { handleAttackAction } from './combat.js'; // Módosítás: a támadáslogika külön fájlba került
import { gridSize } from './constants.js';

export function selectUnit(cell) {
    if (!gameStarted || (activeUnit && activeUnit !== cell)) {
        return;
    }

    setSelectedUnitCell(cell);
    setActiveUnit(cell);
    let unitName = cell.textContent.replace(/\d$/, '');
    unitInfoDiv.textContent = `${unitName}: Blood ${unitsData[unitName]?.bloodMarkers || 0}`;
    actionButtonsDiv.style.display = 'block';
    endButton.style.display = 'block';
    setHasMoved(unitsActivatedThisRound[unitName]);
    setHasAttacked(unitsActivatedThisRound[unitName]);
    updateActionButtons();
    clearHighlights();
    setCurrentAction(null);
    messageDisplayDiv.textContent = "";
}

export function clearSelection() {
    setSelectedUnitCell(null);
    setActiveUnit(null);
    unitInfoDiv.textContent = '';
    actionButtonsDiv.style.display = 'none';
    endButton.style.display = 'none';
    dice1Div.textContent = '';
    dice2Div.textContent = '';
    bonusDiceContainer.innerHTML = '';
    clearHighlights();
    setCurrentAction(null);
    messageDisplayDiv.textContent = "";
}

export function handleMoveAction(targetCell) {
    if (gameStarted && activeUnit && targetCell.classList.contains('highlighted-move') && !targetCell.textContent) {
        targetCell.textContent = activeUnit.textContent;
        activeUnit.textContent = '';
        setActiveUnit(targetCell); // Frissítjük az aktív egység referenciáját
        setHasMoved(true);
        setCurrentAction(null);
        clearHighlights();
        updateActionButtons();
        messageDisplayDiv.textContent = "Egység sikeresen mozgatva.";
    }
}

export function highlightPossibleTargets(action, unitCell) {
    if (!gameStarted || !unitCell) return;

    let row = parseInt(unitCell.dataset.row);
    let col = parseInt(unitCell.dataset.col);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let distance = Math.abs(row - i) + Math.abs(col - j);
            if (distance <= 2 && distance > 0) {
                const targetCell = gameGrid.rows[i].cells[j];
                const targetUnitName = targetCell.textContent.replace(/\d$/, '');
                if (action === 'move' && !hasMoved && !targetUnitName) {
                    targetCell.classList.add('highlighted-move');
                } else if (action === 'attack' && !hasAttacked && targetUnitName && targetCell !== unitCell) {
                    targetCell.classList.add('highlighted-attack');
                }
            }
        }
    }
}

export function clearHighlights() {
    let highlightedMoveCells = document.querySelectorAll('.highlighted-move');
    highlightedMoveCells.forEach(cell => {
        cell.classList.remove('highlighted-move');
    });
    let highlightedAttackCells = document.querySelectorAll('.highlighted-attack');
    highlightedAttackCells.forEach(cell => {
        cell.classList.remove('highlighted-attack');
    });
}

export function updateActionButtons() {
    moveButton.disabled = !gameStarted || hasMoved || !activeUnit;
    attackButton.disabled = !gameStarted || hasAttacked || !activeUnit;
}
