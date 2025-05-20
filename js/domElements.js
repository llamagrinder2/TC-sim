// js/domElements.js

export const gameGrid = document.getElementById('gameGrid');
export const unitInfoDiv = document.getElementById('unitInfo');
export const actionButtonsDiv = document.getElementById('actionButtons');
export const moveButton = document.getElementById('moveButton');
export const attackButton = document.getElementById('attackButton');
export const endButton = document.getElementById('endButton');
export const dice1Div = document.getElementById('dice1');
export const dice2Div = document.getElementById('dice2');
export const bonusDiceContainer = document.getElementById('bonusDiceContainer');
export const messageDisplayDiv = document.getElementById('messageDisplay');
export const roundCounterDiv = document.getElementById('roundCounter'); // Ezt valószínűleg hozzá kell adni az index.html-hez is, ha még nincs

// ÚJ DOM elemek a frakcióválasztáshoz
export const player1FactionNameH2 = document.getElementById('player1FactionName');
export const player2FactionNameH2 = document.getElementById('player2FactionName');
export const selectFaction1Btn = document.getElementById('selectFaction1Btn');
export const selectFaction2Btn = document.getElementById('selectFaction2Btn');
export const factionSelectionDiv = document.querySelector('.faction-selection'); // Az egész szekció
