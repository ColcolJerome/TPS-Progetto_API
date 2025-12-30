/*
TODO:Crea una classe pokemon con nome, livello, vita, tipo, lista di mosse(che contiene il nome e i danni della mossa).
*/ 

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

        this.maxHP = [ ((2 * health) * level) / 100 ] + level + 10;
        this.currentHP = this.maxHP;

        this.frontSprite = frontSprite;
        this.backSprite = backSprite;

    }

    isFainted() {
        return this.currentHP <= 0;
    }

}

export class moves {
    constructor(name, priority, power, accuracy, pp, type){
        this.name = name;
        this.priority = priority;
        this.power = power;
        this.accuracy = accuracy; 
        this.pp = pp;
        this.type = type;
    }
}

export function CreateCard(pokemon, selectForBattle=false) {
    let card = document.createElement('div');
    card.classList.add('pokemon-card-show');
    card.setAttribute('data-id', pokemon.id);

    let img = document.createElement('img');
    img.src = pokemon.frontSprite;
    img.alt = pokemon.name;

    let name = document.createElement('p');
    name.classList.add('poke-name');
    name.textContent = pokemon.name;

    let type = document.createElement('span');
    type.classList.add('poke-type', `type-${pokemon.type[0]}`);
    type.textContent = pokemon.type[0];

    let stats = document.createElement('div');
    stats.classList.add('poke-stats');

    let hpStat = document.createElement('div');
    hpStat.classList.add('stat');

    let hpLabel = document.createElement('span');    
    hpLabel.classList.add('stat-label');
    hpLabel.textContent = 'HP';

    let hpValue = document.createElement('span');
    hpValue.classList.add('stat-value');
    hpValue.textContent = pokemon.health;

    let atkStat = document.createElement('div');
    atkStat.classList.add('stat');

    let atkLabel = document.createElement('span');
    atkLabel.classList.add('stat-label');
    atkLabel.textContent = 'ATK';

    let atkValue = document.createElement('span');
    atkValue.classList.add('stat-value');
    atkValue.textContent = pokemon.attack;

    let defStat = document.createElement('div');
    defStat.classList.add('stat');

    let defLabel = document.createElement('span');
    defLabel.classList.add('stat-label');
    defLabel.textContent = 'DEF';

    let defValue = document.createElement('span');
    defValue.classList.add('stat-value');
    defValue.textContent = pokemon.defense;

    if(selectForBattle) {
        let selectBtn = document.createElement('button');
        selectBtn.classList.add('btn-ds', 'btn-green', 'btn-small', 'btn-select');
        selectBtn.textContent = 'SELEZIONA';
        selectBtn.onclick = () => selectForBattle(pokemon.id);
        card.appendChild(selectBtn);
    }

    hpStat.appendChild(hpLabel);
    hpStat.appendChild(hpValue);
    stats.appendChild(hpStat);

    atkStat.appendChild(atkLabel);
    atkStat.appendChild(atkValue);
    stats.appendChild(atkStat);

    defStat.appendChild(defLabel);
    defStat.appendChild(defValue);
    stats.appendChild(defStat);

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(stats);

    return card;
}

export default pokemon;
