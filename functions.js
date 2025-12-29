// ===== GAME STATE (placeholder) =====

let gameState = {
    coins: 500,
    inventory: [],
    activeTeam: [null, null, null],
    currentBattle: null
};


// ===== NAVIGATION =====

function showPage(pageId) {
    // TODO: Nasconde tutte le pagine (page-menu, page-inventory, page-shop, page-battle)
    // TODO: Rimuove classe 'hidden' dalla pagina selezionata
    // TODO: Aggiorna display monete nel negozio se necessario
    // pageId: 'menu', 'inventory', 'shop', 'battle'
}


// ===== COIN MANAGEMENT =====

function getCoins() {
    // TODO: Ritorna il numero di monete attuali da gameState.coins
    // return: number
}

function addCoins(amount) {
    // TODO: Aggiunge 'amount' monete a gameState.coins
    // TODO: Chiama updateCoinDisplay() per aggiornare UI
    // amount: number (tipicamente 100 per vittoria)
}

function spendCoins(amount) {
    // TODO: Controlla se gameState.coins >= amount
    // TODO: Se si, sottrae e ritorna true
    // TODO: Se no, ritorna false (mostrare messaggio errore?)
    // amount: number (100 per base, 2000 per legendary)
    // return: boolean
}

function updateCoinDisplay() {
    // TODO: Aggiorna #coin-counter con valore gameState.coins
    // TODO: Aggiorna #shop-coin-display se visibile
}


// ===== SHOP =====

function buyPack(packType) {
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
}

function showPackReveal(pokemon) {
    // TODO: Mostra #pack-reveal rimuovendo classe hidden
    // TODO: Popola #reveal-content con card Pokemon
    // TODO: Aggiungi animazione di reveal
    // pokemon: oggetto con dati Pokemon (name, sprite, stats, type)
}

function closePackReveal() {
    // TODO: Nasconde #pack-reveal aggiungendo classe hidden
    // TODO: Aggiorna renderInventory() se necessario
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


// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // TODO: Inizializza gameState con valori default
    // TODO: Carica dati salvati da localStorage se esistono
    // TODO: Imposta monete iniziali a 500
    // TODO: Chiama updateCoinDisplay()
    // TODO: Mostra pagina menu
    showPage('menu');
});


// ===== LOCAL STORAGE (opzionale) =====

function saveGame() {
    // TODO: Salva gameState in localStorage
}

function loadGame() {
    // TODO: Carica gameState da localStorage
    // TODO: Ritorna true se dati trovati, false altrimenti
}