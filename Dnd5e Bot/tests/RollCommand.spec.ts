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

            it('should return error output if the supplied command is ridiculous', () => {
                testee = new RollCommand('rabcde12345', mockLogger.object);
                expect(testee.execute()).to.deep.equal(errorOutput);
            });

            it('should return error output if supplied values are zero', () => {
                testee = new RollCommand('r0d0-0', mockLogger.object);
                expect(testee.execute()).to.deep.equal(errorOutput);
            });

            it('should return error output if unknown roll type specified', () => {
                testee = new RollCommand('h2d10+6', mockLogger.object);
                expect(testee.execute()).to.deep.equal(errorOutput);
            });
        });

        describe('Normal rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', () => {
                testee = new RollCommand('r2d20', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', () => {
                testee = new RollCommand('r2d20+4', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', () => {
                testee = new RollCommand('r2d20+0', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });

            it('should return a number between 1 and 20 for a normal d20 roll', () => {
                testee = new RollCommand('r1d20', mockLogger.object);
                expect(parseInt(testee.execute()[1].value, 10)).to.be.greaterThan(0).and.lessThan(21);
            });

            it('should handle rolling a lot of dice', () => {
                testee = new RollCommand('r100d6', mockLogger.object);
                expect(testee.execute()[1].value.length).to.equal(298);
            });
        });

        describe('Advantage rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', () => {
                testee = new RollCommand('a2d20', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', () => {
                testee = new RollCommand('a2d20+4', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', () => {
                testee = new RollCommand('a2d20+0', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });

            it('should return two numbers between 1 and 20 for a normal d20 roll', () => {
                testee = new RollCommand('a1d20', mockLogger.object);
                expect(testee.execute()[1].value).to.contain(',');
            });

            it('should choose the higher of two numbers in a normal d20 advantage roll', () => {
                testee = new RollCommand('a1d20', mockLogger.object);
                const result = testee.execute();
                expect(Util.convertEmojiToNumber(result[0].value)).not.to.equal('');
            });

            it('should handle rolling a lot of dice', () => {
                testee = new RollCommand('a50d6', mockLogger.object);
                expect(testee.execute()[1].value.length).to.equal(298);
            });
        });

        describe('Disdvantage rolls', () => {
            it('should return successful bot output fields if input is valid with no operator or skill modifier', () => {
                testee = new RollCommand('d2d20', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });
    
            it('should return successful bot output fields if input is valid with operator and skill modifier', () => {
                testee = new RollCommand('d2d20+4', mockLogger.object);
                expect(testee.execute().length).to.equal(3);
            });
    
            it('should return successful bot output fields if input is valid with operator with a skill modifier of zero', () => {
                testee = new RollCommand('d2d20+0', mockLogger.object);
                expect(testee.execute().length >= 3);
            });

            it('should return two numbers between 1 and 20 for a normal d20 roll', () => {
                testee = new RollCommand('d1d20', mockLogger.object);
                expect(testee.execute()[1].value).to.contain(',');
            });

            it('should handle rolling a lot of dice', () => {
                testee = new RollCommand('d50d6', mockLogger.object);
                expect(testee.execute()[1].value.length).to.equal(298);
            });
        });
        
    });
});