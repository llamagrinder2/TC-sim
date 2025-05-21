// js/factions.js

// Itt definiáljuk az összes egységet, típussal, költséggel és játékstatisztikákkal
export const ALL_UNITS = {
    // Heretic Legion
    'HPr': { name: 'Heretic Priest', cost: 80, movement: 6, ranged: 2, melee: 2, armour: 0 }, // <-- maxHP eltávolítva
    'DCo': { name: 'Death Commando', cost: 90, movement: 6, ranged: 2, melee: 2, armour: 0 }, // <-- maxHP eltávolítva
    'HCh': { name: 'Heretic Chorister', cost: 65, movement: 6, ranged: -2, melee: 2, armour: 0 }, // <-- maxHP eltávolítva
    'HTr': { name: 'Heretic Trooper', cost: 30, movement: 6, ranged: 0, melee: 0, armour: 0 }, // <-- maxHP eltávolítva
    'HLM': { name: 'Heretic Legionnaire m', cost: 40, movement: 6, ranged: 1, melee: 0, armour: 0 }, // <-- maxHP eltávolítva
    'HLR': { name: 'Heretic Legionnaire r', cost: 40, movement: 6, ranged: 0, melee: 1, armour: 0 }, // <-- maxHP eltávolítva
    'AHe': { name: 'Annointed Heavy Infantry', cost: 95, movement: 6, ranged: 1, melee: 1, armour: -2 }, // <-- maxHP eltávolítva
    'WWo': { name: 'War Wolf', cost: 140, movement: 8, ranged: 0, melee: 2, armour: -3 }, // <-- maxHP eltávolítva
    'AWi': { name: 'Artillery Witch', cost: 90, movement: 6, ranged: 0, melee: -1, armour: -1 }, // <-- maxHP eltávolítva
    'WRe': { name: 'Wretched', cost: 25, movement: 6, ranged: -1, melee: -1, armour: 0 }, // <-- maxHP eltávolítva

    // Trench Pilgrims
    'WPr': { name: 'War Prophet', cost: 80, movement: 6, ranged: 2, melee: 2, armour: 0 }, // <-- maxHP eltávolítva
    'Ca': { name: 'Castigator', cost: 50, movement: 6, ranged: 1, melee: 1, armour: 1 }, // <-- maxHP eltávolítva
    'Co': { name: 'Communicant', cost: 100, movement: 6, ranged: -3, melee: 2, armour: 0 }, // <-- maxHP eltávolítva
    'TPi': { name: 'Trench Pilgrim', cost: 30, movement: 6, ranged: 0, melee: 0, armour: 0 }, // <-- maxHP eltávolítva
    'MPe': { name: 'Martyr Penitent', cost: 75, movement: 6, ranged: 0, melee: 1, armour: -1 }, // <-- maxHP eltávolítva
    'EPr': { name: 'Ecclesiastic Prisoners', cost: 55, movement: 6, ranged: 0, melee: 0, armour: -1 }, // <-- maxHP eltávolítva
    'SNu': { name: 'Stigmatic Nuns', cost: 50, movement: 8, ranged: 1, melee: 1, armour: 0 }, // <-- maxHP eltávolítva
    'SAn': { name: 'Shrine Anchorite', cost: 140, movement: 6, ranged: 0, melee: 2, armour: -3 }, // <-- maxHP eltávolítva
};

// ... (FACTIONS és factionNames része változatlan)
export const FACTIONS = {
    'Heretic Legion': {
        units: ['HPr', 'DCo', 'HCh', 'HTr', 'HLM', 'HLR', 'AHe', 'WWo', 'AWi', 'WRe'],
    },
    'Trench Pilgrims': {
        units: ['WPr', 'Ca', 'Co', 'TPi', 'MPe', 'EPr', 'SNu', 'SAn'],
    },
};

export const factionNames = Object.keys(FACTIONS);
