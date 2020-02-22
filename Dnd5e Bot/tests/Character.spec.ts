import { expect } from 'chai';
import 'mocha';
import { Mock } from 'typemoq';
import { ImportMock, MockManager } from 'ts-mock-imports';

import { Character } from '../Character';

describe('Character', () => {
    describe('fromJSON', () => {
        it('should throw an error if all character stats are not specified', () => {
            const charString = JSON.stringify({
                dexterity: 0
            });
            expect(() => Character.fromJSON(charString)).to.throw('All stats must be specified when creating a character');
        });

        it('should throw an error if there is an invalid stat in the character json', () => {
            const charString = JSON.stringify({"name":"samplecharacter","strength":-1,"dexterity":2,"constitution":1,"intelligence":2,"wisdom":3,"charisma":1,"strsave":-1,"dexsave":2,"consave":1,"intsave":2,"wissave":6,"chasave":4,"acrobatics":2,"animalhandling":3,"arcana":2,"athletics":-1,"deception":1,"history":5,"insight":3,"intimidation":1,"investigation":2,"medicine":6,"nature":2,"perception":6,"performance":1,"persuasion":1,"religion":2,"sleightofhand":2,"stealth":2,"survival":3,"initiative":2,"armorclass":17, "invalidProperty": true});
            expect(() => Character.fromJSON(charString)).to.throw('Invalid stat defined in character json');
        });

        it('should throw an error if the character json is invalid', () => {
            expect(() => Character.fromJSON("I'm not a json object")).to.throw('Invalid JSON specified for character');
        });

        it('should create a new character given valid input', () => {
            const charString = JSON.stringify({"name":"samplecharacter","strength":-1,"dexterity":2,"constitution":1,"intelligence":2,"wisdom":3,"charisma":1,"strsave":-1,"dexsave":2,"consave":1,"intsave":2,"wissave":6,"chasave":4,"acrobatics":2,"animalhandling":3,"arcana":2,"athletics":-1,"deception":1,"history":5,"insight":3,"intimidation":1,"investigation":2,"medicine":6,"nature":2,"perception":6,"performance":1,"persuasion":1,"religion":2,"sleightofhand":2,"stealth":2,"survival":3,"initiative":2,"armorclass":17});
            expect(() => Character.fromJSON(charString)).not.to.throw();
        });
    });
});