export interface ICharacter {
    // Base Stats
    _strength: number;
    _dexterity: number;
    _constitution: number;
    _intelligence: number;
    _wisdom: number;
    _charisma: number;

    // Saving throws
    _strSave: number;
    _dexSave: number;
    _conSave: number;
    _intSave: number;
    _wisSave: number;
    _chaSave: number;

    // Stat modifiers
    _acrobatics: number;
    _animalHandling: number;
    _arcana: number;
    _athletics: number;
    _deception: number;
    _history: number;
    _insight: number;
    _intimidation: number;
    _investigation: number;
    _medicine: number;
    _nature: number;
    _perception: number;
    _performance: number;
    _persuasion: number;
    _religion: number;
    _sleightOfHand: number;
    _stealth: number;
    _survival: number;

    // Other
    _initiative: number;
    _armorClass: number;

    serialise(): string;
}

export default class Character implements ICharacter {
    // Base Stats
    _strength: number;
    _dexterity: number;
    _constitution: number;
    _intelligence: number;
    _wisdom: number;
    _charisma: number;

    // Saving throws
    _strSave: number;
    _dexSave: number;
    _conSave: number;
    _intSave: number;
    _wisSave: number;
    _chaSave: number;

    // Stat modifiers
    _acrobatics: number;
    _animalHandling: number;
    _arcana: number;
    _athletics: number;
    _deception: number;
    _history: number;
    _insight: number;
    _intimidation: number;
    _investigation: number;
    _medicine: number;
    _nature: number;
    _perception: number;
    _performance: number;
    _persuasion: number;
    _religion: number;
    _sleightOfHand: number;
    _stealth: number;
    _survival: number;

    // Other
    _initiative: number;
    _armorClass: number;

    constructor(str: number, dex: number, con: number, int: number, wis: number, cha: number,
        strS: number, dexS: number, conS: number, intS: number, wisS: number, chaS: number,
        ini: number, ac: number,
        acr: number, aniH: number, arc: number, ath: number, dec: number, his: number,
        ins: number, inti: number, inv: number, med: number, nat: number, perc: number,
        perf: number, pers: number, rel: number, soh: number, ste: number, sur: number)
    {
        this._strength = str;
        this._dexterity = dex;
        this._constitution = con;
        this._intelligence = int;
        this._wisdom = wis;
        this._charisma = cha;
        this._strSave = strS;
        this._dexSave = dexS;
        this._conSave = conS;
        this._intSave = intS;
        this._wisSave = wisS;
        this._chaSave = chaS;
        this._initiative = ini;
        this._armorClass = ac;
        this._acrobatics = acr;
        this._animalHandling = aniH;
        this._arcana = arc;
        this._athletics = ath;
        this._deception = dec;
        this._history = his;
        this._insight = ins;
        this._intimidation = inti;
        this._investigation = inv;
        this._medicine = med;
        this._nature = nat;
        this._perception = perc;
        this._performance = perf;
        this._persuasion = pers;
        this._religion = rel;
        this._sleightOfHand = soh;
        this._stealth = ste;
        this._survival = sur;
    }

    public serialise(): string {
        return JSON.stringify(this);
    }

    public static fromJSON(json: string) {
        try {
            return <ICharacter>(JSON.parse(json));
        }
        catch(e) {
            throw new Error('Invalid JSON specified for character');
        }
    }
}
