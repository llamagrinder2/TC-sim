// js/unitPlacement.js

import { unitsData, unitsActivatedThisRound, initialUnits, unitsPlaced, incrementUnitsPlaced, selectedArmyUnit, setSelectedArmyUnit, player1Faction, player2Faction } from './gameState.js';
import { unitInfoDiv, messageDisplayDiv, gameGrid } from './domElements.js'; // armyPlacementTable már nincs
import { startGame } from './gameFlow.js';
import { FACTIONS } from './factions.js'; // Importáljuk a frakciókat

let currentPlacementPlayer = 1; // Melyik játékos helyez el éppen egységet
let currentUnitsToPlace = []; // Az aktuális játékos egységei

export function initializeUnitPlacementForPlayer(playerNum) {
    currentPlacementPlayer = playerNum;
    messageDisplayDiv.textContent = `Játékos ${playerNum}, helyezd el az egységeidet!`;
    
    // Meghatározzuk, melyik frakció egységeit kell elhelyezni
    const faction = playerNum === 1 ? player1Faction : player2Faction;
    currentUnitsToPlace = FACTIONS[faction].units.map(unitType => `${unitType}${playerNum}`); // Pl. TP1, HT1

    // Kiválasztjuk az első egységet az elhelyezéshez
    if (currentUnitsToPlace.length > 0) {
        setSelectedArmyUnit(currentUnitsToPlace.shift()); // Kiveszi az elsőt és beállítja
        unitInfoDiv.textContent = `${selectedArmyUnit} kiválasztva. Helyezd el a táblán!`;
    } else {
        unitInfoDiv.textContent = "Nincs több egység elhelyezésre.";
    }
    
    // Az elhelyezéshez szükséges eseményfigyelők
    gameGrid.addEventListener('click', handlePlacementClick);
}

export function handlePlacementClick(event) {
    const clickedCell = event.target;
    // Ellenőrizzük, hogy a cella üres-e, és van-e éppen elhelyezendő egység
    if (clickedCell.classList.contains('grid-cell') && clickedCell.textContent === '' && selectedArmyUnit) {
        const unitName = selectedArmyUnit;
        const unitType = unitName.slice(0, -1); // Pl. TP1 -> TP
        const unitPlayer = parseInt(unitName.slice(-1)); // Pl. TP1 -> 1

        clickedCell.textContent = unitName;
        clickedCell.dataset.unit = unitName;
        clickedCell.dataset.player = unitPlayer; // Hozzáadjuk a játékos adatot a cellához
        
        unitsData[unitName] = { bloodMarkers: 0, type: unitType, player: unitPlayer };
        unitsActivatedThisRound[unitName] = false;

        incrementUnitsPlaced(); // Növeljük az elhelyezett egységek számát

        // Következő egység beállítása, vagy befejezés
        if (currentUnitsToPlace.length > 0) {
            setSelectedArmyUnit(currentUnitsToPlace.shift());
            unitInfoDiv.textContent = `${selectedArmyUnit} kiválasztva. Helyezd el a táblán!`;
        } else {
            setSelectedArmyUnit(null); // Nincs több elhelyezendő egység
            unitInfoDiv.textContent = `Játékos ${currentPlacementPlayer} egységei elhelyezve!`;
            gameGrid.removeEventListener('click', handlePlacementClick); // Levesszük az eseményfigyelőt

            // Ellenőrizzük, hogy a másik játékos is elhelyezte-e már az egységeit
            // Ideiglenes megoldás: Feltételezzük, hogy 2 egységet helyez el mindenki
            if (Object.keys(unitsData).length === Object.keys(FACTIONS[player1Faction].units).length + Object.keys(FACTIONS[player2Faction].units).length) {
                 startGame(); // Mindkét játékos elhelyezte az egységeit, indítsuk a játékot
                 // Elrejtjük a frakcióválasztó gombokat és megjelenítjük a játékmezőt
                 messageDisplayDiv.textContent = "A játék elkezdődik!";
            } else {
                // A másik játékos helyez el egységet
                initializeUnitPlacementForPlayer(currentPlacementPlayer === 1 ? 2 : 1);
            }
        }
    }
}

// Az initializeArmyPlacement funkcióra már nincs szükség, mert a handlePlacementClick kezeli a kattintásokat
// export function initializeArmyPlacement() { ... }
