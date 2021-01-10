import { EmbedField } from 'discord.js';

import Util from "../Util";
import ICommand from "./ICommand";
import { IDiceRollService, Operator, RollType, DiceResult } from './DiceRoller';
import Logger from '../Logger';

export default class RollCommand implements ICommand {

    private _message: string;
    private _diceResult?: DiceResult;
    private _rollType: RollType = RollType.NORMAL;
    private _numDice: number = 0;
    private _dieSize: number = 0;
    private _operator: Operator = null;
    private _skillModifier: number = 0;
    private _isValid: boolean = false;

    private _validDice: number[] = [2, 4, 6, 8, 10, 12, 20, 100];

    constructor(message: string, diceRoller: IDiceRollService) {
        Logger.Instance?.verbose(`[${RollCommand.name}]: constructor: Initialise`);

        const rollRegex = /^([rad]) ?(\d+) ?d ?(\d+) ?([+-])? ?(\d+)?/g;
        const rollMatches = rollRegex.exec(message);
        this._message = message;

        if(rollMatches) {
            // Ignore the full string
            rollMatches.shift();

            Logger.Instance?.verbose(`[${RollCommand.name}]: constructor: Values of regex match: ${rollMatches.toString()}`);

            this._rollType = rollMatches[0] ? this.getRollType(rollMatches[0]) : RollType.NORMAL;
            this._numDice = rollMatches[1] ? parseInt(rollMatches[1], 10) : 0;
            this._dieSize = rollMatches[2] ? parseInt(rollMatches[2], 10): 0;
            this._operator = rollMatches[3] ? <Operator>rollMatches[3] : null;
            this._skillModifier = rollMatches[4] ? parseInt(rollMatches[4], 10) : 0;

            this._isValid = this.validate();
            if(this._isValid) {
                this._diceResult = diceRoller.rollDice(this._rollType, this._numDice, this._dieSize, this._operator, this._skillModifier);
            }
        }
    }

    async execute(): Promise<EmbedField[]> {
        if(!this._isValid) {
            Logger.Instance?.debug(`[${RollCommand.name}]: ${this.execute.name}: Invalid input: ${this._message}`);
            return <EmbedField[]>[
                {
                    name: 'Error',
                    value: 'You did that wrong'
                }
            ];
        }

        if(this._diceResult !== undefined) {
            const critFields = this.checkCriticals(this._diceResult.diceRolls);
            
            return critFields.concat(<EmbedField[]>[
                {
                    name: 'Result',
                    value: `${Util.convertNumberToEmoji(this._diceResult.diceResult)}`
                },
                {
                    name: 'Dice Roll(s)',
                    value: `${this._diceResult.diceRolls.join(', ')}`
                },
                {
                    name: 'Input',
                    value: this.toString()
                }
            ]);
        }

        return <EmbedField[]>[
            {
                name: 'Error',
                value: 'An error occurred while rolling the dice'
            }
        ];
    }

    private validate(): boolean {
        let isValid = this._numDice > 0 &&
            this._dieSize > 0 &&
            this._validDice.indexOf(this._dieSize) !== -1 &&
            this._rollType !== RollType.UNKNOWN;

        if(this._skillModifier > 0) {
            return isValid && this._operator !== null;
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
        if(this._operator !== null && this._skillModifier > 0) {
            str += `${this._operator}${this._skillModifier}`;
        }
        if(this._rollType !== RollType.NORMAL) {
            str += ` with ${this._rollType.toString().toLowerCase()}`;
        }

        return str;
    }

    private checkCriticals(diceRolls: number[]): EmbedField[] {
        if(this._dieSize === 20) {
            let result = -1;

            if(this._rollType === RollType.ADVANTAGE) {
                result = Math.max(...diceRolls);
            }
            else if(this._rollType === RollType.DISADVANTAGE) {
                result = Math.min(...diceRolls);
            }
            else if(this._numDice === 1) {
                result = diceRolls[0];
            }

            if(result === 20) {
                return [<EmbedField>{
                    name: 'Critical!',
                    value: `NAT ${Util.convertNumberToEmoji(20)}`
                }];
            }
            else if(result === 1) {
                return [<EmbedField>{
                    name: 'Critical Fail!',
                    value: `NAT ${Util.convertNumberToEmoji(1)}`
                }];
            }
        }
        return [];
    }
}
