// js/unitSelection.js

import { ALL_UNITS, FACTIONS } from './factions.js';
import { unitSelectionPanel, currentPlayerArmyBuildingTitle, currentDucatsDisplay, unitListContainer, currentArmyList, currentArmyCostDisplay, finalizeArmyButton, messageDisplayDiv, factionSelectionDiv } from './domElements.js';
import { STARTING_DUCATS, player1Faction, player2Faction, player1Army, player2Army, player1DucatsSpent, player2DucatsSpent, setCurrentPlayerBuildingArmy, addUnitToArmy, removeUnitFromArmy, currentPlayerBuildingArmy } from './gameState.js';
import { initializeUnitPlacementForPlayer } from './unitPlacement.js'; // A seregépítés után ez hívódik

let currentPlayerUnits = []; // Az éppen aktuális játékos számára elérhető egységek listája
let currentArmyCount = {}; // Ideiglenes számláló a megjelenítéshez

export function initializeUnitSelection(playerNum) {
    setCurrentPlayerBuildingArmy(playerNum);

    // Elrejtjük a frakcióválasztót
    factionSelectionDiv.style.display = 'none';

    // Megjelenítjük az egységválasztó panelt
    unitSelectionPanel.style.display = 'flex';
    currentPlayerArmyBuildingTitle.textContent = `Játékos ${playerNum} - Seregépítés (${playerNum === 1 ? player1Faction : player2Faction})`;
    messageDisplayDiv.textContent = `Játékos ${playerNum}, építsd fel a seregedet 700 Ducatból!`;

    // Betöltjük az aktuális játékos frakciójához tartozó egységeket
    const currentFaction = playerNum === 1 ? player1Faction : player2Faction;
    currentPlayerUnits = FACTIONS[currentFaction].units.map(unitAbbr => ALL_UNITS[unitAbbr]);

    // Létrehozzuk az egységválasztó gombokat
    renderUnitSelectionButtons();
    // Frissítjük a kijelzőket
    updateArmyDisplay();

    // Eseménykezelő a véglegesítő gombhoz
    finalizeArmyButton.onclick = () => finalizeArmySelection();
}

function renderUnitSelectionButtons() {
    unitListContainer.innerHTML = ''; // Töröljük a korábbi gombokat

    currentPlayerUnits.forEach(unit => {
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('unit-selection-item');

        const unitNameSpan = document.createElement('span');
        unitNameSpan.textContent = `${unit.name} (${unit.cost} Ducat)`;
        unitDiv.appendChild(unitNameSpan);

        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.classList.add('unit-add-button');
        addButton.addEventListener('click', () => {
            if (addUnitToArmy(currentPlayerBuildingArmy, unit.abbr, unit.cost)) { // feltételezve, hogy az ALL_UNITS-ban van abbr (ha nincs, használd a nevet)
                messageDisplayDiv.textContent = `${unit.name} hozzáadva a seregedhez.`;
            } else {
                messageDisplayDiv.textContent = `Nincs elég Ducat a ${unit.name} hozzáadásához!`;
            }
            updateArmyDisplay();
        });
        unitDiv.appendChild(addButton);

        const removeButton = document.createElement('button');
        removeButton.textContent = '-';
        removeButton.classList.add('unit-remove-button');
        removeButton.addEventListener('click', () => {
            if (removeUnitFromArmy(currentPlayerBuildingArmy, unit.abbr, unit.cost)) {
                messageDisplayDiv.textContent = `${unit.name} eltávolítva a seregedből.`;
            } else {
                messageDisplayDiv.textContent = `Nincs ilyen egység a seregedben!`;
            }
            updateArmyDisplay();
        });
        unitDiv.appendChild(removeButton);

        unitListContainer.appendChild(unitDiv);
    });
}


export function updateArmyDisplay() {
    const currentArmy = currentPlayerBuildingArmy === 1 ? player1Army : player2Army;
    const currentDucatsSpent = currentPlayerBuildingArmy === 1 ? player1DucatsSpent : player2DucatsSpent;

    currentDucatsDisplay.textContent = `Elérhető Ducat: ${STARTING_DUCATS - currentDucatsSpent}`;
    currentArmyCostDisplay.textContent = `Összes költség: ${currentDucatsSpent} Ducat`;

    currentArmyList.innerHTML = '';
    for (const unitAbbr in currentArmy) {
        if (currentArmy[unitAbbr] > 0) {
            const unitData = ALL_UNITS[unitAbbr]; // Egység adatok lekérése a rövidítés alapján
            const listItem = document.createElement('li');
            listItem.textContent = `${unitData.name} x ${currentArmy[unitAbbr]} (Költség: ${unitData.cost * currentArmy[unitAbbr]} Ducat)`;
            currentArmyList.appendChild(listItem);
        }
    }
}

// ÚJ: Sereg véglegesítése
function finalizeArmySelection() {
    const currentArmy = currentPlayerBuildingArmy === 1 ? player1Army : player2Army;
    const currentDucatsSpent = currentPlayerBuildingArmy === 1 ? player1DucatsSpent : player2DucatsSpent;

    // TODO: Itt lehetne validáció, pl. minimális egység/ducat költés
    if (Object.keys(currentArmy).length === 0 && currentDucatsSpent === 0) {
        messageDisplayDiv.textContent = "Kérlek, válassz legalább egy egységet a seregedbe!";
        return;
    }

    messageDisplayDiv.textContent = `Játékos ${currentPlayerBuildingArmy} serege véglegesítve!`;
    unitSelectionPanel.style.display = 'none'; // Elrejtjük az egységválasztó panelt

    // Ha még a player1 építette a sereget, akkor player2 jön
    if (currentPlayerBuildingArmy === 1) {
        // Átadjuk a stafétát a 2. játékosnak
        // Kényszerítsük, hogy a játékos 2 válassza ki a frakcióját, ha még nem tette meg
        // Ezt a selectFaction gomb megnyomásával teheti meg
        messageDisplayDiv.textContent = `Játékos 2, válaszd ki a frakciódat és építsd fel a seregedet!`;
        factionSelectionDiv.style.display = 'flex'; // Visszaállítjuk a frakcióválasztót
        selectFaction2Btn.disabled = false; // Engedélyezzük a 2. játékos frakcióválasztó gombját
        selectFaction1Btn.disabled = true; // Letiltjuk az 1. játékosét
    } else {
        // Mindkét játékos végzett, jöhet az egységek elhelyezése
        messageDisplayDiv.textContent = "Mindkét sereg elkészült! Kezdődik az egységek elhelyezése!";
        // Most itt hívjuk meg az elhelyezési fázist az 1. játékosnak
        initializeUnitPlacementForPlayer(1);
    }
}
