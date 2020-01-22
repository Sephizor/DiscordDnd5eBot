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
    animalHandling: number;
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
    sleightOfHand: number;
    stealth: number;
    survival: number;

    // Other
    initiative: number;
    armorClass: number;
}

export default class Character {

    public static serialise(char: ICharacter): string {
        return JSON.stringify(char);
    }

    public static fromJSON(json: string): ICharacter {
        try {
            return <ICharacter>(JSON.parse(json));
        }
        catch(e) {
            throw new Error('Invalid JSON specified for character');
        }
    }
}
