/*
https://pokeapi.co/api/v2/pokemon/{id_pokemon}
*/
import pokemon from './pokemon.mjs';

async function fetchOneRandomPokemon() {
    const PokemonAvalaible = 898;
    let randomNumber = Math.floor(Math.random() * PokemonAvalaible) + 1;
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`);
    let data = await response.json();

}

async function fetchPackOfPokemon(packSize) {
    let pokemonList = [];
    for(let i = 0; i < packSize; i++) {
        pokemonList.push(await fetchOneRandomPokemon());
    }
    console.log(pokemonList);
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
    let moves = [];
    data.moves.slice(0, 4).forEach(m => moves.push(m.move.name)); // Prende le prime 4 mosse
    return new pokemon(name, type, level, health, defense, attack, specialAttack, specialDefense, speed, moves);
}
fetchPackOfPokemon(5);