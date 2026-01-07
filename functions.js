import { fetchPackOfPokemon } from './pullPokemon.mjs';
import { CreateCard } from './pokemon.mjs';
// ===== GAME STATE  =====

let gameState = {
    coins: 500,
    inventory: [],
    activeTeam: [null, null, null],
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
}

function loadGame() {
    // TODO: Carica gameState da localStorage
    // TODO: Ritorna true se dati trovati, false altrimenti
}

// ===== NAVIGATION =====

function showPage(pageId) {
    // pageId: page-menu, page-inventory, page-shop, page-battle
    
    savePageState(pageId);

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('hidden');
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');

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
    // TODO: Determina costo (base=100, legendary=2000)
    // TODO: Chiama spendCoins() per verificare/sottrarre
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
    if(spendCoins(packType === 'base' ? packBaseCost : packLegendaryCost)){
        console.log("Pack acquistato: " + packType);
        let pokemonEstratti = await fetchPackOfPokemon(3);
        console.log(pokemonEstratti);
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
}

function selectForBattle(pokemonId) {
    // TODO: Trova Pokemon in gameState.inventory per ID
    // TODO: Controlla se team ha slot liberi (max 3)
    // TODO: Se slot libero, aggiungi a gameState.activeTeam
    // TODO: Aggiorna visualizzazione #active-team
    // TODO: Se gia nel team, mostra messaggio errore
    // pokemonId: number/string - ID univoco del Pokemon
}

function removeFromTeam(pokemonId) {
    // TODO: Trova e rimuovi Pokemon da gameState.activeTeam
    // TODO: Aggiorna visualizzazione #active-team
    // pokemonId: number/string
}

function renderActiveTeam() {
    // TODO: Aggiorna i 3 slot in #active-team
    // TODO: Per slot vuoti, mostra placeholder
    // TODO: Per slot pieni, mostra mini-card con pulsante rimuovi
}


// ===== BATTLE =====

function startBattle() {
    // TODO: Verifica che activeTeam abbia almeno 1 Pokemon
    // TODO: Se no, mostra messaggio e redirect a inventory
    // TODO: Genera Pokemon nemico random (API o locale)
    // TODO: Inizializza gameState.currentBattle con:
    //       - playerTeam: copia di activeTeam
    //       - enemyPokemon: Pokemon generato
    //       - currentPlayerPokemon: primo del team
    //       - turno, etc.
    // TODO: Aggiorna UI battaglia (sprites, nomi, HP bars)
    // TODO: Abilita pulsanti mosse
    // TODO: Aggiungi messaggio a #battle-log
}

function useMove(moveIndex) {
    // TODO: Ottieni mossa selezionata (0-3) del Pokemon attivo
    // TODO: Calcola danno inflitto al nemico
    // TODO: Aggiorna HP nemico e barra
    // TODO: Aggiungi messaggio a #battle-log
    // TODO: Controlla se nemico sconfitto -> prossimo o vittoria
    // TODO: Turno nemico: calcola e applica danno al giocatore
    // TODO: Aggiorna HP giocatore e barra
    // TODO: Controlla se giocatore sconfitto -> switch o sconfitta
    // moveIndex: 0, 1, 2, o 3
}

function updateHPBar(elementId, currentHP, maxHP) {
    // TODO: Calcola percentuale HP
    // TODO: Aggiorna width della barra
    // TODO: Cambia classe per colore (green > 50%, yellow 20-50%, red < 20%)
    // elementId: 'player-hp-bar' o 'enemy-hp-bar'
}

function addBattleLog(message) {
    // TODO: Aggiungi messaggio a #battle-log
    // TODO: Scroll automatico in basso
    // message: string
}

function switchPokemon() {
    // TODO: Mostra #switch-modal
    // TODO: Popola #switch-pokemon-list con Pokemon disponibili nel team
    // TODO: Escludi Pokemon attuali/sconfitti
}

function selectSwitchPokemon(pokemonIndex) {
    // TODO: Cambia Pokemon attivo in battaglia
    // TODO: Aggiorna UI
    // TODO: Chiudi modal
    // TODO: Turno nemico (penalita per switch?)
    // pokemonIndex: indice nel team
}

function closeSwitchModal() {
    // TODO: Nasconde #switch-modal
}

function flee() {
    // TODO: Conferma fuga
    // TODO: Termina battaglia senza ricompense
    // TODO: Torna al menu
}

function onBattleWin() {
    // TODO: Mostra #victory-banner
    // TODO: Chiama addCoins(100)
    // TODO: Aggiungi animazione/suono vittoria
}

function closeVictoryBanner() {
    // TODO: Nasconde #victory-banner
    // TODO: Reset stato battaglia
    // TODO: Torna al menu
}

function onBattleLose() {
    // TODO: Mostra #defeat-banner
    // TODO: Nessuna ricompensa
}

function closeDefeatBanner() {
    // TODO: Nasconde #defeat-banner
    // TODO: Reset stato battaglia
    // TODO: Torna al menu
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

// ===== ESPONE LE FUNZIONI A LIVELLO GLOBALE  =====
window.showPage = showPage;
window.buyPack = buyPack;
window.useMove = useMove;
window.switchPokemon = switchPokemon;
window.closePackReveal = closePackReveal;
window.closeVictoryBanner = closeVictoryBanner;
window.closeDefeatBanner = closeDefeatBanner;
window.closeSwitchModal = closeSwitchModal;

