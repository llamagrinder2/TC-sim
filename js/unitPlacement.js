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
    setGamePhase
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

export function selectNextUnitToPlace() {
    const playerArmy = currentPlayerPlacing === 1 ? player1Army : player2Army;

    // Végigiterálunk a játékos seregén, hogy megtaláljuk a következő elhelyezendő egységet
    for (const unitAbbr in playerArmy) {
        if (playerArmy[unitAbbr] > 0) { // Ha van még ilyen típusú egység
            currentUnitToPlace = unitAbbr; // Beállítjuk a következő egységet
            messageDisplayDiv.textContent =
                `Játékos ${currentPlayerPlacing}, helyezz el egy ${ALL_UNITS[unitAbbr].name}-t (${playerArmy[unitAbbr]} még maradt)!` +
                ` Kattints egy üres mezőre a saját kezdőzónádban!`;
            highlightPlacementZones(); // Kiemeljük a lehetséges zónákat
            return; // Megtaláltuk az egységet, kilépünk
        }
    }
    clearHighlights(); // Fontos: töröljük az előző játékos zónáinak kiemelését
    // Ha idáig eljutunk, az összes egység el van helyezve a jelenlegi játékos számára
    if (currentPlayerPlacing === 1) {
        messageDisplayDiv.textContent = `Játékos 1, minden egységedet elhelyezted! Most Játékos 2 következik!`;
        // Itt kell elindítani a Játékos 2 seregének összeállítását/elhelyezését, ha még nincs.
        // A `unitSelection.js`-ben van a `finalizeArmy` függvény, ami hívja az `initializeUnitPlacementForPlayer(2)`-t.
        // Valószínűleg itt valamilyen módon újra kell inicializálni a factionSelectionPanel-t, ha Játékos 2 választ még.
        // VAGY HA EZ MÁR MEGTÖRTÉNT a `finalizeArmy`-ban, akkor itt már nem kell.
        // Most azt feltételezem, hogy a `finalizeArmy` hívja ezt a függvényt,
        // és onnan is átvált Játékos 2-re.
        // HA ELAKAD A JÁTÉKOS VÁLTÁSNÁL: nézd meg a `unitSelection.js` `finalizeArmy` függvényét.
        // A lenti sorok (document.querySelector('.faction-selection').style.display = 'flex'; stb.)
        // valószínűleg ide kerültek tévedésből, és az `unitSelection.js` `finalizeArmy` függvényének végén kellene lenniük.
        // Ezek most csak a helyes sorrend és logika miatt vannak itt.
        document.querySelector('.faction-selection').style.display = 'flex'; // Ideiglenesen ide helyezve, ha szükséges
        document.getElementById('selectFaction1Btn').disabled = true; // Ideiglenesen ide helyezve, ha szükséges
        document.getElementById('selectFaction2Btn').disabled = false; // Ideiglenesen ide helyezve, ha szükséges
        initializeUnitPlacementForPlayer(2);
    } else {
        // Mindkét játékos végzett az elhelyezéssel, kezdődjön a játék!
        messageDisplayDiv.textContent = `Mindkét sereg a helyén! Kezdődjön a játék!`;
        setGameStarted(true); // Játék indítása
        setGamePhase('combat');
        // Megjelenítjük a harci UI elemeket
        document.getElementById('actionButtons').style.display = 'flex';
        document.getElementById('endButton').style.display = 'block';
        document.getElementById('roundCounter').style.display = 'block';
        document.getElementById('unitInfo').style.display = 'block';
        document.getElementById('dice1').style.display = 'block';
        document.getElementById('dice2').style.display = 'block';
        document.getElementById('bonusDiceContainer').style.display = 'flex';
        // Esetleg elrejtjük a faction/unit selection panel-eket
        document.querySelector('.faction-selection').style.display = 'none';
        document.getElementById('unitSelectionPanel').style.display = 'none';
    }
    //clearHighlights(); // Eltávolítjuk a kiemeléseket
}

export function highlightPlacementZones() {
    clearHighlights(); // Először töröljük a korábbi kiemeléseket
    const gridCells = gameGrid.querySelectorAll('.grid-cell'); // Lekérjük az összes cellát
    // Meghatározzuk a kezdőzóna sorait a játékos alapján
    const startRow = currentPlayerPlacing === 1 ? 0 : 7;
    const endRow = currentPlayerPlacing === 1 ? 2 : 9;

    gridCells.forEach(cell => {
        const row = parseInt(cell.dataset.row); // Kinyerjük a sor számát
        // Ellenőrizzük, hogy a cella a kezdőzónában van-e, ÉS üres-e (nincs rajta egység)
        if (row >= startRow && row <= endRow && !cell.dataset.unit) {
            cell.classList.add('highlighted-placement'); // Kiemeljük a cellát (ez a CSS osztály valószínűleg zöldre színezi)
        }
    });
}


export function handlePlacementClick(clickedCell) {
    console.log("handlePlacementClick FUT, kattintott cella:", clickedCell);

   
    if (!clickedCell.classList.contains('highlighted-placement')) {
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
            clickedCell.classList.remove('highlighted-placement');


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
