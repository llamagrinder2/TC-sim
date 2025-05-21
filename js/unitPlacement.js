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

// SEGÉDVÁLTOZÓK AZ ELHELYEZÉSHEZ (ezek rendben vannak)
let currentPlayerPlacing = null;
let currentUnitToPlace = null;
let unitCounter = 0;

export function initializeUnitPlacementForPlayer(playerNum) {
    currentPlayerPlacing = playerNum;
    resetUnitsPlaced();

    // A gameGrid megjelenítése itt is rendben van, hiszen az egységelhelyezési fázis elején van
    gameGrid.style.display = 'grid';

    document.querySelector('.faction-selection').style.display = 'none';
    document.getElementById('unitSelectionPanel').style.display = 'none';

    messageDisplayDiv.textContent = `Játékos ${playerNum}, helyezd el az egységeidet!`;

    selectNextUnitToPlace();
}

// ... (selectNextUnitToPlace és highlightPlacementZones függvények változatlanok maradnak) ...


// --- FONTOS MÓDOSÍTÁS ITT: A handlePlacementClick függvény paramétere ---
export function handlePlacementClick(clickedCell) { // <<< ITT VÁLTOZOTT AZ event HELYETT clickedCell
    console.log("handlePlacementClick FUT, kattintott cella:", clickedCell); // Ezt hagyd benne, segít debugolni

    // A `clickedCell = event.target;` sor már nem kell, mert a `main.js` már a megfelelő elemet adja át.
    // Így a 92. sor is helyes lesz:
    if (!clickedCell.classList.contains('highlighted-move')) { // Itt 'highlight-placement' helyett 'highlighted-move' kell?
        console.log("Hiba: A cella nincs kijelölve egység elhelyezésre (nem zöld).");
        return;
    }

    // A `unitToPlace` helyett `currentUnitToPlace` a helyes változónév itt!
    // A hiba a console.log üzenetben volt az "unitToPlace" elnevezésnél az előző válaszomban,
    // a fájlban lévő `currentUnitToPlace` a megfelelő.
    if (!currentUnitToPlace) { // Nincs szükség Object.keys(currentUnitToPlace).length === 0, ha string
        console.log("Hiba: Nincs kiválasztott egység a lehelyezéshez (currentUnitToPlace üres vagy nincs definiálva).");
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

            // Vizuális megjelenítés a cellán
            clickedCell.textContent = unitData.name; // Javaslom a teljes nevét megjeleníteni rövidítés helyett


            clickedCell.dataset.unit = unitID;
            clickedCell.dataset.player = currentPlayerPlacing;
            clickedCell.dataset.faction = playerFaction;

            // Frissítjük a unitsData globális objektumot
            unitsData[unitID] = {
                id: unitID,
                name: unitData.name, // Fontos: adjuk hozzá a nevet is!
                abbr: unitAbbr, // Rövidítés
                type: unitData.type, // Pl. infantry, cavalry
                player: currentPlayerPlacing,
                faction: playerFaction,
                row: row,
                col: col,
                hp: unitData.hp || 0, // Feltételezve, hogy vannak ilyen adatok a factions.js-ben
                attack: unitData.attack || 0,
                defense: unitData.defense || 0,
                range: unitData.range || 0,
                cost: unitData.cost || 0,
                movement: unitData.movement || 0, // Hozzáadtam ezeket a propsokat, ahogy az ALL_UNITS-ban vannak
                ranged: unitData.ranged || 0,
                melee: unitData.melee || 0,
                armour: unitData.armour || 0,
            };

            setUnitsData(unitsData); // Győződj meg róla, hogy ez a függvény frissíti a gameState-et!

            playerArmy[currentUnitToPlace]--; // Helyes változónév használata
            incrementUnitsPlaced();

            // Fontos: Töröljük a highlightot a celláról, miután elhelyeztük az egységet
            clickedCell.classList.remove('highlighted-move');


            if (playerArmy[currentUnitToPlace] === 0) {
            }

            selectNextUnitToPlace(); // Válassza ki a következő egységet a listából

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
