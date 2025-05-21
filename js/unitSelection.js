// js/unitSelection.js

import {
    player1Army,
    player2Army,
    player1DucatsSpent,
    player2DucatsSpent,
    STARTING_DUCATS,
    currentPlayerBuildingArmy,
    addUnitToArmy,
    removeUnitFromArmy,
    setPlayer1Faction, // Szükséges, ha itt történik a frakcióválasztás mentése
    setPlayer2Faction, // Szükséges, ha itt történik a frakcióválasztás mentése
    setCurrentPlayerBuildingArmy, // Fontos a játékos azonosításához
    player1Faction,
    player2Faction,
    setGamePhase // <<< EZ AZ ÚJ IMPORT!
} from './gameState.js';
import { ALL_UNITS, FACTIONS, factionNames } from './factions.js'; // Fontos az egységadatok és frakciók miatt
import {
    messageDisplayDiv,
    player1FactionSelectBtn,
    player2FactionSelectBtn,
    unitSelectionPanel,
    currentDucatsDisplay,
    currentArmyList,
    currentArmyCost,
    factionButtonsContainer,
    finalizeArmyButton // Fontos a gombhoz
} from './domElements.js';
import { initializeUnitPlacementForPlayer } from './unitPlacement.js'; // Importáljuk az egységelhelyezési függvényt

// Frakcióválasztó gombok eseménykezelői
export function setupFactionSelection() {
    selectFaction1Btn.addEventListener('click', () => {
        messageDisplayDiv.textContent = 'Játékos 1, válassz frakciót!';
        factionButtonsContainer.dataset.player = 1;
        factionButtonsContainer.style.display = 'flex'; // Megjelenítjük a frakció gombokat
    });

    selectFaction2Btn.addEventListener('click', () => {
        messageDisplayDiv.textContent = 'Játékos 2, válassz frakciót!';
        factionButtonsContainer.dataset.player = 2;
        factionButtonsContainer.style.display = 'flex'; // Megjelenítjük a frakció gombokat
    });

    // Frakció gombok létrehozása és eseménykezelő hozzáadása
    factionNames.forEach(factionName => {
        const button = document.createElement('button');
        button.classList.add('faction-button');
        button.textContent = factionName;
        button.addEventListener('click', () => selectFaction(factionName));
        factionButtonsContainer.appendChild(button);
    });
}

function selectFaction(faction) {
    const playerNum = parseInt(factionButtonsContainer.dataset.player);

    if (playerNum === 1) {
        setPlayer1Faction(faction);
        messageDisplayDiv.textContent = `Játékos 1 frakciója: ${faction}. Építsd fel a sereged!`;
        // Elrejtjük a frakcióválasztó gombokat és megjelenítjük az egységválasztó panelt
        factionButtonsContainer.style.display = 'none';
        player1FactionSelectBtn.style.display = 'none'; // Elrejtjük Játékos 1 frakcióválasztó gombját
        setCurrentPlayerBuildingArmy(1); // Beállítjuk az aktuális játékost seregépítésre
        initializeUnitSelectionPanel(); // Megjelenítjük az egységválasztó panelt
    } else if (playerNum === 2) {
        setPlayer2Faction(faction);
        messageDisplayDiv.textContent = `Játékos 2 frakciója: ${faction}. Építsd fel a sereged!`;
        factionButtonsContainer.style.display = 'none';
        player2FactionSelectBtn.style.display = 'none'; // Elrejtjük Játékos 2 frakcióválasztó gombját
        setCurrentPlayerBuildingArmy(2); // Beállítjuk az aktuális játékost seregépítésre
        initializeUnitSelectionPanel(); // Megjelenítjük az egységválasztó panelt
    }
}

// Egységválasztó panel inicializálása
export function initializeUnitSelectionPanel() {
    unitSelectionPanel.style.display = 'flex'; // Megjelenítjük az egységválasztó panelt

    const playerFaction = currentPlayerBuildingArmy === 1 ? FACTIONS[player1Faction] : FACTIONS[player2Faction];
    const unitListContainer = unitSelectionPanel.querySelector('.unit-list-container');
    unitListContainer.innerHTML = ''; // Töröljük a régi listát

    // Feltöltjük az egységlistát a kiválasztott frakció egységeivel
    playerFaction.units.forEach(unitAbbr => {
        const unitInfo = ALL_UNITS[unitAbbr];
        if (!unitInfo) {
            console.error(`Hiba: Az ALL_UNITS objektumban nincs adat ehhez az egységhez: ${unitAbbr}`);
            return; // Kihagyjuk ezt az egységet, ha nincs hozzá adat
        }

        const unitItem = document.createElement('div');
        unitItem.classList.add('unit-selection-item');
        unitItem.innerHTML = `
            <span>${unitInfo.name} (${unitInfo.cost} Ducat)</span>
            <div>
                <button class="unit-add-button" data-unit="${unitAbbr}">+</button>
                <button class="unit-remove-button" data-unit="${unitAbbr}">-</button>
            </div>
        `;
        unitListContainer.appendChild(unitItem);
    });

    // Eseménykezelők a hozzáadás és eltávolítás gombokhoz
    unitListContainer.querySelectorAll('.unit-add-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const unitAbbr = event.target.dataset.unit;
            const unitCost = ALL_UNITS[unitAbbr].cost;
            if (addUnitToArmy(currentPlayerBuildingArmy, unitAbbr, unitCost)) {
                updateArmyDisplay();
            } else {
                messageDisplayDiv.textContent = 'Nincs elég Ducatod ehhez az egységhez!';
            }
        });
    });

    unitListContainer.querySelectorAll('.unit-remove-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const unitAbbr = event.target.dataset.unit;
            const unitCost = ALL_UNITS[unitAbbr].cost;
            if (removeUnitFromArmy(currentPlayerBuildingArmy, unitAbbr, unitCost)) {
                updateArmyDisplay();
            } else {
                messageDisplayDiv.textContent = 'Nincs ilyen egység a seregedben, amit eltávolíthatnál!';
            }
        });
    });

    // A sereg véglegesítése gomb eseménykezelője
    finalizeArmyButton.addEventListener('click', () => {
        finalizeArmy();
    });

    updateArmyDisplay(); // Kezdeti kijelző frissítése
}

// Frissíti az aktuális sereg kijelzőjét (pl. mik vannak benne)
function updateArmyDisplay() {
    const currentPlayerArmy = currentPlayerBuildingArmy === 1 ? player1Army : player2Army;
    const currentDucatsLeft = STARTING_DUCATS - (currentPlayerBuildingArmy === 1 ? player1DucatsSpent : player2DucatsSpent);

    currentDucatsDisplay.textContent = `Megmaradt Ducat: ${currentDucatsLeft}`;

    currentArmyList.innerHTML = ''; // Töröljük a régi listát
    let totalCost = 0;

    for (const unitAbbr in currentPlayerArmy) {
        if (currentPlayerArmy[unitAbbr] > 0) {
            const unitInfo = ALL_UNITS[unitAbbr];
            if (unitInfo) { // <--- Ez az ellenőrzés a kulcs!
                const listItem = document.createElement('li');
                const quantity = currentPlayerArmy[unitAbbr];
                const unitCost = unitInfo.cost * quantity;
                totalCost += unitCost;
                listItem.textContent = `${unitInfo.name} x${quantity} (Ár: ${unitCost} Ducat)`;
                currentArmyList.appendChild(listItem);
            } else {
                console.error(`Hiba: Ismeretlen egység rövidítés az ALL_UNITS-ban: ${unitAbbr}`);
                // Debugolási segédlet: megjelenítheted a hibás egységkódot a listában is
                const listItem = document.createElement('li');
                listItem.style.color = 'red';
                listItem.textContent = `HIBA: Ismeretlen egység: ${unitAbbr} x${currentPlayerArmy[unitAbbr]}`;
                currentArmyList.appendChild(listItem);
            }
        }
    }
    currentArmyCost.textContent = `Összesen elköltve: ${totalCost} Ducat`;

    // A sereg véglegesítése gomb csak akkor aktív, ha a ducat <= STARTING_DUCATS
    // és ha van legalább egy elhelyezett egység a seregben.
    const finalizeButton = document.getElementById('finalizeArmyButton');
    if (finalizeButton) {
        const hasAnyUnits = Object.values(currentPlayerArmy).some(count => count > 0);
        finalizeButton.disabled = !(totalCost <= STARTING_DUCATS && hasAnyUnits);
    }
}


// Sereg véglegesítése
function finalizeArmy() {
    unitSelectionPanel.style.display = 'none'; // Elrejtjük az egységválasztó panelt
    messageDisplayDiv.textContent = `Sereg véglegesítve Játékos ${currentPlayerBuildingArmy} számára.`;

    if (currentPlayerBuildingArmy === 1) {
        // Játékos 1 végzett, most Játékos 2 következik
        player1FactionSelectBtn.disabled = true; // Játékos 1 gomb kikapcsolása
        player2FactionSelectBtn.style.display = 'block'; // Megjelenítjük Játékos 2 választó gombját
        player2FactionSelectBtn.disabled = false; // Engedélyezzük Játékos 2 gombját
        messageDisplayDiv.textContent = 'Játékos 1 serege kész! Játékos 2, válaszd ki a frakciódat!';
    } else {
        // Mindkét játékos végzett a seregépítéssel, elkezdődik az egységelhelyezési fázis
        player2FactionSelectBtn.disabled = true; // Játékos 2 gomb kikapcsolása
        messageDisplayDiv.textContent = 'Mindenki elkészült a seregépítéssel. Kezdődik az egységelhelyezés!';
        // Indítjuk az egységelhelyezést Játékos 1 számára
        setGamePhase('placement');
        
        initializeUnitPlacementForPlayer(1);
    }
}
