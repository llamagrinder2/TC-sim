// js/unitPlacement.js

import { gameGrid, messageDisplayDiv } from './domElements.js';
import {
    unitsData, // <<< Fontos: itt tároljuk majd az elhelyezett egységeket
    player1Army,
    player2Army,
    player1Faction,
    player2Faction,
    unitsPlaced,
    incrementUnitsPlaced,
    resetUnitsPlaced,
    setGameStarted,
    setUnitsData // Hozzáadjuk a setUnitsData-t
} from './gameState.js'; // Importáljuk az új állapotváltozókat
import { ALL_UNITS } from './factions.js'; // Szükségünk van az egységadatokra

// SEGÉDVÁLTOZÓK AZ ELHELYEZÉSHEZ
let currentPlayerPlacing = null; // Melyik játékos helyez el éppen egységet (1 vagy 2)
let currentUnitToPlace = null; // Melyik egységtípust helyezi el éppen a játékos
let unitCounter = 0; // Segít egyedi ID-t adni az egységeknek (pl. HPr1, HPr2)

// Ez a függvény indul el, amikor egy játékos befejezte a seregének építését
export function initializeUnitPlacementForPlayer(playerNum) {
    currentPlayerPlacing = playerNum;
    resetUnitsPlaced(); // Minden játékosnál nullázunk, ha külön fázisban van

    // Megjelenítjük a játékrácsot
    gameGrid.style.display = 'grid';

    // Elrejtjük a frakció és seregválasztó paneleket, ha még látszódnának
    document.querySelector('.faction-selection').style.display = 'none';
    document.getElementById('unitSelectionPanel').style.display = 'none';

    messageDisplayDiv.textContent = `Játékos ${playerNum}, helyezd el az egységeidet!`;

    // Megkeressük az első egységet, amit el kell helyezni
    selectNextUnitToPlace();
}

function selectNextUnitToPlace() {
    const playerArmy = currentPlayerPlacing === 1 ? player1Army : player2Army;

    // Megkeressük az első egységtípust, ami még nincs teljesen elhelyezve
    for (const unitAbbr in playerArmy) {
        if (playerArmy[unitAbbr] > 0) { // Ha van még ilyen egység, amit el kell helyezni
            currentUnitToPlace = unitAbbr;
            messageDisplayDiv.textContent =
                `Játékos ${currentPlayerPlacing}, helyezz el egy ${ALL_UNITS[unitAbbr].name}-t (${playerArmy[unitAbbr]} még maradt)!` +
                ` Kattints egy üres mezőre a saját kezdőzónádban!`;
            highlightPlacementZones(); // Kiemeljük a zónákat
            return; // Megtaláltuk az egységet, kilépünk
        }
    }

    // Ha idáig eljutunk, az összes egységet elhelyezték
    if (currentPlayerPlacing === 1) {
        // Ha az 1. játékos végzett, átadjuk a 2. játékosnak
        messageDisplayDiv.textContent = `Játékos 1, minden egységedet elhelyezted! Most Játékos 2 következik!`;
        // Visszaállítjuk a frakcióválasztót, hogy Játékos 2 kiválaszthassa a frakcióját, ha még nem tette meg
        document.querySelector('.faction-selection').style.display = 'flex';
        document.getElementById('selectFaction1Btn').disabled = true;
        document.getElementById('selectFaction2Btn').disabled = false;
        // Játékos 2 fogja elindítani a saját initializeUnitPlacementForPlayer-ét, amikor kiválasztja a frakcióját és seregét
    } else {
        // Ha a 2. játékos is végzett, indítjuk a játékot
        messageDisplayDiv.textContent = `Mindkét sereg a helyén! Kezdődjön a játék!`;
        setGameStarted(true); // Játék indítása
        // Később majd itt hívjuk meg a startGame() függvényt a gameFlow.js-ből
        // startGame();
        // A játék indulásakor meg kell jelennie a játékmenet gomboknak és a rácsnak
        document.getElementById('actionButtons').style.display = 'flex';
        document.getElementById('endButton').style.display = 'block';
        document.getElementById('roundCounter').style.display = 'block';
        document.getElementById('unitInfo').style.display = 'block';
        document.getElementById('dice1').style.display = 'block';
        document.getElementById('dice2').style.display = 'block';
        document.getElementById('bonusDiceContainer').style.display = 'flex'; // Vagy block
    }
    clearHighlights(); // Eltávolítjuk a kiemeléseket
}


function highlightPlacementZones() {
    clearHighlights(); // Töröljük az előző kiemeléseket
    const gridCells = gameGrid.querySelectorAll('.grid-cell');
    const startRow = currentPlayerPlacing === 1 ? 0 : 7; // Játékos 1: 0. sor, Játékos 2: 7. sor (ha 8x8-as a rács)
    const endRow = currentPlayerPlacing === 1 ? 2 : 9; // Játékos 1: 2. sor, Játékos 2: 9. sor (ha 10x10-es a rács, és 3 soros a zóna)

    gridCells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        // Csak a megadott sorokban, és ha a cella még üres
        if (row >= startRow && row <= endRow && !cell.dataset.unit) {
            cell.classList.add('highlighted-move'); // Újrahasználjuk a move highlightot
        }
    });
}


export function handlePlacementClick(event) {
    const clickedCell = event.target;
    if (!clickedCell.classList.contains('grid-cell') || !currentUnitToPlace) {
        return; // Nem cellára kattintott, vagy nincs kiválasztott egység
    }

    const row = parseInt(clickedCell.dataset.row);
    const col = parseInt(clickedCell.dataset.col);
    const playerFaction = currentPlayerPlacing === 1 ? player1Faction : player2Faction;
    const playerArmy = currentPlayerPlacing === 1 ? player1Army : player2Army;

    const isInsidePlacementZone = (currentPlayerPlacing === 1 && row >= 0 && row <= 2) || // 1. játékos zónája (0-2 sorok)
                                  (currentPlayerPlacing === 2 && row >= 7 && row <= 9); // 2. játékos zónája (7-9 sorok) (ha 10x10-es a rács)

    // Ellenőrizzük, hogy üres-e a cella és a saját zónában van-e
    if (!clickedCell.dataset.unit && isInsidePlacementZone) {
        if (playerArmy[currentUnitToPlace] > 0) {
            // Hozzáadjuk az egységet a cellához és a unitsData-hoz
            const unitAbbr = currentUnitToPlace;
            const unitData = ALL_UNITS[unitAbbr];
            unitCounter++;
            const unitID = `${unitAbbr}${unitCounter}`; // Egyedi ID (pl. HPr1, DCo1)

            clickedCell.textContent = unitAbbr;
            clickedCell.dataset.unit = unitID; // DOM-on tároljuk az egyedi ID-t
            clickedCell.dataset.player = currentPlayerPlacing;
            clickedCell.dataset.faction = playerFaction;

            // Hozzáadjuk a unitsData globális objektumhoz
            unitsData[unitID] = {
                id: unitID,
                type: unitAbbr,
                player: currentPlayerPlacing,
                faction: playerFaction,
                row: row,
                col: col,
                // Itt adhatsz hozzá további alapértékeket (pl. HP, mozgás, támadás),
                // amiket a ALL_UNITS-ból vehetsz
                maxHP: 10, // Ideiglenes érték, amíg nem tesszük bele az ALL_UNITS-ba
                currentHP: 10,
                movement: unitData.movement || 6, // Feltételezve, hogy van ilyen property az ALL_UNITS-ban
                ranged: unitData.ranged || 0,
                melee: unitData.melee || 0,
                armour: unitData.armour || 0,
            };

            // Frissítjük a gameState-ben a unitsData-t
            setUnitsData(unitsData);

            // Csökkentjük az elhelyezésre váró egységek számát
            playerArmy[unitAbbr]--;
            incrementUnitsPlaced();

            // Ha az adott egységtípusból már nincs több, válasszunk újat, különben ugyanazt ajánljuk
            if (playerArmy[unitAbbr] === 0) {
                // Töröljük a nulla mennyiségű egységtípust a playerArmy-ból
                delete playerArmy[unitAbbr];
            }

            selectNextUnitToPlace(); // Válasszuk ki a következő egységet, vagy fejezzük be

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
