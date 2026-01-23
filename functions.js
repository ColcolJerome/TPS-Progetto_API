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
    // TODO: Inizializza gameState con valori default
    // TODO: Carica dati salvati da localStorage se esistono
    // TODO: Imposta monete iniziali a 500
    // TODO: Chiama updateCoinDisplay()
    // TODO: Mostra pagina menu
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

function savePageState(pageId){
    localStorage.setItem('page', pageId);
}

function saveGame() {
    // TODO: Salva gameState in localStorage
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGame() {
    // TODO: Carica gameState da localStorage
    // TODO: Ritorna true se dati trovati, false altrimenti
    let savedState = localStorage.getItem('gameState');
    if(savedState) {
        gameState = JSON.parse(savedState);
        return true;
    } else {
        return false;
    }
}

function saveBattleState(battleState){
    localStorage.setItem( 'state' , JSON.stringify(battleState))
}

// ===== NAVIGATION =====

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

function addCoins(amount) {
    gameState.coins += amount;
    updateCoinDisplay();
}

function spendCoins(amount) {
    // TODO: Controlla se gameState.coins >= amount
    // TODO: Se si, sottrae e ritorna true
    // TODO: Se no, ritorna false (mostrare messaggio errore?)
    // amount: number (100 per base, 2000 per legendary)
    // return: boolean

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

function updateCoinDisplay() {
    const coinCounter = document.getElementById('coin-counter');
    const shopCoinDisplay = document.getElementById('shop-coin-display');

    if (shopCoinDisplay) {
        shopCoinDisplay.textContent = gameState.coins;
    }
    if (coinCounter) {
        coinCounter.textContent = gameState.coins;
    }
}


// ===== SHOP =====

async function buyPack(packType) {
    // TODO: Se successo, genera Pokemon random:
    //       - base: Pokemon comune (ID 1-151 esclusi leggendari)
    //       - legendary: Pokemon leggendario (es: 144,145,146,150,151,etc)
    // TODO: Chiama API PokeAPI per ottenere dati Pokemon
    // TODO: Aggiungi Pokemon a gameState.inventory
    // TODO: Chiama showPackReveal() con dati Pokemon
    // TODO: Aggiorna #last-pokemon
    // packType: 'base' o 'legendary'
    const packBaseCost = 250;
    const packLegendaryCost = 2000;
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


async function pullPack(cost,numberOfPokemon, packType){
    let hasMoney = false;
    hasMoney = spendCoins(cost);
    if(hasMoney){
        if(packType == 'legendary'){
            let pokemonEstratti = await pullLegendaryPokemon(cost);
        }
        else{
            console.log("Pack acquistato: " + packType);
            let pokemonEstratti = await fetchPackOfPokemon(numberOfPokemon);
            console.log(pokemonEstratti);
        }
        for(let p of pokemonEstratti){
            gameState.inventory.push(p);
            await showPackReveal(p);
            console.log(gameState.inventory);
        }
    }
}
function showPackReveal(pokemon) {
    // TODO: Mostra #pack-reveal rimuovendo classe hidden
    // TODO: Popola #reveal-content con card Pokemon
    // TODO: Aggiungi animazione di reveal
    // pokemon: oggetto con dati Pokemon (name, sprite, stats, type)

    const packReveal = document.getElementById('pack-reveal');
    const revealContent = document.getElementById('reveal-content');
    revealContent.innerHTML = ''; // Pulisce contenuto precedente
    const pokemonCard = CreateCard(pokemon);
    revealContent.appendChild(pokemonCard);
    packReveal.classList.remove('hidden');

    //Rende il packReaveal una Promise per gestire l'attesa della chiusura
    return new Promise(resolve => { 
        packRevealPromise = resolve;
    });

}

function closePackReveal() {
    // TODO: Nasconde #pack-reveal aggiungendo classe hidden
    // TODO: Aggiorna renderInventory() se necessario
    const packReveal = document.getElementById('pack-reveal');
    packReveal.classList.add('hidden');

    if (packRevealPromise) {
        packRevealPromise();
        packRevealPromise = null;
    }
}


// ===== INVENTORY =====

function renderInventory() {
    // TODO: Svuota #pokemon-grid
    // TODO: Se gameState.inventory vuoto, mostra messaggio vuoto
    // TODO: Per ogni Pokemon in inventory, crea card HTML
    // TODO: Usa template card commentato come riferimento
    // TODO: Aggiungi classe 'legendary' se Pokemon leggendario
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
function createEmptyMessagge(){
    let message = document.createElement("div");
    message.setAttribute('id','empty-message');
    message.classList.add("hidden","empty-message");
    return message;
}
export function selectForBattle(pokemonId) {
    // TODO: Trova Pokemon in gameState.inventory per ID
    // TODO: Controlla se team ha slot liberi (max 3)
    // TODO: Se slot libero, aggiungi a gameState.activeTeam
    // TODO: Aggiorna visualizzazione #active-team
    // TODO: Se gia nel team, mostra messaggio errore
    // pokemonId: number/string - ID univoco del Pokemon

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

export function removeFromTeam(pokemonId) {
    // TODO: Trova e rimuovi Pokemon da gameState.activeTeam
    // TODO: Aggiorna visualizzazione #active-team
    // pokemonId: number/string
    gameState.activeTeam = gameState.activeTeam.filter(p => p.id != pokemonId);
    saveGame();
    renderActiveTeam();
}

function renderActiveTeam() {
    // TODO: Aggiorna i 3 slot in #active-team
    // TODO: Per slot vuoti, mostra placeholder
    // TODO: Per slot pieni, mostra mini-card con pulsante rimuovi
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

async function startBattle() {
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
function disableBtnMoves(){
    document.querySelectorAll('.move-btn').forEach((button) => {
        button.disabled = true;
    });
}
function enableBtnMoves(){
    document.querySelectorAll('.move-btn').forEach((button) => {
        button.disabled = false;
    });
}
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
async function useMove(moveIndex) {
    let json = JSON.parse(localStorage.getItem('state'));
    
    let nDamage = null;
    let pkmCPU = json.activePokemonCPU;
    let pkmPLA = json.activePokemonPLA;

    //Turno player
    nDamage = calculateDMG(pkmPLA, pkmCPU, pkmPLA.moves[moveIndex]);

    addBattleLog(`${pkmPLA.name} ha utilizzato ${pkmPLA.moves[moveIndex].name}`);

    pkmCPU.currentHP -= nDamage;

    json.enemyTeam.forEach(pokemon => {
        if(pokemon.id == pkmCPU.id){
            pokemon.currentHP = pkmCPU.currentHP;
        }
    });

    updateHPBar('enemy-hp-bar', pkmCPU.currentHP, pkmCPU.maxHP);
    
    if (isFainted(pkmCPU.currentHP)){
        console.log("pokemon cpu fainted", pkmCPU);
        addBattleLog(`${pkmCPU.name} è stato sconfitto!`);
        let win = checkWin(json.enemyTeam);
        if (win){
            onBattleWin();
        } 
        else {
            saveBattleState(json);
            await randomPokemonOnTeam(json);
            console.log("stato dopo possibile aggiunta pokemon 2", json);
            pkmCPU = json.enemyTeam[switchPokemon(json.enemyTeam, true)];
            
            json.activePokemonCPU = pkmCPU;
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

        json.playerTeam.forEach(pokemon => {
            if(pokemon.id == pkmPLA.id){
                pokemon.currentHP = pkmPLA.currentHP;
            }
        });

        updateHPBar('player-hp-bar', pkmPLA.currentHP, pkmPLA.maxHP);

        if (isFainted(pkmPLA.currentHP)){
            addBattleLog(`${pkmCPU.name} è stato sconfitto!`);
            let loss = checkWin(json.playerTeam);
            console.log("loss condition", loss);
            if (loss){
                onBattleLose();
            } else {
                saveBattleState(json);
                switchPokemon(false,false);
                json.activePokemonPLA = pkmPLA;
                renderPLA(pkmPLA);
            }}

        //Essendo in un timeout, devo salvare lo stato qui dentro. Fuori viene eseguito prima del timeout
        console.log("stato dopo i due turni", json);
        saveBattleState(json);
        enableBtnMoves();
    }, 1000);
}

async function randomPokemonOnTeam(json) {
    let findRandomPokemonPercentage = 0.20;
    let random = Math.random();
    console.log("random nunmber:", random);
    if(random  < findRandomPokemonPercentage){
        let randomPokemon = await createPokemonFromAPIData(await fetchOneRandomPokemon());
        addBattleLog(`${randomPokemon.name} si è aggiunto al team!`);
        console.log("adding pokemon to team:", randomPokemon);
        json.playerTeam.push(randomPokemon);
        console.log("battlestate:", json);
    }
    saveBattleState(json);
    console.log("stato dopo il possibile aggiunta pokemon 1", json);
}
function isFainted(hp){
    return hp <= 0;
}

function checkWin(attacker){
    let counter = 0
    attacker.forEach(pokemon => {
        if (isFainted(pokemon.currentHP)){
            counter++
        }
    });
    return counter == attacker.length
}

function calculateDMG(attacker, defender, move){ // per il calcolo danni ho chiesto al chat :)
    let attackStat = move.category.name === "physical"
    ? attacker.attack
    : attacker.specialAttack;
    
    let defenseStat = move.category.name === "physical"
    ? defender.defense
    : defender.specialDefense;

    
    let baseDamage = (((2 * attacker.level / 5 + 2) * move.power * attackStat / defenseStat) / 50) + 2;

    // STAB
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

function getTypeEffectiveness(type, defenderType) { // fatto con il chat :) type, defenderTyp
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
        listDmg.push(effectiveness === undefined ? 1 : effectiveness);
    }
    
    return listDmg.reduce((a, b) => a * b, 1);
}

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

function addBattleLog(message) {
    // TODO: Aggiungi messaggio a #battle-log
    let log = document.getElementById('battle-log');
    log.innerHTML = ``;
    let p = document.createElement('p');
    p.textContent = message;
    log.appendChild(p);
    // TODO: Scroll automatico in basso (da capire)
}

function switchPokemon(cpuFeinted = false,nullable=true) {
    let json = JSON.parse(localStorage.getItem('state'));

    let playerTeam = json.playerTeam

    if (cpuFeinted){
        let random = 0;
        do {
            random = Math.floor(Math.random() * 6)
        } while (isFainted(json.enemyTeam[random].currentHP));
        return random
    } 
    else{
        // TODO: Mostra #switch-modal
        let switchmodal = document.getElementById('switch-modal');
        switchmodal.classList.remove('hidden');
        // TODO: Popola #switch-pokemon-list con Pokemon disponibili nel team
        let switchPokemonList = document.getElementById('switch-pokemon-list');
        switchPokemonList.innerHTML = "";
        playerTeam.forEach(pokemon => {
            if(!isFainted(pokemon.currentHP) && pokemon.id != json.activePokemonPLA.id){
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

export function selectSwitchPokemon(pokemonIndex) {
    let json = JSON.parse(localStorage.getItem('state'));
    let switchmodal = document.getElementById('switch-modal');
    // TODO: Cambia Pokemon attivo in battaglia
    json.playerTeam.forEach(pokemon => {
        if(pokemon.id == pokemonIndex){
            if (!isFainted(pokemon.currentHP) || pokemon.id == json.activePokemonPLA.id){
                console.log("boutta change pokemon")
                json.activePokemonPLA = pokemon;
            }else{
                alert("non puoi selezionare questo pokemon")
            }
        }
    });
    // TODO: Aggiorna UI
    renderPLA(json.activePokemonPLA);
    // TODO: Chiudi modal
    switchmodal.classList.add('hidden');
    // TODO: Turno nemico (penalita per switch?)g
    saveBattleState(json);
}

function closeSwitchModal() {
    // TODO: Nasconde #switch-modal
    let swichmodal = document.getElementById('switch-modal')
    swichmodal.classList.add('hidden');
}

function onBattleWin() {
    console.log("hai vinto la battaglia");
    let winPage = document.getElementById('victory-banner');
    winPage.classList.remove('hidden');
    console.log("Elemento banner trovato?", winPage);
    addCoins(100);
    saveGame();
    // TODO: Aggiungi animazione/suono vittoria
}

function closeVictoryBanner() {
    // TODO: Nasconde #victory-banner
    let lossPage = document.getElementById('victory-banner')
    lossPage.classList.add('hidden');
    // TODO: Reset stato battaglia
    // TODO: Torna al menu
    showPage('page-menu');
}

function onBattleLose() {
    console.log("hai perso la battaglia");
    let lossPage = document.getElementById('defeat-banner');
    lossPage.classList.remove('hidden');
}

function closeDefeatBanner() {
    // TODO: Nasconde #defeat-banner
    let lossPage = document.getElementById('defeat-banner')
    lossPage.classList.add('hidden');
    // TODO: Reset stato battaglia
    // TODO: Torna al menu
    showPage('page-menu');

}


// ===== UTILITY =====

function generateRandomPokemon(isLegendary) {
    // TODO: Genera ID Pokemon random
    // TODO: Se isLegendary, scegli da lista leggendari
    // TODO: Altrimenti, scegli da Pokemon comuni (1-151)
    // TODO: Ritorna oggetto Pokemon con stats generate
    // isLegendary: boolean
    // return: oggetto Pokemon
}

function fetchPokemonData(pokemonId) {
    // TODO: Chiama PokeAPI per ottenere dati Pokemon
    // TODO: Ritorna Promise con dati formattati
    // pokemonId: number
    // return: Promise<Pokemon>
}

function getTypeColor(type) {
    // TODO: Ritorna classe CSS per tipo Pokemon
    // type: string (fire, water, grass, etc.)
    // return: string (es: 'type-fire')
}


// TODO: Funzione per acquistare monete 
function buyCoins(packType) {
    
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