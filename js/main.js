// js/main.js

import { gameGrid, moveButton, attackButton, endButton, messageDisplayDiv, player1FactionNameH2, player2FactionNameH2, selectFaction1Btn, selectFaction2Btn, factionSelectionDiv, actionButtonsDiv, unitInfoDiv, dice1Div, dice2Div, bonusDiceContainer, roundCounterDiv, factionButtonsContainer } from './domElements.js'; // <<< factionButtonsContainer hozzáadva
import { createGrid } from './grid.js';
import { handlePlacementClick, initializeUnitPlacementForPlayer } from './unitPlacement.js';
import { handleMoveAction, selectUnit, highlightPossibleTargets, clearHighlights, updateActionButtons } from './unitActions.js';
import { handleAttackAction } from './combat.js';
import { startGame, endActivation } from './gameFlow.js';
import { gameStarted, currentAction, activeUnit, unitsData, unitsActivatedThisRound, setGameStarted, setSelectedUnitCell, setCurrentAction, setHasMoved, setHasAttacked, setPlayer1Faction, setPlayer2Faction, player1Faction, player2Faction, initializeInitialUnits } from './gameState.js';
import { factionNames } from './factions.js';


// Globális változók a játékosok frakcióválasztásának nyomon követésére
let player1FactionSelected = false;
let player2FactionSelected = false;
let currentPlayerSelectingFaction = null; // Nyomon követi, melyik játékos választ éppen frakciót


function handleGameClick(event) {
    if (!gameStarted) return; // gameStarted a gameState-ből

    let clickedCell = event.target;
    // Ellenőrizzük, hogy tényleg egy cellára kattintottunk-e és van-e rajta egység
    if (!clickedCell.classList.contains('grid-cell')) {
        return;
    }

    let unitName = clickedCell.textContent.replace(/\d$/, '');

    if (currentAction === 'move') {
        handleMoveAction(clickedCell);
    } else if (currentAction === 'attack') {
        handleAttackAction(clickedCell);
    } else {
        // Csak akkor választhatunk egységet, ha még nem aktiválódott ebben a körben
        // és az egység az aktuális játékoshoz tartozik
        if (unitName && unitsData[unitName] && !unitsActivatedThisRound[unitName] && clickedCell.dataset.player == getActivePlayer()) {
            selectUnit(clickedCell);
        } else if (selectedUnitCell && clickedCell === selectedUnitCell) {
            clearSelection();
        }
    }
}

// Segédfüggvény az aktív játékos lekéréséhez (ezt később a gameFlow.js-ből kapjuk majd)
function getActivePlayer() {
    // Ezt a gameFlow.js-ből kellene exportálni, ha van már olyan változója.
    // Jelenleg feltételezzük, hogy az 1. játékos kezdi a játékot, amíg nincs meg a játékosváltás logikája.
    return 1;
}


// Eseménykezelők a frakcióválasztó gombokhoz
selectFaction1Btn.addEventListener('click', () => {
    currentPlayerSelectingFaction = 1;
    displayFactionSelectionButtons();
    messageDisplayDiv.textContent = "Játékos 1, válaszd ki a frakciódat!";
});

selectFaction2Btn.addEventListener('click', () => {
    currentPlayerSelectingFaction = 2;
    displayFactionSelectionButtons();
    messageDisplayDiv.textContent = "Játékos 2, válaszd ki a frakciódat!";
});

// ÚJ FÜGGVÉNY: Megjeleníti a frakcióválasztó gombokat
function displayFactionSelectionButtons() {
    factionButtonsContainer.innerHTML = ''; // Töröljük a korábbi gombokat
    factionButtonsContainer.style.display = 'flex'; // Megjelenítjük a konténert

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

// ÚJ FÜGGVÉNY: Kezeli a frakcióválasztást (amikor egy frakció gombra kattintanak)
function handleFactionSelection(factionChoice) {
    if (currentPlayerSelectingFaction === 1) {
        setPlayer1Faction(factionChoice);
        player1FactionNameH2.textContent = factionChoice;
        player1FactionSelected = true;
        selectFaction1Btn.disabled = true; // Letiltjuk az 1. játékos gombját, ha már választott
    } else if (currentPlayerSelectingFaction === 2) {
        setPlayer2Faction(factionChoice);
        player2FactionNameH2.textContent = factionChoice;
        player2FactionSelected = true;
        selectFaction2Btn.disabled = true; // Letiltjuk a 2. játékos gombját, ha már választott
    }

    messageDisplayDiv.textContent = `Játékos ${currentPlayerSelectingFaction} a ${factionChoice} frakciót választotta.`;
    factionButtonsContainer.style.display = 'none'; // Elrejtjük a frakció gombokat
    currentPlayerSelectingFaction = null; // Visszaállítjuk

    // Ha mindkét frakció kiválasztva, indítsuk az egység elhelyezést
    if (player1FactionSelected && player2FactionSelected) {
        messageDisplayDiv.textContent = "Minden frakció kiválasztva. Helyezd el az egységeket!";
        factionSelectionDiv.style.display = 'none'; // Elrejtjük az egész frakcióválasztó UI-t
        gameGrid.style.display = 'grid'; // Megjelenítjük a gridet (a grid.js hozza létre a div-eket)
        
        roundCounterDiv.style.display = 'block';

        initializeInitialUnits(player1Faction, player2Faction);
        initializeUnitPlacementForPlayer(1);
    }
}


// Kezdeti inicializálás
createGrid(); // Létrehozza a rácsot (most már DIV-ekből)
gameGrid.addEventListener('click', handleGameClick);

// A játék indulását most már a frakcióválasztás és egységelhelyezés vezérli.s
