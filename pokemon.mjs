/*
TODO:Crea una classe pokemon con nome, livello, vita, tipo, lista di mosse(che contiene il nome e i danni della mossa).
*/ 

class pokemon {
    constructor(name, type, level, health, defense, attack, specialAttack, specialDefense, speed, moves, frontSprite, backSprite) {
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

export default pokemon;
