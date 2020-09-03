import { expect } from 'chai';
import 'mocha';
import { Mock, It, IMock } from 'typemoq';
import { Logger } from 'winston';

import RollCommand from '../commands/RollCommand';
import { IDiceRollService, DiceResult } from '../commands/DiceRoller';

describe('Roll Command', () => {
    let testee: RollCommand;
    let mockLogger = Mock.ofType<Logger>();
    let mockDiceRoller: IMock<IDiceRollService>;

    beforeEach(() => {
        mockDiceRoller = Mock.ofType<IDiceRollService>();
    });

    describe('execute', () => {
        describe('Error Handling of invalid input', () => {
            
            const errorOutput = [
                {
                    name: 'Error',
                    value: 'You did that wrong'
                }
            ];

            it('should return error output if the supplied command is ridiculous', async () => {
                testee = new RollCommand('rabcde12345', mockLogger.object, mockDiceRoller.object);
                expect(await testee.execute()).to.deep.equal(errorOutput);
            });

            it('should return error output if supplied values are zero', async () => {
                testee = new RollCommand('r0d0-0', mockLogger.object, mockDiceRoller.object);
                expect(await testee.execute()).to.deep.equal(errorOutput);
            });

            it('should return error output if unknown roll type specified', async () => {
                testee = new RollCommand('h2d10+6', mockLogger.object, mockDiceRoller.object);
                expect(await testee.execute()).to.deep.equal(errorOutput);
            });
        });

        describe('Normal rolls', () => {
            beforeEach(() => {
                mockDiceRoller = Mock.ofType<IDiceRollService>();
            });

            it('should return successful bot output fields if input is valid with no operator or skill modifier', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 10],
                    diceResult: 20
                });
                testee = new RollCommand('r2d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)).to.deep.equal(['Result', 'Dice Roll(s)', 'Input']);
                expect(result.map(x => x.value)).to.deep.equal([':two::zero:', '10, 10', '2d20']);
            });

            it('should add a critical field for a natural 20', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [20],
                    diceResult: 20
                });
                testee = new RollCommand('r1d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)[0]).to.equal('Critical!');
                expect(result.map(x => x.value)[0]).to.equal('NAT :two::zero:');
            });

            it('should add a critical fail field for a natural 1', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [1],
                    diceResult: 1
                });
                testee = new RollCommand('r1d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)[0]).to.equal('Critical Fail!');
                expect(result.map(x => x.value)[0]).to.equal('NAT :one:');
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 10],
                    diceResult: 24
                });
                testee = new RollCommand('r2d20+4', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)).to.deep.equal(['Result', 'Dice Roll(s)', 'Input']);
                expect(result.map(x => x.value)).to.deep.equal([':two::four:', '10, 10', '2d20+4']);
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 10],
                    diceResult: 20
                });
                testee = new RollCommand('r2d20+0', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)).to.deep.equal(['Result', 'Dice Roll(s)', 'Input']);
                expect(result.map(x => x.value)).to.deep.equal([':two::zero:', '10, 10', '2d20']);
            });

            it('should handle negative numbers', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [1],
                    diceResult: -4
                });
                testee = new RollCommand('r1d2-5', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal('-:four:');
            });

            it('should show all dice rolls for 50 dice', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    diceResult: 50
                });
                testee = new RollCommand('r50d6', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result[0].value).to.equal(':five::zero:');
                expect(result[1].value.length).to.equal(145);
                expect(result[2].value).to.equal('50d6');
            });
        });

        describe('Advantage rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 11, 12, 13],
                    diceResult: 13
                });
                testee = new RollCommand('a2d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':one::three:');
                expect(result.map(x => x.value)[1]).to.equal('10, 11, 12, 13');
                expect(result.map(x => x.value)[2]).to.equal('2d20 with advantage');
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 11, 12, 13],
                    diceResult: 17
                });
                testee = new RollCommand('a2d20+4', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':one::seven:');
                expect(result.map(x => x.value)[1]).to.equal('10, 11, 12, 13');
                expect(result.map(x => x.value)[2]).to.equal('2d20+4 with advantage');
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 11, 12, 13],
                    diceResult: 13
                });
                testee = new RollCommand('a2d20+0', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':one::three:');
                expect(result.map(x => x.value)[1]).to.equal('10, 11, 12, 13');
                expect(result.map(x => x.value)[2]).to.equal('2d20 with advantage');
            });

            it('should add a critical field for a natural 20', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 20],
                    diceResult: 20
                });
                testee = new RollCommand('a1d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)[0]).to.equal('Critical!');
                expect(result.map(x => x.value)[0]).to.equal('NAT :two::zero:');
                expect(result.map(x => x.value)[3]).to.equal('1d20 with advantage');
            });

            it('should add a critical fail field for a natural 1', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [1, 1],
                    diceResult: 1
                });
                testee = new RollCommand('a1d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)[0]).to.equal('Critical Fail!');
                expect(result.map(x => x.value)[0]).to.equal('NAT :one:');
                expect(result.map(x => x.value)[3]).to.equal('1d20 with advantage');
            });

            it('should show all dice rolls for 50 dice', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5],
                    diceResult: 5
                });
                testee = new RollCommand('a25d6', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':five:');
                expect(result.map(x => x.value)[1].length).to.equal(145);
                expect(result.map(x => x.value)[2]).to.equal('25d6 with advantage');
            });
        });

        describe('Disdvantage rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 11, 12, 13],
                    diceResult: 10
                });
                testee = new RollCommand('d2d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':one::zero:');
                expect(result.map(x => x.value)[1]).to.equal('10, 11, 12, 13');
                expect(result.map(x => x.value)[2]).to.equal('2d20 with disadvantage');
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 11, 12, 13],
                    diceResult: 10
                });
                testee = new RollCommand('d2d20+4', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':one::zero:');
                expect(result.map(x => x.value)[1]).to.equal('10, 11, 12, 13');
                expect(result.map(x => x.value)[2]).to.equal('2d20+4 with disadvantage');
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [10, 11, 12, 13],
                    diceResult: 10
                });
                testee = new RollCommand('d2d20+0', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':one::zero:');
                expect(result.map(x => x.value)[1]).to.equal('10, 11, 12, 13');
                expect(result.map(x => x.value)[2]).to.equal('2d20 with disadvantage');
            });

            it('should add a critical field for a natural 20', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [20, 20],
                    diceResult: 20
                });
                testee = new RollCommand('d1d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)[0]).to.equal('Critical!');
                expect(result.map(x => x.value)[0]).to.equal('NAT :two::zero:');
                expect(result.map(x => x.value)[3]).to.equal('1d20 with disadvantage');
            });

            it('should add a critical fail field for a natural 1', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [1, 20],
                    diceResult: 1
                });
                testee = new RollCommand('d1d20', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.name)[0]).to.equal('Critical Fail!');
                expect(result.map(x => x.value)[0]).to.equal('NAT :one:');
                expect(result.map(x => x.value)[3]).to.equal('1d20 with disadvantage');
            });

            it('should show all dice rolls for 50 dice', async () => {
                mockDiceRoller.setup(x => x.rollDice(It.isAny(), It.isAnyNumber(), It.isAnyNumber(), It.isAny(), It.isAnyNumber())).returns(() => <DiceResult>{
                    diceRolls: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1],
                    diceResult: 1
                });
                testee = new RollCommand('d25d6', mockLogger.object, mockDiceRoller.object);
                const result = await testee.execute();
                expect(result.map(x => x.value)[0]).to.equal(':one:');
                expect(result.map(x => x.value)[1].length).to.equal(145);
                expect(result.map(x => x.value)[2]).to.equal('25d6 with disadvantage');
            });
        });
        
    });
});
