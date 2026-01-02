// ===== GAME STATE  =====

let gameState = {
    coins: 500,
    inventory: [],
    activeTeam: [null, null, null],
    currentBattle: null
};

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

async function startBattle() {

    let state = {
        'playerTeam' : [],
        'enemyTeam' : [],
        'activePokemonPLA' : null,
        'activePokemonCPU' : null,
        'isPlayerTurn' : null
    }

    if ((activeTeam[0] != null && !activeTeam[0].isFainted()) || (activeTeam[1] != null && !activeTeam[1].isFainted()) || (activeTeam[2] != null && !activeTeam[2].isFainted()) ){
       
        let enemies = [];
        enemies = await fetchPackOfPokemon(3);
        state['enemyTeam'] = enemies;
        // TODO: Inizializza gameState.currentBattle con:
        //       - playerTeam: copia di activeTeam
        //       - enemyPokemon: Pokemon generato
        //       - currentPlayerPokemon: primo del team
        //       - turno, etc.
        let copyTeam = structuredClone(activeTeam) // questa funzioan crea un plain object che differisce dall'oggetto sorgente quindi non potrà usare i metodi della classe ma terrà gli attributi, quindi posso modificare la copia e dimenticarmi di ripristinare il team attivo
        state['playerTeam'] = copyTeam;
        state['activePokemonCPU'] = enemies[0];

        
        let activePokemonPLA = null;
        for (let i = 0; i < copyTeam.length; i++ ){
            if (copyTeam[i] != null){
                state['activePokemonPLA'] = copyTeam[i];
                break;
            }
        }

        // TODO: Aggiorna UI battaglia (sprites, nomi, HP bars)
        // TODO: Abilita pulsanti mosse
        // TODO: Aggiungi messaggio a #battle-log
        
    }
    else {
        alert("è necessario avere dei pokemon in squadra");
        showPage("page-inventory");
    }
}

function useMove(moveIndex, cpuIsAttacker = false) {
    let json = JSON.parse(localStorage.get('json'));
    let nDamage = null;

    let pkmCPU = json.activePokemonCPU;
    let pkmPLA = json.activePokemonPLA
    if (cpuIsAttacker){
        nDamage = calculateDMG(pkmCPU, pkmPLA, pkmCPU.moves[moveIndex]);
        // TODO: Aggiorna HP player e barra
        pkmPLA.currentHP -= nDamage; 
        updateHPBar('player-hp-bar', )
    }
    else{
        nDamage = calculateDMG(pkmPLA, pkmCPU, pkmPLA.moves[moveIndex])
        // TODO: Aggiorna HP nemico e barra
        pkmPLA.currentHP -= nDamage;
        updateHPBar('enemy-hp-bar')
    }
    
    // TODO: Aggiungi messaggio a #battle-log
    // TODO: Controlla se nemico sconfitto -> prossimo o vittoria
    // TODO: Turno nemico: calcola e applica danno al giocatore
    // TODO: Aggiorna HP giocatore e barra
    // TODO: Controlla se giocatore sconfitto -> switch o sconfitta
    // moveIndex: 0, 1, 2, o 3
}

function calculateDMG(attacker, defender, move){ // per il calcolo danni ho chiesto al chat :)
    let attackStat = move.category === "physical"
    ? attacker.attack
    : attacker.specialAttack;

    let defenseStat = move.category === "special"
    ? defender.defense
    : defender.specialDefense;

    let baseDamage = (((2 * attacker.level / 5 + 2) * move.power * attackStat / defenseStat) / 50) + 2;

    // STAB
    if (attacker.types.includes(move.type)) {
        baseDamage *= 1.5;
    }

    // efficacia tipi
    baseDamage *= getTypeEffectiveness(move.type, defender.types);

    return Math.floor(baseDamage);
}

function getTypeEffectiveness(){
    const TYPE_CHART = {
        normal: { rock: 0.5, ghost: 0, steel: 0.5 },
        fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
        water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
        electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
        grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
        ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
        fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
        poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
        ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
        flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
        psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
        bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
        rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
        ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
        dragon: { dragon: 2, steel: 0.5, fairy: 0 },
        dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
        steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
        fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 }
    };
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


