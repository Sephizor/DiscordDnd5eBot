import { expect } from 'chai';
import 'mocha';
import { Mock } from 'typemoq';
import { Logger } from 'winston';

import RollCommand from '../commands/RollCommand';
import Util from '../Util';

describe('Roll Command', () => {
    let testee: RollCommand;
    let mockLogger = Mock.ofType<Logger>();

    describe('execute', () => {
        describe('Error Handling of invalid input', () => {
            
            const errorOutput = [
                {
                    name: 'Error',
                    value: 'You did that wrong'
                }
            ];

            it('should return error output if the supplied command is ridiculous', async () => {
                testee = new RollCommand('rabcde12345', mockLogger.object);
                expect(await testee.execute()).to.deep.equal(errorOutput);
            });

            it('should return error output if supplied values are zero', async () => {
                testee = new RollCommand('r0d0-0', mockLogger.object);
                expect(await testee.execute()).to.deep.equal(errorOutput);
            });

            it('should return error output if unknown roll type specified', async () => {
                testee = new RollCommand('h2d10+6', mockLogger.object);
                expect(await testee.execute()).to.deep.equal(errorOutput);
            });
        });

        describe('Normal rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', async () => {
                testee = new RollCommand('r2d20', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', async () => {
                testee = new RollCommand('r2d20+4', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', async () => {
                testee = new RollCommand('r2d20+0', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });

            it('should return a number between 1 and 20 for a normal d20 roll', async () => {
                testee = new RollCommand('r1d20', mockLogger.object);
                expect(parseInt((await testee.execute())[1].value, 10)).to.be.greaterThan(0).and.lessThan(21);
            });

            it('should handle rolling a lot of dice', async () => {
                testee = new RollCommand('r100d6', mockLogger.object);
                expect((await testee.execute())[1].value.length).to.equal(298);
            });
        });

        describe('Advantage rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', async () => {
                testee = new RollCommand('a2d20', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', async () => {
                testee = new RollCommand('a2d20+4', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', async () => {
                testee = new RollCommand('a2d20+0', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });

            it('should return two numbers between 1 and 20 for a normal d20 roll', async () => {
                testee = new RollCommand('a1d20', mockLogger.object);
                expect((await testee.execute()).map(x => x.value)).to.match(/.*,.*/)
            });

            it('should choose the higher of two numbers in a normal d20 advantage roll', async () => {
                testee = new RollCommand('a1d20', mockLogger.object);
                const result = await testee.execute();
                const fieldNumber = result.length === 3 ? 0 : 1;
                expect(Util.convertEmojiToNumber(result[fieldNumber].value)).not.to.equal('');
            });

            it('should handle rolling a lot of dice', async () => {
                testee = new RollCommand('a50d6', mockLogger.object);
                expect((await testee.execute())[1].value.length).to.equal(298);
            });
        });

        describe('Disdvantage rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', async () => {
                testee = new RollCommand('d2d20', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', async () => {
                testee = new RollCommand('d2d20+4', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', async () => {
                testee = new RollCommand('d2d20+0', mockLogger.object);
                expect((await testee.execute()).map(x => x.name)).to.include('Dice Roll(s)');
            });

            it('should return two numbers between 1 and 20 for a normal d20 roll', async () => {
                testee = new RollCommand('d1d20', mockLogger.object);
                expect((await testee.execute()).map(x => x.value)).to.match(/.*,.*/);
            });

            it('should handle rolling a lot of dice', async () => {
                testee = new RollCommand('d50d6', mockLogger.object);
                expect((await testee.execute())[1].value.length).to.equal(298);
            });
        });
        
    });
});
