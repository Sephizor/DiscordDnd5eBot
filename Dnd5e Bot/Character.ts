export interface ICharacter {
    name: string;

    // Base Stats
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;

    // Saving throws
    strsave: number;
    dexsave: number;
    consave: number;
    intsave: number;
    wissave: number;
    chasave: number;

    // Stat modifiers
    acrobatics: number;
    animalhandling: number;
    arcana: number;
    athletics: number;
    deception: number;
    history: number;
    insight: number;
    intimidation: number;
    investigation: number;
    medicine: number;
    nature: number;
    perception: number;
    performance: number;
    persuasion: number;
    religion: number;
    sleightofhand: number;
    stealth: number;
    survival: number;

    // Other
    initiative: number;
    armorClass: number;
}

export class Character {

    public static ValidStats = [
        'name',
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma',
        'strsave',
        'dexsave',
        'consave',
        'intsave',
        'wissave',
        'chasave',
        'acrobatics',
        'animalhandling',
        'arcana',
        'athletics',
        'deception',
        'history',
        'insight',
        'intimidation',
        'investigation',
        'medicine',
        'nature',
        'perception',
        'performance',
        'persuasion',
        'religion',
        'sleightofhand',
        'stealth',
        'survival',
        'initiative',
        'armorclass'
    ];

    public static serialise(char: ICharacter): string {
        return JSON.stringify(char);
    }

    public static fromJSON(json: string): ICharacter {
        let character: ICharacter;
        try {
            character = <ICharacter>(JSON.parse(json));
        }
        catch(e) {
            throw new Error('Invalid JSON specified for character');
        }

        if(Object.keys(character).length < this.ValidStats.length) {
            throw new Error('All stats must be specified when creating a character');
        }
        for(let key in character) {
            if(this.ValidStats.indexOf(key) === -1) {
                throw new Error(`Invalid stat defined in character json: ${key}`);
            }
        }
        return character;
        
    }
}
