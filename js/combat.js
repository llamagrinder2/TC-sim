// js/combat.js

import { diceChars } from './constants.js';
import { dice1Div, dice2Div, bonusDiceContainer, messageDisplayDiv, gameGrid } from './domElements.js';
import { unitsData, unitsActivatedThisRound, activeUnit, currentAction, setHasAttacked, setCurrentAction } from './gameState.js';
import { clearHighlights } from './unitActions.js';
import { endActivation } from './gameFlow.js';

// Segédfüggvény a bónusz kockák megjelenítéséhez/eltüntetéséhez
function createBonusDiceElements(count) {
    bonusDiceContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.classList.add('dice');
        div.id = `bonusDice${i}`;
        bonusDiceContainer.appendChild(div);
    }
}

export function handleAttackAction(targetCell) {
    if (gameStarted && activeUnit && targetCell.classList.contains('highlighted-attack') && targetCell.textContent && targetCell !== activeUnit) {
        const attackerName = activeUnit.textContent.replace(/\d$/, '');
        let defenderName = targetCell.textContent.replace(/\d$/, '');
        const defenderCell = targetCell;

        // Előkészítjük a kockákat
        dice1Div.textContent = '';
        dice2Div.textContent = '';
        bonusDiceContainer.innerHTML = '';

        messageDisplayDiv.textContent = `${attackerName} megcélozza ${defenderName}-t! Találati dobás (min. 7)...`;

        // Első találati kocka dobása
        setTimeout(() => {
            const roll1 = Math.floor(Math.random() * 6) + 1;
            dice1Div.textContent = diceChars[roll1];
            messageDisplayDiv.textContent = `Első találati dobás: ${roll1}`;

            // Második találati kocka dobása
            setTimeout(() => {
                const roll2 = Math.floor(Math.random() * 6) + 1;
                dice2Div.textContent = diceChars[roll2];
                const totalHitRoll = roll1 + roll2;
                messageDisplayDiv.textContent = `Második találati dobás: ${roll2}. Összesen: ${totalHitRoll}!`;

                // Találat ellenőrzése 1 másodperc késleltetés után
                setTimeout(() => {
                    if (totalHitRoll >= 7) {
                        messageDisplayDiv.textContent = `TALÁLAT! (${totalHitRoll}). Most jön a sebzés dobás!`;
                        // Ha sikeres a találat, akkor hívjuk meg a sebzés dobást
                        // Az extra kockák kérdését a performDamageRoll kezeli
                        // Várjunk egy pillanatot, mielőtt a sebzésfázis indul
                        setTimeout(() => {
                            const defenderBloodMarkers = unitsData[defenderName] ? unitsData[defenderName].bloodMarkers : 0;
                            if (defenderBloodMarkers > 0) {
                                messageDisplayDiv.textContent = `${defenderName} egységen ${defenderBloodMarkers} Blood Marker van. Hányat használsz fel extra kockákra? (0-${defenderBloodMarkers})`;
                                setTimeout(() => {
                                    let numExtraDice = parseInt(prompt(`Hány Blood Markert szeretnél felhasználni ${defenderName} ellen? (0-${defenderBloodMarkers})`));
                                    if (isNaN(numExtraDice) || numExtraDice < 0 || numExtraDice > defenderBloodMarkers) {
                                        alert(`Érvénytelen szám. Nem használsz fel Blood Markert. Normál sebzés dobás.`);
                                        numExtraDice = 0;
                                    }
                                    performDamageRoll(attackerName, defenderName, defenderCell, numExtraDice);
                                }, 1000);
                            } else {
                                messageDisplayDiv.textContent = "Nincs Blood Marker. Normál sebzés dobás...";
                                performDamageRoll(attackerName, defenderName, defenderCell, 0);
                            }
                        }, 1000); // 1 másodperc késleltetés a találat üzenet után
                    } else {
                        messageDisplayDiv.textContent = `FÉLRE! (${totalHitRoll}). A támadás nem ér célba.`;
                        // Ha félre, akkor vége az egység aktiválásának
                        setTimeout(() => {
                            dice1Div.textContent = '';
                            dice2Div.textContent = '';
                            bonusDiceContainer.innerHTML = '';
                            setHasAttacked(true);
                            setCurrentAction(null);
                            clearHighlights();
                            endActivation();
                        }, 1000); // 1 másodperc késleltetés a félre üzenet után
                    }
                }, 1000); // 1 másodperc késleltetés az összes dobás után
            }, 1000); // 1 másodperc késleltetés a második dobás előtt
        }, 1000); // 1 másodperc késleltetés az első dobás előtt

    } else if (currentAction === 'attack' && targetCell === activeUnit) {
        alert("Saját egységet nem támadhatsz!");
    }
}

// performAttackRoll -> performDamageRoll névre változik, mivel ez a sebzés dobás!
function performDamageRoll(attackerName, defenderName, defenderCell, numExtraDice = 0) {
    dice1Div.textContent = '';
    dice2Div.textContent = '';
    bonusDiceContainer.innerHTML = '';
    messageDisplayDiv.textContent = `${attackerName} sebzés dobása ${defenderName} ellen! (Felhasznált Blood Markerek: ${numExtraDice})...`;

    const totalDiceToRoll = 2 + numExtraDice;
    let rolls = [];
    for (let i = 0; i < totalDiceToRoll; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
    }

    const firstRoll = rolls[0];
    const secondRoll = rolls[1] || 0;
    const additionalRolls = rolls.slice(2);

    setTimeout(() => {
        dice1Div.textContent = diceChars[firstRoll];
        messageDisplayDiv.textContent = `Első sebzés dobás: ${firstRoll}`;

        setTimeout(() => {
            if (secondRoll > 0) {
                dice2Div.textContent = diceChars[secondRoll];
                messageDisplayDiv.textContent = `Második sebzés dobás: ${secondRoll}.`;
            } else {
                dice2Div.textContent = '';
            }

            let delay = 0;
            if (additionalRolls.length > 0) {
                // Hozzunk létre a bónusz kocka div-eket előre
                createBonusDiceElements(additionalRolls.length);
            }

            additionalRolls.forEach((roll, index) => {
                setTimeout(() => {
                    const bonusDiceDiv = document.getElementById(`bonusDice${index}`); // Az előre létrehozott div-be írunk
                    if(bonusDiceDiv) bonusDiceDiv.textContent = diceChars[roll];
                    messageDisplayDiv.textContent = `Bónusz kocka (${index + 1}): ${roll}`;
                }, delay);
                delay += 1000;
            });

            setTimeout(() => {
                rolls.sort((a, b) => b - a);
                const finalRoll1 = rolls[0];
                const finalRoll2 = rolls[1] || 0;

                const totalFinalRoll = finalRoll1 + finalRoll2;
                messageDisplayDiv.textContent = `Sebzés összesen (a két legmagasabb): ${finalRoll1} + ${finalRoll2} = ${totalFinalRoll}!`;

                setTimeout(() => {
                    let resultMessage = "";
                    if (totalFinalRoll >= 9) {
                        gameGrid.rows[parseInt(defenderCell.dataset.row)].cells[parseInt(defenderCell.dataset.col)].textContent = '';
                        delete unitsData[defenderName];
                        delete unitsActivatedThisRound[defenderName];
                        resultMessage = `${defenderName} KIiktatva!`;
                    } else if (totalFinalRoll >= 2 && totalFinalRoll <= 8) {
                        if (unitsData[defenderName] && unitsData[defenderName].bloodMarkers < 6) {
                            unitsData[defenderName].bloodMarkers++;
                            defenderCell.textContent = `${defenderName}${unitsData[defenderName].bloodMarkers}`;
                            resultMessage = `${defenderName} MEGSÉRÜLT (Blood Marker: ${unitsData[defenderName].bloodMarkers})!`;
                        } else if (unitsData[defenderName]) {
                            resultMessage = `${defenderName} már elérte a maximális Blood Marker számot!`;
                        } else {
                            resultMessage = "A célpont már nem létezik.";
                        }
                    } else {
                        resultMessage = "A sebzés dobásnak nem volt hatása.";
                    }
                    messageDisplayDiv.textContent = resultMessage;

                    setTimeout(() => {
                        dice1Div.textContent = '';
                        dice2Div.textContent = '';
                        bonusDiceContainer.innerHTML = '';
                        if (numExtraDice > 0 && unitsData[defenderName]) {
                            unitsData[defenderName].bloodMarkers -= numExtraDice;
                            if (unitsData[defenderName].bloodMarkers < 0) unitsData[defenderName].bloodMarkers = 0;
                            defenderCell.textContent = `${defenderName}${unitsData[defenderName].bloodMarkers}`;
                            messageDisplayDiv.textContent += ` ${defenderName} Blood Markerei: ${unitsData[defenderName].bloodMarkers}.`;
                        }

                        setHasAttacked(true);
                        setCurrentAction(null);
                        clearHighlights();
                        endActivation();
                    }, 1000);

                }, 1000);

            }, delay + 1000);
        }, 1000);
    }, 1000);
}