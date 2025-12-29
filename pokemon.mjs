/*
TODO:Crea una classe pokemon con nome, livello, vita, tipo, lista di mosse(che contiene il nome e i danni della mossa).
*/ 

class pokemon {
    constructor(name, type, level, health, defense, attack, specialAttack, specialDefense, moves) {
        this.name = name;
        this.type = type;
        this.level = level;
        this.health = health;
        this.defense = defense;
        this.attack = attack;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
        this.moves = moves;
    }
}

export default pokemon;