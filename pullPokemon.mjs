/*
https://pokeapi.co/api/v2/pokemon/{nome_pokemon}
https://pokeapi.co/api/v2/pokemon/{id_pokemon}

*/
import pokemon from './pokemon.mjs';

async function fetchRandomPokemon() {
    let randomNumber = Math.floor(Math.random() * 898) + 1;
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`);
    let data = await response.json();
}

fetchRandomPokemon();