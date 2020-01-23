import { Logger } from 'winston';
import { MessageEmbedField } from 'discord.js';

import Util from "../Util";
import ICommand from "./ICommand";

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
        const rollRegex = /^([rad]) ?(\d+) ?d ?(\d+) ?([+-])? ?(\d+)?/g;
        const rollMatches = rollRegex.exec(message);

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

    async execute(): Promise<MessageEmbedField[]> {
        if(!this.validate()) {
            return <MessageEmbedField[]>[
                {
                    name: 'Error',
                    value: 'You did that wrong'
                }
            ];
        }

        const rollArray: number[] = [];
        let fields: MessageEmbedField[] = [];

        if(this._rollType !== RollType.NORMAL) {
            this._numDice *= 2;
        }

        for(let i = 0; i < this._numDice; i++) {
            const dieRoll = Math.floor((Math.random() * this._dieSize) + 1);
            rollArray.push(dieRoll);
        }

        let finalResult: number;
        let maxRoll: number;

        switch(this._rollType) {
            case RollType.ADVANTAGE:
                maxRoll = Math.max(...rollArray);
                finalResult = rollArray.reduce((high, current) => {
                    return current > high ? current : high;
                });
                this.checkCriticals(maxRoll, fields);
                break;
            case RollType.DISADVANTAGE:
                maxRoll = Math.min(...rollArray);
                finalResult = rollArray.reduce((low, current) => {
                    return current < low ? current : low;
                });
                this.checkCriticals(maxRoll, fields);
                break;
            default:
                finalResult = rollArray.reduce((t, c) => {
                    return t + c;
                });
                if(this._numDice === 1 && this._dieSize === 20) {
                    maxRoll = Math.max(...rollArray);
                    this.checkCriticals(maxRoll, fields);
                }
                break;
        }

        if(this._skillModifier > 0) {
            if(this._operator === '+') {
                finalResult += this._skillModifier;
            }
            else if(this._operator === '-') {
                finalResult -= this._skillModifier;
            }
        }

        fields = fields.concat(<MessageEmbedField[]>[
            {
                name: 'Result',
                value: `${Util.convertNumberToEmoji(finalResult)}`
            },
            {
                name: 'Dice Roll(s)',
                value: `${rollArray.join(', ')}`
            },
            {
                name: 'Input',
                value: this.toString()
            }
        ]);

        return fields;
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

    private checkCriticals(maxRoll: number, fields: MessageEmbedField[]) {
        if(this._dieSize === 20) {
            if(maxRoll === 20) {
                this.addCriticalField(fields);
            }
            else if(maxRoll === 1) {
                this.addCriticalFailField(fields);
            }
        }
    }

    private addCriticalField(fields: MessageEmbedField[]) {
        return fields.push(<MessageEmbedField>{
            name: 'Critical!',
            value: `NAT ${Util.convertNumberToEmoji(20)}`
        });
    }

    private addCriticalFailField(fields: MessageEmbedField[]) {
        return fields.push(<MessageEmbedField>{
            name: 'Critical Fail!',
            value: `NAT ${Util.convertNumberToEmoji(1)}`
        });
    }
}
