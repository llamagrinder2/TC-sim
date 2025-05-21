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
    setUnitsData,
    setGamePhase // FONTOS: EZT IMPORTÁLD BE!
} from './gameState.js';
import { ALL_UNITS } from './factions.js';

// SEGÉDVÁLTOZÓK AZ ELHELYEZÉSHEZ
let currentPlayerPlacing = null;
let currentUnitToPlace = null;
let unitCounter = 0;

export function initializeUnitPlacementForPlayer(playerNum) {
    currentPlayerPlacing = playerNum;
    resetUnitsPlaced();

    gameGrid.style.display = 'grid'; // Megjelenítjük a rácsot

    // Elrejtjük a frakcióválasztó és egységválasztó paneleket, ha még láthatók
    document.querySelector('.faction-selection').style.display = 'none';
    document.getElementById('unitSelectionPanel').style.display = 'none';

    messageDisplayDiv.textContent = `Játékos ${playerNum}, helyezd el az egységeidet!`;

    selectNextUnitToPlace(); // Elindítjuk az egységek kiválasztását
}

export function selectNextUnitToPlace() {
    const playerArmy = currentPlayerPlacing === 1 ? player1Army : player2Army;

    // Megkeressük a következő elhelyezendő egységet
    for (const unitAbbr in playerArmy) {
        if (playerArmy[unitAbbr] > 0) {
            currentUnitToPlace = unitAbbr;
            messageDisplayDiv.textContent =
                `Játékos ${currentPlayerPlacing}, helyezz el egy ${ALL_UNITS[unitAbbr].name}-t (${playerArmy[unitAbbr]} még maradt)!` +
                ` Kattints egy üres mezőre a saját kezdőzónádban!`;
            highlightPlacementZones(); // Kiemeljük a megfelelő zónákat
            return; // Találtunk egységet, kilépünk
        }
    }

    // Ha idáig eljutottunk, az aktuális játékos ELHELYEZTE AZ ÖSSZES EGYSÉGÉT
    clearHighlights(); // Fontos: töröljük az előző játékos zónáinak kiemelését

    if (currentPlayerPlacing === 1) {
        // Ha Játékos 1 fejezte be, inicializáljuk Játékos 2 elhelyezését
        messageDisplayDiv.textContent = `Játékos 1, minden egységedet elhelyezted! Most Játékos 2 következik!`;
        initializeUnitPlacementForPlayer(2); // <<< Ez a KULCS!
    } else {
        // Ha Játékos 2 is fejezte be, akkor mindketten elhelyezték az egységeiket
        messageDisplayDiv.textContent = `Mindkét sereg a helyén! Kezdődjön a játék!`;
        setGameStarted(true); // Állítsuk be, hogy a játék elkezdődött
        setGamePhase('combat'); // <<< Állítsuk be a játékfázist 'combat'-ra!
        console.log("Játékfázis beállítva: combat. Játék indítása."); // Log üzenet

        // Megjelenítjük a játék során használt UI elemeket
        document.getElementById('actionButtons').style.display = 'flex';
        document.getElementById('endButton').style.display = 'block';
        document.getElementById('roundCounter').style.display = 'block';
        document.getElementById('unitInfo').style.display = 'block';
        document.getElementById('dice1').style.display = 'block';
        document.getElementById('dice2').style.display = 'block';
        document.getElementById('bonusDiceContainer').style.display = 'flex';

        // Elrejtünk minden olyan panelt, ami már nem szükséges
        document.querySelector('.faction-selection').style.display = 'none';
        document.getElementById('unitSelectionPanel').style.display = 'none';
        gameGrid.style.display = 'grid'; // A rács maradjon látható a harc fázisban is
    }
}

export function highlightPlacementZones() {
    clearHighlights(); // Először töröljük a korábbi kiemeléseket
    const gridCells = gameGrid.querySelectorAll('.grid-cell');
    const startRow = currentPlayerPlacing === 1 ? 0 : 7;
    const endRow = currentPlayerPlacing === 1 ? 2 : 9;

    console.log(`Kiemelés: Játékos ${currentPlayerPlacing}, Zóna: sor <span class="math-inline">\{startRow\}\-</span>{endRow}`); // Ellenőrzés
    
    gridCells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        // Ellenőrizzük, hogy a cella a kezdőzónában van-e, ÉS üres-e (nincs rajta egység)
        if (row >= startRow && row <= endRow && !cell.dataset.unit) {
            cell.classList.add('highlighted-move'); // <<< MOST MINDENHOL EZT HASZNÁLJUK!
        }
    });
}

export function handlePlacementClick(clickedCell) {
    console.log("handlePlacementClick FUT, kattintott cella:", clickedCell);

    // Kijavítottam, hogy 'highlighted-move' legyen az ellenőrzés
    if (!clickedCell.classList.contains('highlighted-move')) { // <<< ÉS EZT ELLENŐRIZZE!
        console.log("Hiba: A cella nincs kijelölve egység elhelyezésre (nem zöld).");
        return;
    }

    if (!currentUnitToPlace) {
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

            clickedCell.textContent = unitData.name;

            clickedCell.dataset.unit = unitID;
            clickedCell.dataset.player = currentPlayerPlacing;
            clickedCell.dataset.faction = playerFaction;

            unitsData[unitID] = {
                id: unitID,
                name: unitData.name,
                abbr: unitAbbr,
                type: unitData.type,
                player: currentPlayerPlacing,
                faction: playerFaction,
                row: row,
                col: col,
                hp: unitData.hp || 0,
                attack: unitData.attack || 0,
                defense: unitData.defense || 0,
                range: unitData.range || 0,
                cost: unitData.cost || 0,
                movement: unitData.movement || 0,
                ranged: unitData.ranged || 0,
                melee: unitData.melee || 0,
                armour: unitData.armour || 0,
            };

            setUnitsData(unitsData);

            playerArmy[currentUnitToPlace]--;
            incrementUnitsPlaced();

            // Fontos: Töröljük a highlightot a celláról, miután elhelyeztük az egységet
            clickedCell.classList.remove('highlighted-move'); // <<< Itt is `highlighted-move` legyen!

            selectNextUnitToPlace(); // Válassza ki a következő egységet vagy lépjen tovább

        } else {
            messageDisplayDiv.textContent = `Nincs több ${ALL_UNITS[currentUnitToPlace].name} a seregedben, vagy érvénytelen lépés!`;
        }
    } else {
        messageDisplayDiv.textContent = "Érvénytelen helyezés! Válassz egy üres mezőt a saját kezdőzónádban!";
    }
}

function clearHighlights() {
    gameGrid.querySelectorAll('.grid-cell').forEach(cell => {
        // Győződj meg róla, hogy MINDEN releváns kiemelő osztályt eltávolít!
        cell.classList.remove('highlighted-move', 'highlighted-attack', 'selected-unit'); // `highlight-placement` eltávolítva
    });
}
