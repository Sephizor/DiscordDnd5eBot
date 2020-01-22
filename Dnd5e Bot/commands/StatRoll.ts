import { ICharacter } from "../Character";

enum CheckType {
    CHECK,
    SAVE
}

export default class StatRoll {

    static getDiceRoll(message: string, character: ICharacter): string {
        let stat = message.substring(0, 3);
        let checkType: CheckType;
        let advantageType: string = '';
        if(stat === 'per') {
            stat = message.substring(0, 4);
            checkType = message.charAt(4) === 'c' ? CheckType.CHECK : CheckType.SAVE;
            if(message.length === 6) {
                advantageType = message.charAt(5);
            }
        }
        else if(stat === 'int') {
            if(message.charAt(3) === 'i') {
                stat = 'inti';
                checkType = message.charAt(4) === 'c'? CheckType.CHECK : CheckType.SAVE;
                advantageType = message.charAt(5);
            }
            else {
                stat = 'int';
                checkType = message.charAt(3) === 'c'? CheckType.CHECK : CheckType.SAVE;
                advantageType = message.charAt(4);
            }
            
        }
        else {
            checkType = message.charAt(3) === 'c' ? CheckType.CHECK : CheckType.SAVE;
            if(message.length === 5) {
                advantageType = message.charAt(4);
            }
        }

        let diceRoll = advantageType !== '' ? advantageType : 'r';
        diceRoll += '1d20+';

        if(checkType === CheckType.CHECK) {
            switch(stat) {
                case 'str':
                    diceRoll += character.strength;
                    break;
                case 'dex':
                    diceRoll += character.dexterity;
                    break;
                case 'con':
                    diceRoll += character.constitution;
                    break;
                case 'int':
                    diceRoll += character.intelligence;
                    break;
                case 'wis':
                    diceRoll += character.wisdom;
                    break;
                case 'cha':
                    diceRoll += character.charisma;
                    break;
                case 'acr':
                    diceRoll += character.acrobatics;
                    break;
                case 'ani':
                    diceRoll += character.animalHandling;
                    break;
                case 'arc':
                    diceRoll += character.arcana;
                    break;
                case 'ath':
                    diceRoll += character.athletics;
                    break;
                case 'dec':
                    diceRoll += character.deception;
                    break;
                case 'his':
                    diceRoll += character.history;
                    break;
                case 'ins':
                    diceRoll += character.insight;
                    break;
                case 'inti':
                    diceRoll += character.intimidation;
                    break;
                case 'inv':
                    diceRoll += character.investigation;
                    break;
                case 'med':
                    diceRoll += character.medicine;
                    break;
                case 'nat':
                    diceRoll += character.nature;
                    break;
                case 'perc':
                    diceRoll += character.perception;
                    break;
                case 'perf':
                    diceRoll += character.performance;
                    break;
                case 'pers':
                    diceRoll += character.persuasion;
                    break;
                case 'rel':
                    diceRoll += character.religion;
                    break;
                case 'sle':
                    diceRoll += character.sleightOfHand;
                    break;
                case 'ste':
                    diceRoll += character.stealth;
                    break;
                case 'sur':
                    diceRoll += character.survival;
                    break;
                default:
                    throw new Error(`Invalid stat: ${stat}`);
            }
        }
        else if(checkType === CheckType.SAVE) {
            switch(stat) {
                case 'str':
                    diceRoll += character.strsave;
                    break;
                case 'dex':
                    diceRoll += character.dexsave;
                    break;
                case 'con':
                    diceRoll += character.consave;
                    break;
                case 'int':
                    diceRoll += character.intsave;
                    break;
                case 'wis':
                    diceRoll += character.wissave;
                    break;
                case 'cha':
                    diceRoll += character.chasave;
                    break;
                default:
                    throw new Error(`You cannot do a save for ${stat}`);
            }
        }

        diceRoll = diceRoll.replace('+-', '-');

        return diceRoll;
    }

}