// js/factions.js

// Itt definiáljuk az összes egységet, típussal, költséggel és játékstatisztikákkal
export const ALL_UNITS = {
    // Heretic Legion
    'HPr': { name: 'Heretic Priest', cost: 80, movement: 6, ranged: 2, melee: 2, armour: 0, maxHP: 10 },
    'DCo': { name: 'Death Commando', cost: 90, movement: 6, ranged: 2, melee: 2, armour: 0, maxHP: 10 },
    'HCh': { name: 'Heretic Chorister', cost: 65, movement: 6, ranged: -2, melee: 2, armour: 0, maxHP: 10 },
    'HTr': { name: 'Heretic Trooper', cost: 30, movement: 6, ranged: 0, melee: 0, armour: 0, maxHP: 10 },
    'HLM': { name: 'Heretic Legionnaire m', cost: 40, movement: 6, ranged: 1, melee: 0, armour: 0, maxHP: 10 },
    'HLR': { name: 'Heretic Legionnaire r', cost: 40, movement: 6, ranged: 0, melee: 1, armour: 0, maxHP: 10 },
    'AHe': { name: 'Annointed Heavy Infantry', cost: 95, movement: 6, ranged: 1, melee: 1, armour: -2, maxHP: 10 },
    'WWo': { name: 'War Wolf', cost: 140, movement: 8, ranged: 0, melee: 2, armour: -3, maxHP: 10 },
    'AWi': { name: 'Artillery Witch', cost: 90, movement: 6, ranged: 0, melee: -1, armour: -1, maxHP: 10 },
    'WRe': { name: 'Wretched', cost: 25, movement: 6, ranged: -1, melee: -1, armour: 0, maxHP: 10 },

    // Trench Pilgrims
    'WPr': { name: 'War Prophet', cost: 80, movement: 6, ranged: 2, melee: 2, armour: 0, maxHP: 10 },
    'Ca': { name: 'Castigator', cost: 50, movement: 6, ranged: 1, melee: 1, armour: 1, maxHP: 10 },
    'Co': { name: 'Communicant', cost: 100, movement: 6, ranged: -3, melee: 2, armour: 0, maxHP: 10 },
    'TPi': { name: 'Trench Pilgrim', cost: 30, movement: 6, ranged: 0, melee: 0, armour: 0, maxHP: 10 },
    'MPe': { name: 'Martyr Penitent', cost: 75, movement: 6, ranged: 0, melee: 1, armour: -1, maxHP: 10 },
    'EPr': { name: 'Ecclesiastic Prisoners', cost: 55, movement: 6, ranged: 0, melee: 0, armour: -1, maxHP: 10 },
    'SNu': { name: 'Stigmatic Nuns', cost: 50, movement: 8, ranged: 1, melee: 1, armour: 0, maxHP: 10 },
    'SAn': { name: 'Shrine Anchorite', cost: 140, movement: 6, ranged: 0, melee: 2, armour: -3, maxHP: 10 },
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
