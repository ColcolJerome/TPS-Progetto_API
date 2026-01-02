/*
https://pokeapi.co/api/v2/pokemon/{id_pokemon}
*/
import pokemon from './pokemon.mjs';
import moves from './pokemon.mjs';

async function fetchOneRandomPokemon() {
    const PokemonAvalaible = 1025;
    let randomNumber = Math.floor(Math.random() * PokemonAvalaible) + 1;
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`);
    let data = await response.json();
    return data;
}

async function fetchPokemonMove(moveURL) {
    let response = await fetch(moveURL);
    let data = await response.json();
    return data;
}

async function fetchPackOfPokemon(packSize) {
    let pokemonList = [];
    for(let i = 0; i < packSize; i++) {
        let data = await fetchOneRandomPokemon();
        pokemonList.push(createPokemonFromAPIData(data));
    }
    return pokemonList;
}



async function createMoveFromAPIData(data) {
    let mosse = [];
    //Prendo le prime 4 mosse disponibili
    for (let i = 0; i < 4; i++) {
        let moveInfo = await fetchPokemonMove(data.moves[i].move.url);
        mosse.push(new moves(
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

function createPokemonFromAPIData(data) {
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
    let moves = createMoveFromAPIData(data);
    let frontSprite = data.sprites.front_default;
    let backSprite = data.sprites.back_default;
    return new pokemon(name, type, level, health, defense, attack, specialAttack, specialDefense, speed, moves, frontSprite, backSprite);
}