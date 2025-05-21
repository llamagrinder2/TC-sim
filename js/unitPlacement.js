// js/unitPlacement.js

import { gameGrid, messageDisplayDiv } from './domElements.js';
import {
    unitsData,
    player1Army,
    player2Army,
    player1Faction,
    player2Faction,
    unitsPlaced,
    incrementUnitsPlaced,
    resetUnitsPlaced,
    setGameStarted,
    setUnitsData
} from './gameState.js';
import { ALL_UNITS } from './factions.js';

// SEGÉDVÁLTOZÓK AZ ELHELYEZÉSHEZ
let currentPlayerPlacing = null;
let currentUnitToPlace = null;
let unitCounter = 0;

export function initializeUnitPlacementForPlayer(playerNum) {
    currentPlayerPlacing = playerNum;
    resetUnitsPlaced();

    gameGrid.style.display = 'grid';

    document.querySelector('.faction-selection').style.display = 'none';
    document.getElementById('unitSelectionPanel').style.display = 'none';

    messageDisplayDiv.textContent = `Játékos ${playerNum}, helyezd el az egységeidet!`;

    selectNextUnitToPlace();
}

function selectNextUnitToPlace() {
    const playerArmy = currentPlayerPlacing === 1 ? player1Army : player2Army;

    for (const unitAbbr in playerArmy) {
        if (playerArmy[unitAbbr] > 0) {
            currentUnitToPlace = unitAbbr;
            messageDisplayDiv.textContent =
                `Játékos ${currentPlayerPlacing}, helyezz el egy ${ALL_UNITS[unitAbbr].name}-t (${playerArmy[unitAbbr]} még maradt)!` +
                ` Kattints egy üres mezőre a saját kezdőzónádban!`;
            highlightPlacementZones();
            return;
        }
    }

    if (currentPlayerPlacing === 1) {
        messageDisplayDiv.textContent = `Játékos 1, minden egységedet elhelyezted! Most Játékos 2 következik!`;
        document.querySelector('.faction-selection').style.display = 'flex';
        document.getElementById('selectFaction1Btn').disabled = true;
        document.getElementById('selectFaction2Btn').disabled = false;
    } else {
        messageDisplayDiv.textContent = `Mindkét sereg a helyén! Kezdődjön a játék!`;
        setGameStarted(true);
        document.getElementById('actionButtons').style.display = 'flex';
        document.getElementById('endButton').style.display = 'block';
        document.getElementById('roundCounter').style.display = 'block';
        document.getElementById('unitInfo').style.display = 'block';
        document.getElementById('dice1').style.display = 'block';
        document.getElementById('dice2').style.display = 'block';
        document.getElementById('bonusDiceContainer').style.display = 'flex';
    }
    clearHighlights();
}


function highlightPlacementZones() {
    clearHighlights();
    const gridCells = gameGrid.querySelectorAll('.grid-cell');
    const startRow = currentPlayerPlacing === 1 ? 0 : 7;
    const endRow = currentPlayerPlacing === 1 ? 2 : 9;

    gridCells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        if (row >= startRow && row <= endRow && !cell.dataset.unit) {
            cell.classList.add('highlighted-move');
        }
    });
}


export function handlePlacementClick(event) {
    const clickedCell = event.target;
    if (!clickedCell.classList.contains('grid-cell') || !currentUnitToPlace) {
        return;
    }

    const row = parseInt(clickedCell.dataset.row);
    const col = parseInt(clickedCell.dataset.col);
    const playerFaction = currentPlayerPlacing === 1 ? player1Faction : player2Faction;
    const playerArmy = currentPlayerPlacing === 1 ? player1Army : player2Army;

    const isInsidePlacementZone = (currentPlayerPlacing === 1 && row >= 0 && row <= 2) ||
                                  (currentPlayerPlacing === 2 && row >= 7 && row <= 9);

    if (!clickedCell.dataset.unit && isInsidePlacementZone) {
        if (playerArmy[currentUnitToPlace] > 0) {
            const unitAbbr = currentUnitToPlace;
            const unitData = ALL_UNITS[unitAbbr];
            unitCounter++;
            const unitID = `${unitAbbr}${unitCounter}`;

            clickedCell.textContent = unitAbbr;
            clickedCell.dataset.unit = unitID;
            clickedCell.dataset.player = currentPlayerPlacing;
            clickedCell.dataset.faction = playerFaction;

            // Frissítjük a unitsData globális objektumot
            unitsData[unitID] = {
                id: unitID,
                type: unitAbbr,
                player: currentPlayerPlacing,
                faction: playerFaction,
                row: row,
                col: col,
                // <-- Eltávolítva: maxHP, currentHP
                movement: unitData.movement || 6,
                ranged: unitData.ranged || 0,
                melee: unitData.melee || 0,
                armour: unitData.armour || 0,
            };

            setUnitsData(unitsData);

            playerArmy[unitAbbr]--;
            incrementUnitsPlaced();

            if (playerArmy[unitAbbr] === 0) {
                delete playerArmy[unitAbbr];
            }

            selectNextUnitToPlace();

        } else {
            messageDisplayDiv.textContent = `Nincs több ${ALL_UNITS[currentUnitToPlace].name} a seregedben, vagy érvénytelen lépés!`;
        }
    } else {
        messageDisplayDiv.textContent = "Érvénytelen helyezés! Válassz egy üres mezőt a saját kezdőzónádban!";
    }
}

function clearHighlights() {
    gameGrid.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('highlighted-move', 'highlighted-attack', 'selected-unit');
    });
}
