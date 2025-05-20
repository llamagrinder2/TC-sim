// js/unitPlacement.js

// Fontos: Itt importáljuk az összes szükséges változót és függvényt a gameState.js-ből
import { unitsData, unitsActivatedThisRound, initialUnits, unitsPlaced, incrementUnitsPlaced, selectedArmyUnit, setSelectedArmyUnit } from './gameState.js';
import { unitInfoDiv, armyPlacementTable } from './domElements.js';
import { startGame } from './gameFlow.js';

export function selectArmyUnit(event) {
    // A selectedArmyUnit értékét a setSelectedArmyUnit függvényen keresztül állítjuk be
    setSelectedArmyUnit(event.target.dataset.unit);
    if (selectedArmyUnit) {
        unitInfoDiv.textContent = `${selectedArmyUnit} kiválasztva a seregéből. Helyezd el a táblán!`;
    }
}

export function handlePlacementClick(event) {
    // Ellenőrizzük, hogy van-e kiválasztott egység, és hogy a célcella üres-e
    if (selectedArmyUnit && !event.target.textContent) {
        event.target.textContent = selectedArmyUnit; // Elhelyezzük az egységet a cellában
        unitsData[selectedArmyUnit] = { bloodMarkers: 0 }; // Inicializáljuk az egység adatait
        unitsActivatedThisRound[selectedArmyUnit] = false; // Beállítjuk, hogy még nem aktiválódott a körben

        // Elrejtjük a seregválasztó tábla celláját, ahonnan az egységet elvettük
        const armyCells = armyPlacementTable.querySelectorAll('.army-cell[data-unit]');
        armyCells.forEach(cell => {
            if (cell.dataset.unit === selectedArmyUnit) {
                cell.textContent = '';
                cell.dataset.unit = '';
                cell.removeEventListener('click', selectArmyUnit);
            }
        });

        // Visszaállítjuk a selectedArmyUnit-et null-ra, hogy ne helyezhessünk el többször ugyanazt
        // Ezt is a beállító függvénnyel tesszük
        setSelectedArmyUnit(null);
        unitInfoDiv.textContent = ''; // Töröljük az információs üzenetet

        // Növeljük az elhelyezett egységek számát a dedikált függvénnyel
        incrementUnitsPlaced();

        // Ellenőrizzük, hogy az összes egység el lett-e helyezve
        if (unitsPlaced === Object.keys(initialUnits).length) {
            startGame(); // Ha igen, elindítjuk a játékot
        } else if (unitsPlaced < Object.keys(initialUnits).length) {
            unitInfoDiv.textContent = "Helyezd el a következő egységet!"; // Ha nem, kérjük a következőt
        }
    }
}

export function initializeArmyPlacement() {
    const armyCells = armyPlacementTable.querySelectorAll('.army-cell[data-unit]');
    armyCells.forEach(cell => {
        cell.addEventListener('click', selectArmyUnit);
    });
}
