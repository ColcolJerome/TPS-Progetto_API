/*
TODO:Crea una classe pokemon con nome, livello, vita, tipo, lista di mosse(che contiene il nome e i danni della mossa).
*/ 
import { removeFromTeam, selectForBattle } from './functions.js';
class pokemon {
    constructor(id,name, type, level, health, defense, attack, specialAttack, specialDefense, speed, moves, frontSprite, backSprite) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;

        this.health = health;
        this.defense = defense;
        this.attack = attack;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
        this.speed = speed;

        this.moves = moves; // [nomi mosse]

        this.maxHP = Math.floor((2 * health * level) / 100 ) + level + 10;
        this.currentHP = this.maxHP;

        this.frontSprite = frontSprite;
        this.backSprite = backSprite;

    }

}

export class moves {
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
export function CreateMiniCard(pokemon,isEmpty=false,dataSlot=0) {
    if(!isEmpty){
    let card = document.createElement('div');
    card.classList.add('team-slot');
    card.classList.add('filled');
    card.setAttribute('data-id', pokemon.id);

    let img = document.createElement('img');
    img.src = pokemon.frontSprite;
    img.alt = pokemon.name;

    let name = document.createElement('p');
    name.classList.add('slot-name');
    name.textContent = pokemon.name;

    card.appendChild(img);
    card.appendChild(name);

    let selectBtn = document.createElement('button');
    selectBtn.classList.add('remove-btn');
    selectBtn.textContent = 'RIMUOVI';
    selectBtn.onclick = () => removeFromTeam(pokemon.id);

    card.appendChild(selectBtn);

    return card;
    } 
    else {
        let emptyCard = document.createElement('div');
        emptyCard.classList.add('team-slot');
        let span1 = document.createElement('span');
        span1.innerText = `SLOT ${dataSlot}`;
        let span2 = document.createElement('span'); 
        span2.innerText = 'VUOTO';
        emptyCard.appendChild(span1);
        emptyCard.appendChild(span2);
        return emptyCard;
    }
}
export function CreateCard(pokemon, isForBattle=false) {
    let card = document.createElement('div');
    card.classList.add('pokemon-card-show');
    card.setAttribute('data-id', pokemon.id);

    let img = document.createElement('img');
    img.src = pokemon.frontSprite;
    img.alt = pokemon.name;

    let name = document.createElement('p');
    name.classList.add('poke-name');
    name.textContent = pokemon.name;

    let arrayType= [];
    pokemon.type.forEach(element => {
        let type = document.createElement('span');
        type.classList.add('poke-type', `type-${element}`);
        type.textContent = element;
        arrayType.push(type);
    });

    let stats = document.createElement('div');
    stats.classList.add('poke-stats');

    let hpStat = createDivStats('HP', pokemon.maxHP);

    let atkStat = createDivStats('ATK', pokemon.attack);

    let defStat = createDivStats('DEF', pokemon.defense);

    let defValue = document.createElement('span');
    defValue.classList.add('stat-value');
    defValue.textContent = pokemon.defense;

  

    stats.appendChild(hpStat);

    stats.appendChild(atkStat);

    stats.appendChild(defStat);

    card.appendChild(img);
    card.appendChild(name);
    
    arrayType.forEach(type => {
        card.appendChild(type);
    });
    
    card.appendChild(stats);
    if(isForBattle) {
        let selectBtn = document.createElement('button');
        selectBtn.classList.add('btn-ds', 'btn-green', 'btn-small', 'btn-select');
        selectBtn.textContent = 'SELEZIONA';
        selectBtn.onclick = () => selectForBattle(pokemon.id);
        card.appendChild(selectBtn);
    }
    return card;
}

function createDivStats(labelText, value) {
    let statdiv = document.createElement('div');
    statdiv.classList.add('stat');

    let label = document.createElement('span');    
    label.classList.add('stat-label');
    label.textContent = labelText;

    let valueElement = document.createElement('span');
    valueElement.classList.add('stat-value');
    valueElement.textContent = value;

    statdiv.appendChild(label);
    statdiv.appendChild(valueElement);

    return statdiv;
}

export default pokemon;
