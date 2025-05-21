// js/main.js

import { gameGrid, moveButton, attackButton, endButton, messageDisplayDiv, player1FactionSelectBtn, player2FactionSelectBtn, factionSelectionPanel, actionButtonsDiv, unitInfoDiv, dice1Div, dice2Div, bonusDiceContainer, roundCounterDiv, factionButtonsContainer, unitSelectionPanel } from './domElements.js';
import { createGrid } from './grid.js';
import { handlePlacementClick, initializeUnitPlacementForPlayer } from './unitPlacement.js';
import { handleMoveAction, selectUnit, highlightPossibleTargets, clearHighlights, updateActionButtons } from './unitActions.js';
import { handleAttackAction } from './combat.js';
import { startGame, endActivation } from './gameFlow.js';
import { gameStarted, selectedUnitCell, currentAction, activeUnit, unitsData, unitsActivatedThisRound, setGameStarted, setSelectedUnitCell, setCurrentAction, setHasMoved, setHasAttacked, setPlayer1Faction, setPlayer2Faction, player1Faction, player2Faction, initializeInitialUnits, setCurrentPlayerBuildingArmy, gamePhase, setGamePhase } from './gameState.js';
import { factionNames } from './factions.js';
import { setupFactionSelection, initializeUnitSelectionPanel } from './unitSelection.js';


let currentPlayerSelectingFaction = null;


function handleGameClick(event) {
    console.log("Kattintás történt a rácson! Aktuális fázis:", gamePhase); // Ezt hagyd benne
    let clickedCell = event.target;

    if (!clickedCell.classList.contains('grid-cell')) {
        return;
    }

    // Itt döntjük el, mit tegyen a kattintás a fázis alapján:
    if (gamePhase === 'placement') { // Ha éppen egységet helyezünk el
        handlePlacementClick(clickedCell); // Akkor hívjuk az egységelhelyező függvényt
        console.log("handlePlacementClick meghívva a rácskattintáskor."); // Ezt is hagyd benne
    } else if (gamePhase === 'combat') { // Ha harc fázisban vagyunk (később)
        // Itt jönne a harci logika
    } else { // Egyébként (pl. egység kiválasztása harcban)
        let unitID = clickedCell.dataset.unit; // Feltételezve, hogy a unitPlacement.js beállítja a data-unit attribútumot
        if (unitID && unitsData[unitID] && !unitsActivatedThisRound[unitID] && unitsData[unitID].player == getActivePlayer()) {
            selectUnit(clickedCell);
        } else if (selectedUnitCell && clickedCell === selectedUnitCell) {
            clearSelection();
        }
    }
}

function getActivePlayer() {
    return 1;
}


// --- FONTOS: Ezek a frakcióválasztó eseménykezelők és a displayFactionSelectionButtons függvény
// valószínűleg redundánsak itt, ha a unitSelection.js már kezeli őket a setupFactionSelection-ben.
// Ideális esetben ezeket a sorokat törölni kell, ha már áthelyezted őket.
// Ha mégis itt vannak, duplikált eseménykezelőket vagy logikát okoznak.
/*
selectFaction1Btn.addEventListener('click', () => {
    currentPlayerSelectingFaction = 1;
    displayFactionSelectionButtons();
    messageDisplayDiv.textContent = "Játékos 1, válaszd ki a frakciódat!";
    selectFaction1Btn.disabled = true;
    selectFaction2Btn.disabled = true;
});

selectFaction2Btn.addEventListener('click', () => {
    currentPlayerSelectingFaction = 2;
    displayFactionSelectionButtons();
    messageDisplayDiv.textContent = "Játékos 2, válaszd ki a frakciódat!";
    selectFaction1Btn.disabled = true;
    selectFaction2Btn.disabled = true;
});

function displayFactionSelectionButtons() {
    factionButtonsContainer.innerHTML = '';
    factionButtonsContainer.style.display = 'flex';

    factionNames.forEach(factionName => {
        const button = document.createElement('button');
        button.classList.add('faction-button');
        button.textContent = factionName;
        button.addEventListener('click', () => {
            handleFactionSelection(factionName);
        });
        factionButtonsContainer.appendChild(button);
    });
}
*/


function handleFactionSelection(factionChoice) {
    // Ez a függvény a unitSelection.js-be került áthelyezésre a "selectFaction" néven!
    // IDEÁLIS ESETBEN EZ A FÜGGVÉNY TELJESEN HIÁNYZIK A main.js-ből.
    // Ha itt maradna, duplikált logikát tartalmazna.
    console.error("handleFactionSelection van hívva a main.js-ben, de ennek a unitSelection.js-ben (selectFaction néven) kellene lennie!");
    // initializeUnitSelectionPanel(currentPlayerSelectingFaction); // <-- HÍVÁS, HA MÉGIS ITT MARADNA
}


document.addEventListener('DOMContentLoaded', () => {
    createGrid(10, 10);
    gameGrid.addEventListener('click', handleGameClick);

    setupFactionSelection();

    moveButton.addEventListener('click', () => {
        if (activeUnit) {
            setCurrentAction('move');
            messageDisplayDiv.textContent = `${activeUnit.dataset.unit} mozgatása. Kattints egy üres mezőre!`;
            highlightPossibleTargets(selectedUnitCell, 'move');
            updateActionButtons();
        } else {
            messageDisplayDiv.textContent = "Előbb válassz ki egy egységet a mozgatáshoz!";
        }
    });

    attackButton.addEventListener('click', () => {
        if (activeUnit) {
            setCurrentAction('attack');
            messageDisplayDiv.textContent = `${activeUnit.dataset.unit} támadása. Kattints egy ellenséges egységre!`;
            highlightPossibleTargets(selectedUnitCell, 'attack');
            updateActionButtons();
        } else {
            messageDisplayDiv.textContent = "Előbb válassz ki egy egységet a támadáshoz!";
        }
    });

    endButton.addEventListener('click', () => {
        endActivation();
    });

    unitSelectionPanel.style.display = 'none';
    actionButtonsDiv.style.display = 'none';
    endButton.style.display = 'none';
    unitInfoDiv.style.display = 'none';
    dice1Div.style.display = 'none';
    dice2Div.style.display = 'none';
    bonusDiceContainer.style.display = 'none';
    roundCounterDiv.style.display = 'none';
    gameGrid.style.display = 'none';

    // factionSelectionPanel.style.display = 'flex'; // setupFactionSelection() már kezeli
});


function clearSelection() {
    if (selectedUnitCell) {
        selectedUnitCell.classList.remove('selected-unit');
    }
    setSelectedUnitCell(null);
    setCurrentAction(null);
    clearHighlights();
    updateActionButtons();
}
