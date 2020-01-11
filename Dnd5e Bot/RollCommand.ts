import { Logger } from 'winston';
import { MessageEmbedField } from 'discord.js';

import Util from "./Util";
import ICommand from "./Command";

interface DiceRoll {
    roll: number,
    result: number
}

enum RollType {
    NORMAL = 'normal',
    ADVANTAGE = 'advantage',
    DISADVANTAGE = 'disadvantage',
    UNKNOWN = 'unknown'
}

export default class RollCommand implements ICommand {

    private _rollType: RollType = RollType.NORMAL;
    private _numDice: number = 0;
    private _dieSize: number = 0;
    private _operator: string = '';
    private _skillModifier: number = 0;

    private _validDice: number[] = [2, 4, 6, 8, 10, 12, 20, 100];

    constructor(message: string, logger: Logger) {
        const rollRegex = /!([rad]) ?(\d+) ?d ?(\d+) ?([+-])? ?(\d+)?/g;
        const rollMatches = rollRegex.exec(message.toLowerCase());

        logger.verbose(`Entered constructor of ${RollCommand.name}`);
        if(rollMatches) {
            // Ignore the full string
            rollMatches.shift();

            logger.verbose(`Values of regex match: ${rollMatches.toString()}`);

            this._rollType = rollMatches[0] ? this.getRollType(rollMatches[0]) : this._rollType;
            this._numDice = rollMatches[1] ? parseInt(rollMatches[1], 10) : this._numDice;
            this._dieSize = rollMatches[2] ? parseInt(rollMatches[2], 10): this._dieSize;
            this._operator = rollMatches[3] ? rollMatches[3] : this._operator;
            this._skillModifier = rollMatches[4] ? parseInt(rollMatches[4], 10) : this._skillModifier;

            logger.verbose(`Class values: ${this._rollType}, ${this._numDice}, ${this._dieSize}, ${this._operator}, ${this._skillModifier}`);
        }
    }

    private validate(): boolean {
        let isValid = this._numDice > 0 &&
            this._dieSize > 0 &&
            this._validDice.indexOf(this._dieSize) !== -1 &&
            this._rollType !== RollType.UNKNOWN;

        if(this._skillModifier > 0) {
            return isValid && this._operator !== '';
        }

        return isValid;
    }

    private getRollType(type: string): RollType {
        switch(type) {
            case 'r':
                return RollType.NORMAL;
            case 'a':
                return RollType.ADVANTAGE;
            case 'd':
                return RollType.DISADVANTAGE;
            default:
                return RollType.UNKNOWN;
        }
    }

    private toString(): string {
        let str = `${this._numDice}d${this._dieSize}`;
        if(this._operator !== '' && this._skillModifier > 0) {
            str += `${this._operator}${this._skillModifier}`;
            if(this._rollType !== RollType.NORMAL) {
                str += ` with ${this._rollType.toString().toLowerCase()}`;
            }
        }

        return str;
    }

    public execute(): MessageEmbedField[] {
        if(!this.validate()) {
            return <MessageEmbedField[]>[
                {
                    name: 'Error',
                    value: 'You did that wrong'
                }
            ];
        }

        const rollArray: DiceRoll[] = [];

        if(this._rollType !== RollType.NORMAL) {
            this._numDice *= 2;
        }

        for(let i = 0; i < this._numDice; i++) {
            const dieRoll = Math.floor((Math.random() * this._dieSize) + 1);
            let result = dieRoll;
            if(this._skillModifier > 0) {
                if(this._operator === '+') {
                    result += this._skillModifier;
                }
                else if(this._operator === '-') {
                    result -= this._skillModifier;
                }
            }
            rollArray.push({
                roll: dieRoll,
                result: result
            });
        }

        let finalRoll: number;
        let diceRolls = rollArray.map(x => x.roll);
        switch(this._rollType) {
            case RollType.ADVANTAGE:
                finalRoll = rollArray.map(x => x.result).reduce((high, current) => {
                    return current > high ? current : high;
                });
                break;
            case RollType.DISADVANTAGE:
                finalRoll = rollArray.map(x => x.result).reduce((low, current) => {
                    return current < low ? current : low;
                });
                break;
            default:
                finalRoll = rollArray.map(x => x.result).reduce((t, c) => {
                    return t + c;
                });
                break;
        }

        return <MessageEmbedField[]>[
            {
                name: 'Result',
                value: `${Util.convertNumberToEmoji(finalRoll)}`
            },
            {
                name: 'Dice Roll(s)',
                value: `${diceRolls.join(', ')}`
            },
            {
                name: 'Input',
                value: this.toString()
            }
        ];
    }
}
