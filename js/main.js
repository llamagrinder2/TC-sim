// js/main.js

import { gameGrid, moveButton, attackButton, endButton, messageDisplayDiv, player1FactionNameH2, player2FactionNameH2, selectFaction1Btn, selectFaction2Btn, factionSelectionDiv, actionButtonsDiv, unitInfoDiv, dice1Div, dice2Div, bonusDiceContainer, roundCounterDiv } from './domElements.js';
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

// Segédfüggvény az aktív játékos lekéréséhez (ha még nincs gameState-ben)
// Ezt később érdemes a gameState-be helyezni, ha játékosváltás is lesz.
function getActivePlayer() {
    // Ezt a gameFlow.js-ből kellene exportálni, ha van már olyan változója.
    // Jelenleg feltételezzük, hogy az 1. játékos kezdi a játékot, amíg nincs meg a játékosváltás logikája.
    return 1;
}


// Eseménykezelők a frakcióválasztó gombokhoz
selectFaction1Btn.addEventListener('click', () => selectFaction(1));
selectFaction2Btn.addEventListener('click', () => selectFaction(2));

function selectFaction(playerNum) {
    let factionChoice = prompt(`Játékos ${playerNum}, válassz frakciót a következők közül:\n${factionNames.join(', ')}`);
    if (factionChoice && factionNames.includes(factionChoice)) {
        if (playerNum === 1) {
            setPlayer1Faction(factionChoice);
            player1FactionNameH2.textContent = factionChoice;
            player1FactionSelected = true;
        } else {
            setPlayer2Faction(factionChoice);
            player2FactionNameH2.textContent = factionChoice;
            player2FactionSelected = true;
        }
        messageDisplayDiv.textContent = `Játékos ${playerNum} a ${factionChoice} frakciót választotta.`;

        // Ha mindkét frakció kiválasztva, indítsuk az egység elhelyezést
        if (player1FactionSelected && player2FactionSelected) {
            messageDisplayDiv.textContent = "Minden frakció kiválasztva. Helyezd el az egységeket!";
            factionSelectionDiv.style.display = 'none'; // Elrejtjük a frakcióválasztó UI-t
            gameGrid.style.display = 'grid'; // Megjelenítjük a gridet (a grid.js hozza létre a div-eket)
            
            // Játékhoz szükséges UI elemek inicializálása (ezeket a startGame() fogja bekapcsolni)
            // Itt csak a roundCounterDiv-et tesszük láthatóvá, amíg a játék nem indul el teljesen
            roundCounterDiv.style.display = 'block';

            // Itt inicializáljuk az initialUnits-ot a választott frakciók alapján
            initializeInitialUnits(player1Faction, player2Faction);

            // Indítjuk az egység elhelyezést az 1. játékos számára
            initializeUnitPlacementForPlayer(1);
        }
    } else {
        alert("Érvénytelen frakció választás. Kérlek, válassz a listából.");
    }
}


// Kezdeti inicializálás
createGrid(); // Létrehozza a rácsot (most már DIV-ekből)
gameGrid.addEventListener('click', handleGameClick);

// A játék indulását most már a frakcióválasztás és egységelhelyezés vezérli.
// Az initializeArmyPlacement() függvényre már nincs szükség, töröltük.
