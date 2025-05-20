// js/gameState.js

export const unitsData = {}; // Egységek adatai
export const initialUnits = { 'TP': { bloodMarkers: 0 }, 'HT': { bloodMarkers: 0 } }; // Kezdeti egységek
export const unitsActivatedThisRound = {}; // Mely egységek aktiválódtak az aktuális körben
export let currentRound = 1; // Aktuális kör
export let gameStarted = false; // Játék elkezdődött-e
export let selectedUnitCell = null; // Aktuálisan kiválasztott egység cellája
export let currentAction = null; // Aktuális akció (move/attack)
export let activeUnit = null; // Aktuálisan aktivált egység div-je
export let hasMoved = false; // Aktív egység mozgott-e már
export let hasAttacked = false; // Aktív egység támadott-e már
export let unitsPlaced = 0; // Hány egység lett elhelyezve
export let selectedArmyUnit = null;

// Függvények az állapotváltozók frissítésére (ha szükséges)
export function setGameStarted(value) { gameStarted = value; }
export function setSelectedUnitCell(cell) { selectedUnitCell = cell; }
export function setCurrentAction(action) { currentAction = action; }
export function setActiveUnit(unit) { activeUnit = unit; }
export function setHasMoved(value) { hasMoved = value; }
export function setHasAttacked(value) { hasAttacked = value; }
export function incrementUnitsPlaced() { unitsPlaced++; }
export function incrementRound() { currentRound++; }
export function resetUnitsActivatedThisRound() {
    for (const unit in unitsActivatedThisRound) {
        unitsActivatedThisRound[unit] = false;
    }
}
export function setSelectedArmyUnit(unit) { selectedArmyUnit = unit; } // ÚJ: Beállító függvény

// ÚJ: Frakció beállító függvények
export function setPlayer1Faction(faction) { player1Faction = faction; }
export function setPlayer2Faction(faction) { player2Faction = faction; }

// ÚJ: InitialUnits inicializálása a választott frakciók alapján
export function initializeInitialUnits(faction1, faction2) {
    if (faction1) {
        // ideiglenes megoldás, amíg nem lesznek egyedi egységek
        initialUnits['TP1'] = { type: 'TP', player: 1 };
        initialUnits['HT1'] = { type: 'HT', player: 1 };
    }
    if (faction2) {
        // ideiglenes megoldás, amíg nem lesznek egyedi egységek
        initialUnits['TP2'] = { type: 'TP', player: 2 };
        initialUnits['HT2'] = { type: 'HT', player: 2 };
    }
}
