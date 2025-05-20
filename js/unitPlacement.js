// js/unitPlacement.js

// Módosult import: selectedArmyUnit és setSelectedArmyUnit hozzáadva
import { unitsData, unitsActivatedThisRound, initialUnits, unitsPlaced, incrementUnitsPlaced, selectedArmyUnit, setSelectedArmyUnit } from './gameState.js';
import { unitInfoDiv, armyPlacementTable } from './domElements.js';
import { startGame } from './gameFlow.js';

// let _selectedArmyUnit = null; // EZT A SORT TÖRÖLD!

export function selectArmyUnit(event) {
    setSelectedArmyUnit(event.target.dataset.unit); // Használjuk a beállító függvényt
    if (selectedArmyUnit) { // Használjuk a beimportált változót
        unitInfoDiv.textContent = `${selectedArmyUnit} kiválasztva a seregéből. Helyezd el a táblán!`;
    }
}

export function handlePlacementClick(event) {
    // Használjuk a beimportált selectedArmyUnit-et
    if (selectedArmyUnit && !event.target.textContent) {
        event.target.textContent = selectedArmyUnit;
        unitsData[selectedArmyUnit] = { bloodMarkers: 0 };
        unitsActivatedThisRound[selectedArmyUnit] = false;

        const armyCells = armyPlacementTable.querySelectorAll('.army-cell[data-unit]');
        armyCells.forEach(cell => {
            if (cell.dataset.unit === selectedArmyUnit) { // Használjuk a beimportált selectedArmyUnit-et
                cell.textContent = '';
                cell.dataset.unit = '';
                cell.removeEventListener('click', selectArmyUnit);
            }
        });

        setSelectedArmyUnit(null); // Beállító függvény használata
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
