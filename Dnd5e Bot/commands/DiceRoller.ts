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

export default class DiceRoller {
    public static rollDice(_rollType: RollType, _numDice: number, _dieSize: number, _operator: string, _skillModifier: number): DiceResult {
        const rollArray: number[] = [];

        if(_rollType !== RollType.NORMAL) {
            _numDice *= 2;
        }

        for(let i = 0; i < _numDice; i++) {
            const dieRoll = Math.floor((Math.random() * _dieSize) + 1);
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

        return result;
    }
}