import Logger from "../Logger";

export type DiceResult = {
    diceRolls : number[];
    diceResult: number;
};

export enum RollType {
    NORMAL = 'normal',
    ADVANTAGE = 'advantage',
    DISADVANTAGE = 'disadvantage',
    UNKNOWN = 'unknown'
}

export type Operator = '+'|'-'|null;

export interface IDiceRollService {
    rollDice(rollType: RollType, numDice: number, dieSize: number, operator: Operator, skillModifier: number): DiceResult;
}

export interface IRandomNumberGenerator {
    random(): number;
}

export class RandomNumberGenerator implements IRandomNumberGenerator {
    random() {
        return Math.random();
    }
}

export class DiceRoller implements IDiceRollService {
    private _randomNumberGenerator: IRandomNumberGenerator;

    constructor(randomNumberGenerator?: IRandomNumberGenerator) {
        if(randomNumberGenerator) {
            this._randomNumberGenerator = randomNumberGenerator;
        }
        else {
            this._randomNumberGenerator = new RandomNumberGenerator();
        }
    }

    public rollDice(_rollType: RollType, _numDice: number, _dieSize: number, _operator: Operator, _skillModifier: number): DiceResult {
        Logger.Instance?.verbose(`[${DiceRoller.name}]: ${this.rollDice.name}: RollType: ${_rollType}, NumDice: ${_numDice}, DieSize: ${_dieSize}, Operator: ${_operator}, SkillModifier: ${_skillModifier}`);
        const rollArray: number[] = [];

        if(_rollType !== RollType.NORMAL) {
            _numDice *= 2;
        }

        for(let i = 0; i < _numDice; i++) {
            const dieRoll = Math.floor((this._randomNumberGenerator.random() * _dieSize) + 1);
            rollArray.push(dieRoll);
        }

        let finalResult: number;

        switch(_rollType) {
            case RollType.ADVANTAGE:
                finalResult = rollArray.reduce((high, current) => {
                    return current > high ? current : high;
                });
                break;
            case RollType.DISADVANTAGE:
                finalResult = rollArray.reduce((low, current) => {
                    return current < low ? current : low;
                });
                break;
            default:
                finalResult = rollArray.reduce((total, current) => {
                    return total + current;
                });
                break;
        }

        if(_skillModifier > 0) {
            if(_operator === '+') {
                finalResult += _skillModifier;
            }
            else if(_operator === '-') {
                finalResult -= _skillModifier;
            }
        }

        const result: DiceResult = {
            diceResult: finalResult,
            diceRolls: rollArray
        };

        Logger.Instance?.verbose(`[${DiceRoller.name}]: ${this.rollDice.name}: Dice result: ${JSON.stringify(result)}`);

        return result;
    }
}