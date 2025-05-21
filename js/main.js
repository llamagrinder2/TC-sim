// js/main.js

import { gameGrid, moveButton, attackButton, endButton, messageDisplayDiv, player1FactionNameH2, player2FactionNameH2, selectFaction1Btn, selectFaction2Btn, factionSelectionPanel, actionButtonsDiv, unitInfoDiv, dice1Div, dice2Div, bonusDiceContainer, roundCounterDiv, factionButtonsContainer, unitSelectionPanel } from './domElements.js'; // <<< unitSelectionPanel hozzáadva
import { createGrid } from './grid.js';
import { handlePlacementClick, initializeUnitPlacementForPlayer } from './unitPlacement.js';
import { handleMoveAction, selectUnit, highlightPossibleTargets, clearHighlights, updateActionButtons } from './unitActions.js';
import { handleAttackAction } from './combat.js';
import { startGame, endActivation } from './gameFlow.js';
import { gameStarted, selectedUnitCell, currentAction, activeUnit, unitsData, unitsActivatedThisRound, setGameStarted, setSelectedUnitCell, setCurrentAction, setHasMoved, setHasAttacked, setPlayer1Faction, setPlayer2Faction, player1Faction, player2Faction, initializeInitialUnits, setCurrentPlayerBuildingArmy } from './gameState.js'; // <<< setCurrentPlayerBuildingArmy hozzáadva
import { factionNames } from './factions.js';
import { initializeUnitSelection } from './unitSelection.js'; // <<< ÚJ IMPORTú

// Globális változók
let player1FactionSelected = false;
let player2FactionSelected = false;
let currentPlayerSelectingFaction = null;


function handleGameClick(event) {
    if (!gameStarted) return;

    let clickedCell = event.target;
    if (!clickedCell.classList.contains('grid-cell')) {
        return;
    }

    let unitName = clickedCell.textContent.replace(/\d$/, '');

    if (currentAction === 'move') {
        handleMoveAction(clickedCell);
    } else if (currentAction === 'attack') {
        handleAttackAction(clickedCell);
    } else {
        if (unitName && unitsData[unitName] && !unitsActivatedThisRound[unitName] && clickedCell.dataset.player == getActivePlayer()) {
            selectUnit(clickedCell);
        } else if (selectedUnitCell && clickedCell === selectedUnitCell) {
            clearSelection();
        }
    }
}

function getActivePlayer() {
    return 1; // Ezt majd a gameFlow fogja kezelni
}


// Eseménykezelők a frakcióválasztó gombokhoz
selectFaction1Btn.addEventListener('click', () => {
    currentPlayerSelectingFaction = 1;
    displayFactionSelectionButtons();
    messageDisplayDiv.textContent = "Játékos 1, válaszd ki a frakciódat!";
    selectFaction1Btn.disabled = true; // Letiltjuk a gombot, amíg nem választ frakciót
    selectFaction2Btn.disabled = true; // Letiltjuk a másik játékos gombját is
});

selectFaction2Btn.addEventListener('click', () => {
    currentPlayerSelectingFaction = 2;
    displayFactionSelectionButtons();
    messageDisplayDiv.textContent = "Játékos 2, válaszd ki a frakciódat!";
    selectFaction1Btn.disabled = true; // Letiltjuk az 1. játékos gombját
    selectFaction2Btn.disabled = true; // Letiltjuk a gombot, amíg nem választ frakciót
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

function handleFactionSelection(factionChoice) {
    if (currentPlayerSelectingFaction === 1) {
        setPlayer1Faction(factionChoice);
        player1FactionNameH2.textContent = factionChoice;
        player1FactionSelected = true;
    } else if (currentPlayerSelectingFaction === 2) {
        setPlayer2Faction(factionChoice);
        player2FactionNameH2.textContent = factionChoice;
        player2FactionSelected = true;
    }

    messageDisplayDiv.textContent = `Játékos ${currentPlayerSelectingFaction} a ${factionChoice} frakciót választotta.`;
    factionButtonsContainer.style.display = 'none'; // Elrejtjük a frakció gombokat
    
    // NEM TÖRÖLJÜK A factionSelectionDiv-et, mert azt használjuk a 2. játékos választásához!
    // factionSelectionDiv.style.display = 'none'; // EZT TÖRÖLJÜK

    // Kezdjük az egységválasztást a jelenlegi játékosnak
    initializeUnitSelection(currentPlayerSelectingFaction);

    // Visszaállítjuk a kiválasztó játékost, ha befejeztük a fázist
    if (player1FactionSelected && player2FactionSelected) {
        // Ez a rész a finalizeArmySelection() függvényben fog lefutni,
        // miután mindkét játékos kiválasztotta a seregét.
        // Itt csak a jelenlegi játékos egységválasztását indítjuk el.
    }
}


// Kezdeti inicializálás
createGrid();
gameGrid.addEventListener('click', handleGameClick);

// Akció gombok eseménykezelői (ha még nincsenek benne)
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

// Alapértelmezett UI állapot
unitSelectionPanel.style.display = 'none'; // Az egységválasztó panel alapértelmezetten rejtett
actionButtonsDiv.style.display = 'none'; // Játékbeli gombok rejtve
endButton.style.display = 'none'; // Kör vége gomb rejtve
unitInfoDiv.style.display = 'none'; // Egység infó rejtve
dice1Div.style.display = 'none'; // Kockák rejtve
dice2Div.style.display = 'none'; // Kockák rejtve
bonusDiceContainer.style.display = 'none'; // Bónusz kockák rejtve
roundCounterDiv.style.display = 'none'; // Kör számláló rejtve
gameGrid.style.display = 'none'; // Játékrács rejtve
