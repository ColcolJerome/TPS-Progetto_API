/*
https://pokeapi.co/api/v2/pokemon/{id_pokemon}
*/
import pokemon from './pokemon.mjs';

/**
 * Fetches one random pokemon from the PokeAPI
 * @returns a random pokemon from the PokeAPI
 */
export async function fetchOneRandomPokemon() {
    const PokemonAvalaible = 1025;
    let randomNumber = Math.floor(Math.random() * PokemonAvalaible) + 1;
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`);
    let data = await response.json();
    return data;
}
/**
 * Returns move data from a given move URL
 * @param {string} moveURL 
 * @returns
 */
async function fetchPokemonMove(moveURL) {
    let response = await fetch(moveURL);
    let data = await response.json();
    return data;
}
/**
 * Fetches a pack of random pokemon from the PokeAPI
 * @param {int} packSize 
 * @returns an array of random pokemon from the PokeAPI
 */
export async function fetchPackOfPokemon(packSize) {
    let pokemonList = [];
    for(let i = 0; i < packSize; i++) {
        let data = await fetchOneRandomPokemon();
        pokemonList.push(await createPokemonFromAPIData(data));
    }
    return pokemonList;
}
/**
 * pulls a legendary pokemon from the PokeAPI
 * @returns 
 */
export async function pullLegendaryPokemon() {
    let pokemonList = [];
    const legendaryIndexes = [
    144,145,146,150,243,244,245,249,
    250,377,378,379,380,381,382,383,
    384,480,481,482,483,485,486,487,
    488,638,639,640,641,642,643,644,
    645,646,772,773,785,786,787,788,
    789,790,791,792,800,888,889,890,
    891,892,894,895,896,897,898,905,
    1001,1002,1003,1004,1007,1008
    ];

    let randomLegendaryId = legendaryIndexes[Math.floor(Math.random() * legendaryIndexes.length)];
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomLegendaryId}`);
    let data = await response.json();
    pokemonList.push(await createPokemonFromAPIData(data));
    return pokemonList;
}
/**
 * Creates an array of move objects from API data
 * @param {object} data 
 * @returns 
 */
async function createMoveFromAPIData(data) {
    let mosse = [];
    while(mosse.length < 4){
        let moveInfo = await fetchPokemonMove(data.moves[Math.floor(Math.random() * data.moves.length)].move.url);
        console.log(moveInfo);
        if (moveInfo.damage_class.name == 'status') continue;   
        mosse.push(new move(
            moveInfo.name,
            moveInfo.priority,
            moveInfo.power,
            moveInfo.accuracy,
            moveInfo.pp,
            moveInfo.type.name,
            moveInfo.damage_class
        ));
    }
    return mosse;
}
/**
 * Creates a pokemon object from API data
 * @param {string} data 
 * @returns 
 */
export async function createPokemonFromAPIData(data) {
    const defaultLevel = 50;
    let name = data.name;
    let type = [];
    data.types.forEach(t => type.push(t.type.name));
    let level = defaultLevel;
    let health = data.stats.find(s => s.stat.name === 'hp').base_stat;
    let attack = data.stats.find(s => s.stat.name === 'attack').base_stat;
    let defense = data.stats.find(s => s.stat.name === 'defense').base_stat;
    let specialAttack = data.stats.find(s => s.stat.name === 'special-attack').base_stat;
    let specialDefense = data.stats.find(s => s.stat.name === 'special-defense').base_stat;
    let speed = data.stats.find(s => s.stat.name === 'speed').base_stat;
    let moves = await createMoveFromAPIData(data);
    let frontSprite = data.sprites.front_default;
    let backSprite = data.sprites.back_default;
    return new pokemon(data.id, name, type, level, health, defense, attack, specialAttack, specialDefense, speed, moves, frontSprite, backSprite);
}

class move {
    constructor(name, priority, power, accuracy, pp, type, category){
        this.name = name;
        this.priority = priority;
        this.power = power;
        this.accuracy = accuracy; 
        this.pp = pp;
        this.type = type;
        this.category = category;
    }
}