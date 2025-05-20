// js/unitPlacement.js

import { unitsData, unitsActivatedThisRound, initialUnits, selectedArmyUnit, unitsPlaced, setSelectedArmyUnit, incrementUnitsPlaced } from './gameState.js';
import { unitInfoDiv, armyPlacementTable } from './domElements.js';
import { startGame } from './gameFlow.js';

let _selectedArmyUnit = null; // Belső változó a kiválasztott sereg egységnek

export function selectArmyUnit(event) {
    _selectedArmyUnit = event.target.dataset.unit;
    if (_selectedArmyUnit) {
        unitInfoDiv.textContent = `${_selectedArmyUnit} kiválasztva a seregéből. Helyezd el a táblán!`;
    }
}

export function handlePlacementClick(event) {
    if (_selectedArmyUnit && !event.target.textContent) {
        event.target.textContent = _selectedArmyUnit;
        unitsData[_selectedArmyUnit] = { bloodMarkers: 0 };
        unitsActivatedThisRound[_selectedArmyUnit] = false;

        const armyCells = armyPlacementTable.querySelectorAll('.army-cell[data-unit]');
        armyCells.forEach(cell => {
            if (cell.dataset.unit === _selectedArmyUnit) {
                cell.textContent = '';
                cell.dataset.unit = '';
                cell.removeEventListener('click', selectArmyUnit);
            }
        });

        _selectedArmyUnit = null;
        unitInfoDiv.textContent = '';
        unitsPlaced++; // A gameState-ben frissítjük a külső változót

        if (unitsPlaced === Object.keys(initialUnits).length) {
            startGame();
        } else if (unitsPlaced < Object.keys(initialUnits).length) {
            unitInfoDiv.textContent = "Helyezd el a következő egységet!";
        }
    }
}

export function initializeArmyPlacement() {
    const armyCells = armyPlacementTable.querySelectorAll('.army-cell[data-unit]');
    armyCells.forEach(cell => {
        cell.addEventListener('click', selectArmyUnit);
    });
}