// js/factions.js

// Itt definiáljuk az összes egységet, típussal és költséggel
export const ALL_UNITS = {
    // Heretic Legion
    'HPr': { name: 'Heretic Priest', cost: 80 },
    'DCo': { name: 'Death Commando', cost: 90 },
    'HCh': { name: 'Heretic Chorister', cost: 65 },
    'HTr': { name: 'Heretic Trooper', cost: 30 },
    'HLM': { name: 'Heretic Legionnaire m', cost: 40 },
    'HLR': { name: 'Heretic Legionnaire r', cost: 40 },
    'AHe': { name: 'Annointed Heavy Infantry', cost: 95 },
    'WWo': { name: 'War Wolf', cost: 140 },
    'AWi': { name: 'Artillery Witch', cost: 90 },
    'WRe': { name: 'Wretched', cost: 25 },

    // Trench Pilgrims
    'WPr': { name: 'War Prophet', cost: 80 },
    'Ca': { name: 'Castigator', cost: 50 },
    'Co': { name: 'Communicant', cost: 100 },
    'TPi': { name: 'Trench Pilgrim', cost: 30 },
    'MPe': { name: 'Martyr Penitent', cost: 75 },
    'EPr': { name: 'Ecclesiastic Prisoners', cost: 55 },
    'SNu': { name: 'Stigmatic Nuns', cost: 50 },
    'SAn': { name: 'Shrine Anchorite', cost: 140 },
};

// Itt definiáljuk a frakciókat, és a hozzájuk tartozó egységek rövidítéseit
export const FACTIONS = {
    'Heretic Legion': {
        units: ['HPr', 'DCo', 'HCh', 'HTr', 'HLM', 'HLR', 'AHe', 'WWo', 'AWi', 'WRe'],
    },
    'Trench Pilgrims': {
        units: ['WPr', 'Ca', 'Co', 'TPi', 'MPe', 'EPr', 'SNu', 'SAn'],
    },
    // Ide jönnek majd a többi frakció, ha hozzáadjuk őket
    // 'The Iron Sultanate': { units: [] },
    // ...
};

export const factionNames = Object.keys(FACTIONS);
