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
    console.log("Kattintás történt a rácson! Aktuális fázis:", gamePhase);
    let clickedCell = event.target;

    // Ez a kulcsfontosságú rész: biztosítjuk, hogy a clickedCell egy .grid-cell DOM elem legyen.
    // Ha nem magára a cellára, hanem egy benne lévő elemre (pl. kép) kattintottak,
    // akkor megkeressük a legközelebbi szülő .grid-cell elemet.
    // CSAK AKKOR HÍVD A .closest()-et, HA AZ event.target NEM A GRID-CELL.
    if (!clickedCell.classList.contains('grid-cell')) {
        clickedCell = clickedCell.closest('.grid-cell');
    }

    // Nagyon fontos ellenőrzés: ha clickedCell még most is null vagy undefined,
    // az azt jelenti, hogy a kattintás nem egy érvényes rács-cellán történt,
    // VAGY a grid még nem látható/interaktív.
    if (!clickedCell) {
        console.log("Nem érvényes rács-cellán történt a kattintás, vagy nem található a szülő cella. Kilépés.");
        return; // Kilépünk a függvényből
    }

    // Ha idáig eljutunk, a clickedCell egy érvényes .grid-cell DOM elem.
    console.log("Érvényes rács-cellán történt a kattintás:", clickedCell);

    // Itt döntjük el, mit tegyen a kattintás a fázis alapján:
    if (gamePhase === 'placement') { // Ha éppen egységet helyezünk el
        handlePlacementClick(clickedCell); // Akkor hívjuk az egységelhelyező függvényt
        console.log("handlePlacementClick meghívva a rácskattintáskor.");
    } else if (gamePhase === 'combat') { // Ha harc fázisban vagyunk (később)
        // Itt jönne a harci logika
    } else { // Egyébként (pl. egység kiválasztása harcban)
        let unitID = clickedCell.dataset.unit;
        if (unitID && unitsData[unitID] && !unitsActivatedThisRound[unitID] && unitsData[unitID].player == getActivePlayer()) {
            selectUnit(clickedCell);
        } else if (selectedUnitCell && clickedCell === selectedUnitCell) {
            clearSelection();
        }
    }
}

function getActivePlayer() {
    // Ezt a függvényt valószínűleg a gameState-be kellene áthelyezni
    // és az aktuális játékost nyomon követni, de most így marad
    return 1;
}


// --- FONTOS MÓDOSÍTÁS ITT ALUL ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Létrehozzuk a játékrácsot
    createGrid(10, 10);

    // 2. ELLENŐRIZZÜK, HOGY A gameGrid LÉTEZIK-E, ÉS CSAK EGYSZER ADJUK HOZZÁ AZ ESEMÉNYKEZELŐT
    if (gameGrid) {
        gameGrid.addEventListener('click', handleGameClick);
    } else {
        console.error("Hiba: A 'gameGrid' DOM elem nem található! Az eseménykezelő nem adható hozzá.");
    }
    
    // 3. Inicializáljuk a frakcióválasztást
    setupFactionSelection();

    // 4. Eseménykezelők a cselekvés gombokhoz (ezek a harc fázisban lesznek relevánsak)
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

    // 5. KEZDETI ÁLLAPOTOK BEÁLLÍTÁSA: ELREJTÜNK MINDENT, AMI MÉG NEM KELL
    // Ez a logikád eddig is jól működött
    unitSelectionPanel.style.display = 'none';
    actionButtonsDiv.style.display = 'none';
    endButton.style.display = 'none';
    unitInfoDiv.style.display = 'none';
    dice1Div.style.display = 'none';
    dice2Div.style.display = 'none';
    bonusDiceContainer.style.display = 'none';
    roundCounterDiv.style.display = 'none';
    gameGrid.style.display = 'none'; // KÖTELEZŐ ELREJTENI, ha a játék kezdetén nem kell látszódnia!

    // A factionSelectionPanel-t nem kell itt manuálisan megjeleníteni,
    // mert a setupFactionSelection() gondoskodik róla.
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
