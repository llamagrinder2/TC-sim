// js/domElements.js

// Játékrács
export const gameGrid = document.getElementById('gameGrid');

// Üzenetkijelző
export const messageDisplayDiv = document.getElementById('messageDisplay');

// Frakcióválasztó panel elemei
export const factionSelectionPanel = document.getElementById('factionSelectionPanel'); // Feltételezve, hogy van ilyen
export const selectFaction1Btn = document.getElementById('selectFaction1Btn');
export const selectFaction2Btn = document.getElementById('selectFaction2Btn');
export const factionButtonsContainer = document.getElementById('factionButtonsContainer');

// Egységválasztó panel elemei
export const unitSelectionPanel = document.getElementById('unitSelectionPanel');
export const currentDucatsDisplay = document.getElementById('currentDucatsDisplay');
export const currentArmyList = document.getElementById('currentArmyList');
export const currentArmyCost = document.getElementById('currentArmyCost'); // <-- ÚJ: Ezt kellett hozzáadni!
export const finalizeArmyButton = document.getElementById('finalizeArmyButton'); // Új: A sereg véglegesítése gomb

// Játékmenet gombok (kezdetben rejtettek)
export const actionButtonsDiv = document.getElementById('actionButtons');
export const moveButton = document.getElementById('moveButton');
export const attackButton = document.getElementById('attackButton');
export const endButton = document.getElementById('endButton'); // Kör vége gomb

// Játékbeli infó panelek
export const roundCounterDiv = document.getElementById('roundCounter');
export const unitInfoDiv = document.getElementById('unitInfo');

// Dobókockák
export const dice1Div = document.getElementById('dice1');
export const dice2Div = document.getElementById('dice2');
export const bonusDiceContainer = document.getElementById('bonusDiceContainer'); // Bónusz kockák konténer
