import 'mocha';
import { expect } from 'chai';
import { Mock } from 'typemoq';

import { IRandomNumberGenerator, DiceRoller, RollType } from '../commands/DiceRoller';

describe('Dice roller', () => {
    const mockRandom = Mock.ofType<IRandomNumberGenerator>();
    let testee: DiceRoller;

    it('should return two numbers for a d20 advantage roll', async () => {
        mockRandom.setup(x => x.random()).returns(() => 0.5);
        mockRandom.setup(x => x.random()).returns(() => 0.45);
        testee = new DiceRoller(mockRandom.object);
        const result = testee.rollDice(RollType.ADVANTAGE, 1, 20, null, 0);
        expect(result.diceRolls).to.deep.equal([11, 10])
        expect(result.diceResult).to.equal(11);
    });

    it('should return two numbers for a d20 disadvantage roll', async () => {
        mockRandom.setup(x => x.random()).returns(() => 0.5);
        mockRandom.setup(x => x.random()).returns(() => 0.45);
        testee = new DiceRoller(mockRandom.object);
        const result = testee.rollDice(RollType.DISADVANTAGE, 1, 20, null, 0);
        expect(result.diceRolls).to.deep.equal([11, 10])
        expect(result.diceResult).to.equal(10);
    });

    it('should handle rolling a lot of dice on a normal roll', async () => {
        for(let i=0; i<49; i++) {
            mockRandom.setup(x => x.random()).returns(() => 0);
        }
        mockRandom.setup(x => x.random()).returns(() => 0.6666666666666666);
        testee = new DiceRoller(mockRandom.object);
        const result = testee.rollDice(RollType.NORMAL, 50, 6, null, 0);
        expect(result.diceRolls).to.deep.equal([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5]);
        expect(result.diceResult).to.equal(54);
    });

    it('should handle rolling a lot of dice on a disadvantage roll', async () => {
        for(let i=0; i<49; i++) {
            mockRandom.setup(x => x.random()).returns(() => 0.6666666666666666);
        }
        mockRandom.setup(x => x.random()).returns(() => 0);
        testee = new DiceRoller(mockRandom.object);
        const result = testee.rollDice(RollType.DISADVANTAGE, 25, 6, null, 0);
        expect(result.diceRolls).to.deep.equal([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1]);
        expect(result.diceResult).to.equal(1);
    });

    it('should handle rolling a lot of dice on an advantage roll', async () => {
        for(let i=0; i<49; i++) {
            mockRandom.setup(x => x.random()).returns(() => 0);
        }
        mockRandom.setup(x => x.random()).returns(() => 0.6666666666666666);
        testee = new DiceRoller(mockRandom.object);
        const result = testee.rollDice(RollType.ADVANTAGE, 25, 6, null, 0);
        expect(result.diceRolls).to.deep.equal([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5]);
        expect(result.diceResult).to.equal(5);
    });
});