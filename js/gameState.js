// js/gameState.js

// Játékállapot-változók
export let currentRound = 1;
export let gameStarted = false; // A játék elindult-e már (a frakció- és seregválasztás után)
export let selectedUnitCell = null; // A táblán kiválasztott egység cellája
export let currentAction = null; // Aktuális akció ('move', 'attack', null)
export let activeUnit = null; // A jelenleg aktív egység DOM eleme
export let hasMoved = false; // Az aktív egység mozgott-e már
export let hasAttacked = false; // Az aktív egység támadott-e már
export let unitsPlaced = 0; // Elhelyezett egységek száma az elhelyezési fázisban
export let selectedArmyUnit = null; // Az egységválasztó menüben kiválasztott egység (ha van ilyen logika)
export let unitsActivatedThisRound = {};

// Frakció adatok
export let player1Faction = null;
export let player2Faction = null;

// Seregépítéshez szükséges változók
export const STARTING_DUCATS = 700; // Alap költségvetés minden játékosnak
export const player1Army = {}; // Az 1. játékos kiválasztott serege { 'egységRövidítés': mennyiség, ... }
export const player2Army = {}; // A 2. játékos kiválasztott serege
export let player1DucatsSpent = 0; // Az 1. játékos elköltött Ducatja
export let player2DucatsSpent = 0; // A 2. játékos elköltött Ducatja
export let currentPlayerBuildingArmy = null; // Melyik játékos építi éppen a seregét (1 vagy 2)

// --- Állapotfrissítő függvények (Setters) ---
// Ezekkel a függvényekkel módosítjuk a fenti állapot-változókat,
// hogy a változások nyomon követhetőek és konzisztensek legyenek.

export function setCurrentRound(round) {
    currentRound = round;
}

export function setGameStarted(status) {
    gameStarted = status;
}

export function setSelectedUnitCell(cell) {
    selectedUnitCell = cell;
}

export function setCurrentAction(action) {
    currentAction = action;
}

export function setActiveUnit(unit) {
    activeUnit = unit;
}

export function setHasMoved(status) {
    hasMoved = status;
}

export function setHasAttacked(status) {
    hasAttacked = status;
}

export function incrementUnitsPlaced() {
    unitsPlaced++;
}

export function resetUnitsPlaced() {
    unitsPlaced = 0;
}

export function setPlayer1Faction(faction) {
    player1Faction = faction;
}

export function setPlayer2Faction(faction) {
    player2Faction = faction;
}

// Seregépítéssel kapcsolatos seterek
export function setCurrentPlayerBuildingArmy(playerNum) {
    currentPlayerBuildingArmy = playerNum;
}

/**
 * Hozzáad egy egységet a játékos seregéhez, ha van elég Ducat.
 * @param {number} playerNum - A játékos száma (1 vagy 2).
 * @param {string} unitAbbreviation - Az egység rövidítése (pl. 'HPr').
 * @param {number} cost - Az egység költsége.
 * @returns {boolean} - true, ha sikeres volt a hozzáadás; false, ha nincs elég Ducat.
 */
export function addUnitToArmy(playerNum, unitAbbreviation, cost) {
    const army = playerNum === 1 ? player1Army : player2Army;
    let ducatsSpent = playerNum === 1 ? player1DucatsSpent : player2DucatsSpent;

    if (ducatsSpent + cost <= STARTING_DUCATS) {
        army[unitAbbreviation] = (army[unitAbbreviation] || 0) + 1;
        if (playerNum === 1) {
            player1DucatsSpent += cost;
        } else {
            player2DucatsSpent += cost;
        }
        return true; // Sikeres hozzáadás
    }
    return false; // Nincs elég ducat
}

/**
 * Eltávolít egy egységet a játékos seregéből.
 * @param {number} playerNum - A játékos száma (1 vagy 2).
 * @param {string} unitAbbreviation - Az egység rövidítése (pl. 'HPr').
 * @param {number} cost - Az egység költsége.
 * @returns {boolean} - true, ha sikeres volt az eltávolítás; false, ha nincs ilyen egység.
 */
export function removeUnitFromArmy(playerNum, unitAbbreviation, cost) {
    const army = playerNum === 1 ? player1Army : player2Army;
    // Nincs szükség a ducatsSpent ellenőrzésére itt, csak a ducat levonásra

    if (army[unitAbbreviation] > 0) {
        army[unitAbbreviation] -= 1;
        if (playerNum === 1) {
            player1DucatsSpent -= cost;
        } else {
            player2DucatsSpent -= cost;
        }
        // Ha elfogyott az egység, töröljük a kulcsot az objektumból
        if (army[unitAbbreviation] === 0) {
            delete army[unitAbbreviation];
        }
        return true; // Sikeres eltávolítás
    }
    return false; // Nincs ilyen egység a seregben
}

// Az initialUnits inicializálását most az egységelhelyezési fázisban fogjuk megtenni
// a player1Army és player2Army alapján.
// Ezért ez a függvény most üres, vagy az elhelyezéshez szükséges formátumot fogja létrehozni.
export function initializeInitialUnits(faction1, faction2) {
    // Ezt a függvényt később kell majd kitölteni, amikor
    // a player1Army és player2Army alapján konkrét egységobjektumokat hozunk létre
    // a unitsData globális objektum számára, amik majd a rácsra kerülnek.
    // Például:
    // unitsData['HPr1'] = { type: 'HPr', player: 1, faction: faction1, currentHP: 10, maxHP: 10, ... };
    // unitsData['DCo1'] = { type: 'DCo', player: 1, faction: faction1, currentHP: 10, maxHP: 10, ... };
    // ... és a player 2 egységei.
}
