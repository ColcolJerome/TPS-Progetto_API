Ecco il codice corretto.

I principali errori che JSDoc segnalava erano dovuti all'uso di **tipi non standard** per JavaScript. Ecco le correzioni apportate:

1.  **`int` / `float` → `number`**: In JavaScript non esiste la distinzione tra interi e decimali nei tipi, si usa sempre `number`.
2.  **`bool` → `boolean`**: Il tipo corretto è `boolean`.
3.  **`json` → `Object`**: JSON è una stringa, l'oggetto in memoria è un `Object`.
4.  **Errori di logica nei parametri**: In `updateHPBar`, i parametri `currentHP` e `maxHP` erano indicati come tipo `{pokemon}` (oggetto), ma sono in realtà numeri.
5.  **Array**: Dove passavi una lista (es. `defenderType`), ho specificato `Array` o `string[]`.

Ecco il codice completo corretto:

```javascript
import { fetchPackOfPokemon } from './pullPokemon.mjs';
import { fetchOneRandomPokemon } from './pullPokemon.mjs';
import { createPokemonFromAPIData } from './pullPokemon.mjs';
import {pullLegendaryPokemon} from './pullPokemon.mjs';
import { CreateCard } from './pokemon.mjs';
import { CreateMiniCard } from './pokemon.mjs';
import { createElement } from 'https://cdn.skypack.dev/react';

// ===== GAME STATE  =====

import pokemon from "./pokemon.mjs";

let gameState = {
    coins: 500,
    inventory: [],
    activeTeam: [],
    currentBattle: null
};

let packRevealPromise = null;

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    if(!loadGame()){
        saveGame();
    }
    if(localStorage.getItem('page')) {
        showPage(localStorage.getItem('page'));
    } else {
        showPage('page-menu');
    }
    updateCoinDisplay();
    
});


// ===== LOCAL STORAGE =====
/**
 * saves current page in local storage
 * @param {string} pageId 
 */
function savePageState(pageId){
    localStorage.setItem('page', pageId);
}
/**
 * saves game state in local storage
 */
function saveGame() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}
/** 
 * loads game state from local storage
 * @returns {boolean}
*/
function loadGame() {
    let savedState = localStorage.getItem('gameState');
    if(savedState) {
        gameState = JSON.parse(savedState);
        return true;
    } else {
        return false;
    }
}
/**
 * saves battle state in local storage
 * @param {Object} battleState 
 */
function saveBattleState(battleState){ 
    localStorage.setItem( 'state' , JSON.stringify(battleState))
}

// ===== NAVIGATION =====
/**
 * Shows a specific page and hides all others
 * @param {string} pageId 
 */
function showPage(pageId) {
    // pageId: page-menu, page-inventory, page-shop, page-battle
    
    savePageState(pageId);
    const pages = document.querySelectorAll('.page');
    const btnBuyCoin = document.getElementById('buy-coin-button');
    btnBuyCoin.classList.add('hidden');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        switch(pageId) {
            case 'page-inventory':
                renderInventory();
                renderActiveTeam();
                break;
            case 'page-battle':
                startBattle();
                break;
            case 'page-shop':
                btnBuyCoin.classList.remove('hidden');
                break;
        }
        

        // Scroll a inizio pagina
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== COIN MANAGEMENT =====
/**
 * Adds coins to the player's total
 * @param {number} amount 
 */
function addCoins(amount) {
    gameState.coins += amount;
    updateCoinDisplay();
}

/**
 * Checks if the player has enough coins to spend and deducts them
 * @param {number} amount 
 * @returns {boolean}
 */
function spendCoins(amount) {
    if(gameState.coins >= amount){
        gameState.coins -= amount;
        updateCoinDisplay();
        return true;
    } 
    else{
        alert("Non hai abbastanza monete!");
        return false;
    }
}
/**
 * Updates all coin displays in the game
 */
function updateCoinDisplay() {
    const coinCounter = document.getElementById('coin-counter');
    const shopCoinDisplay = document.getElementById('shop-coin-display');
    const gamblingCoinDisplay = document.getElementById('gambling-coin-display');   
    if (shopCoinDisplay) {
        shopCoinDisplay.textContent = gameState.coins;
    }
    if (coinCounter) {
        coinCounter.textContent = gameState.coins;
    }
    if (gamblingCoinDisplay) {
        gamblingCoinDisplay.textContent = gameState.coins;
    }
}


// ===== SHOP =====

/**
 * Manages the buying of a pack of pokemons
 * @param {string} packType 
 */
async function buyPack(packType) {
    const packBaseCost = 250;
    const packLegendaryCost = 2500;
    switch (packType) {
        case 'base':

            pullPack(packBaseCost, 3, packType);
            break;

        case 'legendary':
            
            pullPack(packLegendaryCost, 1, packType);
            break;        
    }
    saveGame();
}

/**
 * Manages the pulling of a pack of pokemons
 * @param {number} cost 
 * @param {number} numberOfPokemon 
 * @param {string} packType 
 */
async function pullPack(cost,numberOfPokemon, packType){
    let hasMoney = false;
    hasMoney = spendCoins(cost);
    let pokemonEstratti = [];
    if(hasMoney){
        if(packType == 'legendary'){
            pokemonEstratti = await pullLegendaryPokemon();
            console.log("Legendary acquistato: " + pokemonEstratti);
        }
        else{
            console.log("Pack acquistato: " + packType);
            pokemonEstratti = await fetchPackOfPokemon(numberOfPokemon);
            console.log(pokemonEstratti);
        }
        for(let p of pokemonEstratti){
            gameState.inventory.push(p);
            await showPackReveal(p);
            console.log(gameState.inventory);
        }
    }
}
/**
 * Shows the pack reveal modal with the given pokemon
 * @param {Object} pokemon 
 * @returns {Promise}
 */
function showPackReveal(pokemon) {

    const packReveal = document.getElementById('pack-reveal');
    const revealContent = document.getElementById('reveal-content');
    revealContent.innerHTML = ''; 
    const pokemonCard = CreateCard(pokemon);
    revealContent.appendChild(pokemonCard);
    packReveal.classList.remove('hidden');

    //Rende il packReaveal una Promise per gestire l'attesa della chiusura
    return new Promise(resolve => { 
        packRevealPromise = resolve;
    });

}

/**
 * Closes the pack reveal modal
 */
function closePackReveal() {
    const packReveal = document.getElementById('pack-reveal');
    packReveal.classList.add('hidden');

    if (packRevealPromise) {
        packRevealPromise();
        packRevealPromise = null;
    }
}


// ===== INVENTORY =====
/**
 * Renders the inventory page with all pokemons owned
 */
function renderInventory() {
    const emptyPokemonMessage = document.getElementById('empty-message');
    if(gameState.inventory.length == 0){
        emptyPokemonMessage.classList.remove('hidden');
    }else{

        const pokemonGrid = document.getElementById('pokemon-grid');
        pokemonGrid.innerHTML = "";
        pokemonGrid.appendChild(createEmptyMessagge());
        gameState.inventory.forEach(pokemon => {
            
            const pokemonCard = CreateCard(pokemon, true);
            pokemonGrid.appendChild(pokemonCard);
        });
    }
}
/**
 * Creates an empty message element for the inventory grid
 * @returns {HTMLElement}
 */
function createEmptyMessagge(){
    let message = document.createElement("div");
    message.setAttribute('id','empty-message');
    message.classList.add("hidden","empty-message");
    return message;
}
/**
 * Manages selection of a pokemon for battle team
 * @param {number} pokemonId 
 */
export function selectForBattle(pokemonId) {
    let selectedPokemon = gameState.inventory.find(p => p.id == pokemonId);
    if(selectedPokemon) {
        if(gameState.activeTeam.includes(selectedPokemon)) {
            alert("Pokemon già nel team!");
        } else {
            if(gameState.activeTeam.length < 3) {
                gameState.activeTeam.push(selectedPokemon);
                renderActiveTeam();
            } else {
                alert("Team pieno!");
            }
        }
    } else {
        alert("Pokemon non trovato nell'inventario!");
    }
    saveGame();
}
/**
 * Removes a pokemon from active team by its id
 * @param {number} pokemonId 
 */
export function removeFromTeam(pokemonId) {
    gameState.activeTeam = gameState.activeTeam.filter(p => p.id != pokemonId);
    saveGame();
    renderActiveTeam();
}
/**
 * Renders the active team in inventory page
 */
function renderActiveTeam() {
    const activeTeamContainer = document.getElementById('active-team');
    activeTeamContainer.innerHTML = ''; 
    for(let i = 0; i < 3; i++) {
        if(gameState.activeTeam[i]) {
            const miniCard = CreateMiniCard(gameState.activeTeam[i]);
            activeTeamContainer.appendChild(miniCard);
        }else
        {
            const emptySlot = CreateMiniCard(null,true,i+1);
            activeTeamContainer.appendChild(emptySlot);
        }
    }
    

}


// ===== BATTLE =====
/**
 * starts the battle state
 */
async function startBattle() {
    disableBtnMoves();
    let json = JSON.parse(localStorage.getItem('gameState'));   
    let state = {
        'playerTeam' : [],
        'enemyTeam' : [],
        'activePokemonPLA' : null,
        'activePokemonCPU' : null
    }
    
    if(json.activeTeam.length == 0){
        alert("non hai pokemon in squadra!");
        showPage("page-inventory");
    }
    else{
        let enemies = [];
            enemies = await fetchPackOfPokemon(6);
            enableBtnMoves();
            state['enemyTeam'] = enemies;
            let copyTeam = json.activeTeam.slice()  
            state['playerTeam'] = copyTeam;
            state['activePokemonCPU'] = enemies[0];
            renderCPU(enemies[0]);

            
            for (let i = 0; i < copyTeam.length; i++ ){
                if (copyTeam[i] != null){
                    state['activePokemonPLA'] = copyTeam[i];
                    renderPLA(copyTeam[i]);
                    break;
                }
            }
    
            saveBattleState(state); 
    }
}
/**
 * disables moves buttons
 */
function disableBtnMoves(){
    document.querySelectorAll('.move-btn').forEach((button) => {
        button.disabled = true;
    });
}
/**
 * enables moves buttons
 */
function enableBtnMoves(){
    document.querySelectorAll('.move-btn').forEach((button) => {
        button.disabled = false;
    });
}
/**
 * renders on screen the sprite, name, current hp and max hp of the player's pokemon
 * @param {Object} pokemon 
 */
function renderPLA(pokemon){
    console.log("render pla", pokemon);
    updateHPBar('player-hp-bar', pokemon.currentHP, pokemon.maxHP);
    let PLAimg = document.getElementById('player-sprite');
    let PLAname = document.getElementById('player-name');
    let PLAcurrentHP = document.getElementById('player-hp-current');
    let PLAmaxHP = document.getElementById('player-hp-max');
    
    PLAname.textContent = pokemon.name;
    PLAcurrentHP.textContent = pokemon.currentHP;
    PLAmaxHP.textContent = pokemon.maxHP;
    if(pokemon.backSprite){
        PLAimg.src = pokemon.backSprite;
    }
    else{
        PLAimg.src = pokemon.frontSprite;
    }
    renderMoveButtons(pokemon);
}
/**
 * renders on screen the sprite, name, current hp and max hp of the enemy's pokemon
 * @param {Object} pokemon 
 */
function renderCPU(pokemon){
    console.log("render cpu", pokemon);
    updateHPBar('enemy-hp-bar', pokemon.currentHP, pokemon.maxHP);
    let CPUimg = document.getElementById('enemy-sprite');
    let CPUname = document.getElementById('enemy-name');
    let CPUcurrentHP = document.getElementById('enemy-hp-current');
    let CPUmaxHP = document.getElementById('enemy-hp-max');
    
    CPUname.textContent = pokemon.name;
    CPUcurrentHP.textContent = pokemon.currentHP;
    CPUmaxHP.textContent = pokemon.maxHP;
    CPUimg.src = pokemon.frontSprite;
}
/**
 * shows the pokemon's moves names in the buttons dedicated to them
 * @param {Object} pokemon 
 */
function renderMoveButtons(pokemon){
    document.querySelectorAll('.move-btn').forEach((button, index) => {
        if(pokemon.moves[index]){
            button.textContent = pokemon.moves[index].name;
            button.disabled = false;
        } else {
            button.textContent = '---';
            button.disabled = true;
        }}
    );
}
/**
 * manages not only the usage of the moves but also the entire battle system
 * @param {number} moveIndex 
 */
async function useMove(moveIndex) {
    let state = JSON.parse(localStorage.getItem('state'));
    
    let nDamage = null;
    let pkmCPU = state.activePokemonCPU;
    let pkmPLA = state.activePokemonPLA;

    //Turno player
    nDamage = calculateDMG(pkmPLA, pkmCPU, pkmPLA.moves[moveIndex]);

    addBattleLog(`${pkmPLA.name} ha utilizzato ${pkmPLA.moves[moveIndex].name}`);

    pkmCPU.currentHP -= nDamage;

    state.enemyTeam.forEach(pokemon => {
        if(pokemon.id == pkmCPU.id){
            pokemon.currentHP = pkmCPU.currentHP;
        }
    });

    updateHPBar('enemy-hp-bar', pkmCPU.currentHP, pkmCPU.maxHP);
    
    if (isFainted(pkmCPU.currentHP)){
        console.log("pokemon cpu fainted", pkmCPU);
        addBattleLog(`${pkmCPU.name} è stato sconfitto! rimangono ${state.enemyTeam.length - checkWin(state.enemyTeam, true)}`);
        let win = checkWin(state.enemyTeam);
        if (win){
            onBattleWin();
        } 
        else {
            saveBattleState(state);
            await randomPokemonOnTeam(state);
            console.log("stato dopo possibile aggiunta pokemon 2", state);
            pkmCPU = state.enemyTeam[switchPokemon(state.enemyTeam, true)];
            
            state.activePokemonCPU = pkmCPU;
            renderCPU(pkmCPU);

        }
        
    }
    //Turno CPU
    disableBtnMoves();
    setTimeout(() => {
        let randomMove = Math.floor(Math.random() * pkmCPU.moves.length);

        nDamage = calculateDMG(pkmCPU, pkmPLA, pkmCPU.moves[randomMove]);

        addBattleLog(`${pkmCPU.name} ha utilizzato ${pkmCPU.moves[randomMove].name}`);

        pkmPLA.currentHP -= nDamage;

        state.playerTeam.forEach(pokemon => {
            if(pokemon.id == pkmPLA.id){
                pokemon.currentHP = pkmPLA.currentHP;
            }
        });

        updateHPBar('player-hp-bar', pkmPLA.currentHP, pkmPLA.maxHP);

        if (isFainted(pkmPLA.currentHP)){
            addBattleLog(`${pkmCPU.name} è stato sconfitto! rimangono ${state.playerTeam.lenght - checkWin(state.playerTeam, true)}`);
            let loss = checkWin(state.playerTeam);
            console.log("loss condition", loss);
            if (loss){
                onBattleLose();
            } else {
                saveBattleState(state);
                switchPokemon(false,false);
                state.activePokemonPLA = pkmPLA;
                renderPLA(pkmPLA);
            }}

        //Essendo in un timeout, devo salvare lo stato qui dentro. Fuori viene eseguito prima del timeout
        console.log("stato dopo i due turni", state);
        saveBattleState(state);
        enableBtnMoves();
    }, 1000);
}
/**
 * has 20% chance that a random pokemon gets added to your team after defeating an enemy pokemon
 * @param {Object} state 
 */
async function randomPokemonOnTeam(state) { 
    let findRandomPokemonPercentage = 0.20;
    let random = Math.random();
    console.log("random nunmber:", random);
    if(random  < findRandomPokemonPercentage){
        let randomPokemon = await createPokemonFromAPIData(await fetchOneRandomPokemon());
        addBattleLog(`${randomPokemon.name} si è aggiunto al team!`);
        console.log("adding pokemon to team:", randomPokemon);
        state.playerTeam.push(randomPokemon);
        console.log("battlestate:", state);
    }
    saveBattleState(state);
    console.log("stato dopo il possibile aggiunta pokemon 1", state);
}
/**
 * checks if the pokemon is dead, you need to pass the pokemon current HP
 * @param {number} hp 
 * @returns {boolean}
 */
function isFainted(hp){
    return hp <= 0;
}
/**
 * checks if all pokemon of the selected team are dead
 * @param {Object[]} attacker 
 * @param {boolean} [forNum=false]
 * @returns {boolean|number}
 */
function checkWin(attacker, forNum=false){
    let counter = 0
    attacker.forEach(pokemon => {
        if (isFainted(pokemon.currentHP)){
            counter++
        }
    });
    if (forNum){
        return counter
    }
    return counter == attacker.length
}
/**
 * calculate amount of damage dealt, also checks the STAB and effectiveness of the move
 * @param {Object} attacker 
 * @param {Object} defender 
 * @param {Object} move 
 * @returns {number}
 */
function calculateDMG(attacker, defender, move){ // per il calcolo danni ho chiesto al chat :)
    let attackStat = move.category.name === "physical"
    ? attacker.attack
    : attacker.specialAttack;
    
    let defenseStat = move.category.name === "physical"
    ? defender.defense
    : defender.specialDefense;

    
    let baseDamage = (((2 * attacker.level / 5 + 2) * move.power * attackStat / defenseStat) / 50) + 2;

    // STAB - same type attack boost
    if (attacker.type.includes(move.type)) {
        baseDamage *= 1.5;
    }

    // efficacia tipi
    let effectiveness = getTypeEffectiveness(move.type, defender.type);
    if (effectiveness > 1) {
        setTimeout(() => {addBattleLog("È super efficace!");}, 500);
    } else if (effectiveness < 1 && effectiveness > 0) {
                setTimeout(() => {addBattleLog("Non è molto efficace...");}, 500);
    }

    baseDamage *= effectiveness;

    return Math.floor(baseDamage);
}
/**
 * returns type effectiveness of the move on the enemy pokemon
 * 
 * values returned:
 * - 0
 * - 0.25
 * - 0.5
 * - 1
 * - 2
 * - 4
 * @param {string} type 
 * @param {string[]} defenderType 
 * @returns {number}
 */
function getTypeEffectiveness(type, defenderType) { // fatto con il chat :)
    const TYPE_CHART = {
        "normal": { "rock": 0.5, "ghost": 0, "steel": 0.5 },
        "fire": { "grass": 2, "ice": 2, "bug": 2, "steel": 2, "fire": 0.5, "water": 0.5, "rock": 0.5, "dragon": 0.5 },
        "water": { "fire": 2, "ground": 2, "rock": 2, "water": 0.5, "grass": 0.5, "dragon": 0.5 },
        "electric": { "water": 2, "flying": 2, "electric": 0.5, "grass": 0.5, "dragon": 0.5, "ground": 0 },
        "grass": { "water": 2, "ground": 2, "rock": 2, "fire": 0.5, "grass": 0.5, "poison": 0.5, "flying": 0.5, "bug": 0.5, "dragon": 0.5, "steel": 0.5 },
        "ice": { "grass": 2, "ground": 2, "flying": 2, "dragon": 2, "fire": 0.5, "water": 0.5, "ice": 0.5, "steel": 0.5 },
        "fighting": { "normal": 2, "ice": 2, "rock": 2, "dark": 2, "steel": 2, "poison": 0.5, "flying": 0.5, "psychic": 0.5, "bug": 0.5, "fairy": 0.5, "ghost": 0 },
        "poison": { "grass": 2, "fairy": 2, "poison": 0.5, "ground": 0.5, "rock": 0.5, "ghost": 0.5, "steel": 0 },
        "ground": { "fire": 2, "electric": 2, "poison": 2, "rock": 2, "steel": 2, "grass": 0.5, "bug": 0.5, "flying": 0 },
        "flying": { "grass": 2, "fighting": 2, "bug": 2, "electric": 0.5, "rock": 0.5, "steel": 0.5 },
        "psychic": { "fighting": 2, "poison": 2, "psychic": 0.5, "steel": 0.5, "dark": 0 },
        "bug": { "grass": 2, "psychic": 2, "dark": 2, "fire": 0.5, "fighting": 0.5, "poison": 0.5, "flying": 0.5, "ghost": 0.5, "steel": 0.5, "fairy": 0.5 },
        "rock": { "fire": 2, "ice": 2, "flying": 2, "bug": 2, "fighting": 0.5, "ground": 0.5, "steel": 0.5 },
        "ghost": { "psychic": 2, "ghost": 2, "dark": 0.5, "normal": 0 },
        "dragon": { "dragon": 2, "steel": 0.5, "fairy": 0 },
        "dark": { "psychic": 2, "ghost": 2, "fighting": 0.5, "dark": 0.5, "fairy": 0.5 },
        "steel": { "ice": 2, "rock": 2, "fairy": 2, "fire": 0.5, "water": 0.5, "electric": 0.5, "steel": 0.5 },
        "fairy": { "fighting": 2, "dragon": 2, "dark": 2, "fire": 0.5, "poison": 0.5, "steel": 0.5 }
    };

    let listDmg = [];
    for(let i = 0; i < defenderType.length; i++){
        console.log("Effectivness   ", TYPE_CHART[type][defenderType[i]])
        let effectiveness = TYPE_CHART[type][defenderType[i]];
        listDmg.push(effectiveness === undefined ? 1 : effectiveness); // checks if undefined and makes it number 0
    }
    
    return listDmg.reduce((a, b) => a * b, 1); //does the avarage of tipings (ex. 2x and 0.5x makes 1x)
}
/**
 * updates the visuals for the hp bar of inbattle pokemons
 * @param {string} elementId 
 * @param {number} currentHP 
 * @param {number} maxHP 
 */
function updateHPBar(elementId, currentHP, maxHP) {
    console.log("Updating HP Bar:", elementId, currentHP, maxHP);
    let percent = (currentHP / maxHP) * 100;
    let bar = document.getElementById(elementId);
    bar.style.width = `${percent}%`;
    bar.classList.remove('medium', 'low');
    if (percent < 50 && percent > 20){
        bar.classList.add('medium');
    }else if (percent <= 20){
        bar.classList.remove('medium')
        bar.classList.add('low');
    }
    switch(elementId){
        case 'player-hp-bar':
            let PLAcurrentHP = document.getElementById('player-hp-current');
            PLAcurrentHP.textContent = Math.max(0, currentHP);
            break;
        case 'enemy-hp-bar':
            let ENEMYcurrentHP = document.getElementById('enemy-hp-current');
            ENEMYcurrentHP.textContent = Math.max(0, currentHP);
            break;
    }

}
/**
 * shows battle log message in battle
 * @param {string} message 
 */
function addBattleLog(message) {
    let log = document.getElementById('battle-log');
    log.innerHTML = ``;
    let p = document.createElement('p');
    p.textContent = message;
    log.appendChild(p);
}
/**
 * - if cpuFeinted is true, makes the CPU pokemon switch 
 * - shows switchable pokemons in team during battle
 * - if nullable is true, hides the possibility to close the switchPokemon page
 * @param {boolean} [cpuFeinted=false] 
 * @param {boolean} [nullable=true] 
 * @returns {number|void}
 */
function switchPokemon(cpuFeinted = false,nullable=true) {
    let state = JSON.parse(localStorage.getItem('state'));

    let playerTeam = state.playerTeam

    if (cpuFeinted){
        let random = 0;
        do {
            random = Math.floor(Math.random() * 6)
        } while (isFainted(state.enemyTeam[random].currentHP));
        return random
    } 
    else{
        let switchmodal = document.getElementById('switch-modal');
        switchmodal.classList.remove('hidden');
        let switchPokemonList = document.getElementById('switch-pokemon-list');
        switchPokemonList.innerHTML = "";
        playerTeam.forEach(pokemon => {
            if(!isFainted(pokemon.currentHP) && pokemon.id != state.activePokemonPLA.id){
                const pokemonCard = CreateCard(pokemon, false, true);
                switchPokemonList.appendChild(pokemonCard);
            }
        });
        let btnNull = document.getElementById('switch-null-btn');
        if (!nullable){
            console.log("btn null hidden");
            btnNull.classList.add('hidden');
        }
        else{
            btnNull.classList.remove('hidden');
        }

    }
}
/**
 * makes the player switch pokemon
 * @param {number} pokemonIndex 
 */
export function selectSwitchPokemon(pokemonIndex) {
    let state = JSON.parse(localStorage.getItem('state'));
    let switchmodal = document.getElementById('switch-modal');

    state.playerTeam.forEach(pokemon => {
        if(pokemon.id == pokemonIndex){
            if (!isFainted(pokemon.currentHP) || pokemon.id == state.activePokemonPLA.id){
                console.log("boutta change pokemon") //gotta love writing debugging messages
                state.activePokemonPLA = pokemon;
            }else{
                alert("non puoi selezionare questo pokemon")
            }
        }
    });

    renderPLA(state.activePokemonPLA);

    switchmodal.classList.add('hidden');

    saveBattleState(state);
}
/**
 * closes switch page
 */
function closeSwitchModal() {
    let swichmodal = document.getElementById('switch-modal')
    swichmodal.classList.add('hidden');
}
/**
 * shows winning page
 */
function onBattleWin() {
    console.log("hai vinto la battaglia");
    let winPage = document.getElementById('victory-banner');
    winPage.classList.remove('hidden');
    console.log("Elemento banner trovato?", winPage); //totally useless debugging message imo
    addCoins(100);
    saveGame();
}
/**
 * closes victory page
 */
function closeVictoryBanner() {
    let lossPage = document.getElementById('victory-banner')
    lossPage.classList.add('hidden');
    showPage('page-menu');
}
/**
 * shows lose page
 */
function onBattleLose() {
    console.log("hai perso la battaglia");
    let lossPage = document.getElementById('defeat-banner');
    lossPage.classList.remove('hidden');
}
/**
 * closes lose page
 */
function closeDefeatBanner() { //smh bro why do we calling the losing page in 20 different ways
    let lossPage = document.getElementById('defeat-banner')
    lossPage.classList.add('hidden');
    showPage('page-menu');
}


// ===== ESPONE LE FUNZIONI A LIVELLO GLOBALE  =====
window.showPage = showPage;
window.buyPack = buyPack;
window.useMove = useMove;
window.switchPokemon = switchPokemon;
window.closePackReveal = closePackReveal;
window.closeVictoryBanner = closeVictoryBanner;
window.closeDefeatBanner = closeDefeatBanner;
window.closeSwitchModal = closeSwitchModal;
```