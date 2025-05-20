// js/factions.js

export const FACTIONS = {
    'Heretic Legion': {
        units: ['TP', 'HT'], // Példa: Minden frakciónak van egy TP és HT egysége
        // Később itt lehetnek egyedi egységnevek, képességek, stb.
    },
    'Trench Pilgrims': {
        units: ['TP', 'HT'],
    },
    'The Iron Sultanate': {
        units: ['TP', 'HT'],
    },
    'The Principality of New Antioch': {
        units: ['TP', 'HT'],
    },
    'The Cult of the Black Grail': {
        units: ['TP', 'HT'],
    },
    'The Court of the Seven Headed Serpent': {
        units: ['TP', 'HT'],
    },
};

export const factionNames = Object.keys(FACTIONS);
