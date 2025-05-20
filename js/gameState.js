// js/gameState.js

// Alapvető játékadatok tárolása
export const unitsData = {}; // Aktuális egységek adatai (pl. bloodMarkers)
export const initialUnits = {}; // Kezdeti egységek adatai (ezeket a frakcióválasztás tölti fel)
export const unitsActivatedThisRound = {}; // Nyomon követi, mely egységek aktiválódtak az adott körben

// Játékállapot-változók
export let currentRound = 1; // Aktuális kör sorszáma
export let gameStarted = false; // Jelzi, hogy a játék elkezdődött-e
export let selectedUnitCell = null; // Az aktuálisan kiválasztott egység cellája a rácson
export let currentAction = null; // Az aktuálisan végrehajtott akció (pl. 'move', 'attack')
export let activeUnit = null; // Az egység, amelyik éppen aktiválva van
export let hasMoved = false; // Jelzi, hogy az aktív egység mozgott-e már a körben
export let hasAttacked = false; // Jelzi, hogy az aktív egység támadott-e már a körben
export let unitsPlaced = 0; // Az elhelyezett egységek száma az elhelyezési fázisban
export let selectedArmyUnit = null; // A seregválasztó fázisban kiválasztott egység (pl. "TP", "HT")

// Frakció adatok tárolása
export let player1Faction = null; // Az 1. játékos választott frakciója
export let player2Faction = null; // A 2. játékos választott frakciója

// --- Állapotfrissítő függvények ---
// Ezek a függvények felelősek a fenti változók értékének biztonságos módosításáért.

export function setGameStarted(value) {
    gameStarted = value;
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

export function setHasMoved(value) {
    hasMoved = value;
}

export function setHasAttacked(value) { // Helyesen: setHasAttacked
    hasAttacked = value;
}

export function incrementUnitsPlaced() {
    unitsPlaced++;
}

export function incrementRound() {
    currentRound++;
}

export function resetUnitsActivatedThisRound() {
    // Visszaállítja az összes egység aktivált állapotát hamisra az új körhöz
    for (const unit in unitsActivatedThisRound) {
        unitsActivatedThisRound[unit] = false;
    }
}

export function setSelectedArmyUnit(unit) {
    selectedArmyUnit = unit;
}

// Frakció beállító függvények
export function setPlayer1Faction(faction) {
    player1Faction = faction;
}

export function setPlayer2Faction(faction) {
    player2Faction = faction;
}

// initialUnits inicializálása a választott frakciók alapján
// Ez egy ideiglenes megoldás, amíg nincsenek egyedi egységek frakciónként.
// Jelenleg minden frakcióhoz TP és HT egységeket rendel (TP1, HT1, TP2, HT2).
export function initializeInitialUnits(faction1, faction2) {
    // Ürítjük, ha már van benne valami
    for (const key in initialUnits) {
        delete initialUnits[key];
    }

    if (faction1) {
        initialUnits['TP1'] = { type: 'TP', player: 1, faction: faction1 };
        initialUnits['HT1'] = { type: 'HT', player: 1, faction: faction1 };
    }
    if (faction2) {
        initialUnits['TP2'] = { type: 'TP', player: 2, faction: faction2 };
        initialUnits['HT2'] = { type: 'HT', player: 2, faction: faction2 };
    }
}
