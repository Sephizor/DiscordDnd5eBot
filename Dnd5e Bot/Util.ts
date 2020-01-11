type EmojiTable = {
    [index: string]: string
}

export default class Util {

    static emojiTable: EmojiTable = {
        0: ':zero',
        1: ':one:',
        2: ':two:',
        3: ':three:',
        4: ':four:',
        5: ':five:',
        6: ':six:',
        7: ':seven:',
        8: ':eight:',
        9: ':nine:'
    };

    static convertNumberToEmoji(num: number) : string {
        let output = '';
        const numAsString = num.toString();
        for (let i = 0; i < numAsString.length; i++) {
            let idx = Object.keys(this.emojiTable).indexOf(numAsString[i]);
            output += this.emojiTable[idx];
        }
        return output;
    }

    static convertEmojiToNumber(input: string): number {
        let output = '';
        let regex = /(:.*:)+$/;
        let matches = regex.exec(input);
        if(matches !== null && matches.length > 0) {
            matches.shift();
            while(matches.length > 0) {
                try {
                    let currentEmoji = matches.shift()!;
                    let idx = Object.values(this.emojiTable).indexOf(currentEmoji);
                    output += Object.keys(this.emojiTable)[idx];
                }
                catch(e) {
                    break;
                }
            }
        }

        return parseInt(output, 10);
    }
}