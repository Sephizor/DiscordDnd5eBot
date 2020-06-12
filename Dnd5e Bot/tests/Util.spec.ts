import { expect } from 'chai';
import 'mocha';
import Util from '../Util';

describe('Util', () => {
    describe('convertNumberToEmoji', () => {
        it('should convert 0 to :zero:', () => {
            expect(Util.convertNumberToEmoji(0)).to.equal(':zero:');
        });

        it('should convert 1 to :one:', () => {
            expect(Util.convertNumberToEmoji(1)).to.equal(':one:');
        });

        it('should convert 2 to :two:', () => {
            expect(Util.convertNumberToEmoji(2)).to.equal(':two:');
        });

        it('should convert 3 to :three:', () => {
            expect(Util.convertNumberToEmoji(3)).to.equal(':three:');
        });

        it('should convert 4 to :four:', () => {
            expect(Util.convertNumberToEmoji(4)).to.equal(':four:');
        });

        it('should convert 5 to :five:', () => {
            expect(Util.convertNumberToEmoji(5)).to.equal(':five:');
        });

        it('should convert 6 to :six:', () => {
            expect(Util.convertNumberToEmoji(6)).to.equal(':six:');
        });

        it('should convert 7 to :seven:', () => {
            expect(Util.convertNumberToEmoji(7)).to.equal(':seven:');
        });

        it('should convert 8 to :eight:', () => {
            expect(Util.convertNumberToEmoji(8)).to.equal(':eight:');
        });

        it('should convert 9 to :nine:', () => {
            expect(Util.convertNumberToEmoji(9)).to.equal(':nine:');
        });

        it('should convert - to -', () => {
            expect(Util.convertNumberToEmoji(-9)).to.equal('-:nine:');
        });

        it('should convert multiple digits', () => {
            expect(Util.convertNumberToEmoji(1234)).to.equal(':one::two::three::four:');
        });
    });

    describe('convertEmojiToNumber', () => {
        it('should convert :zero: to 0', () => {
            expect(Util.convertEmojiToNumber(':zero:')).to.equal(0);
        });

        it('should convert :one: to 1', () => {
            expect(Util.convertEmojiToNumber(':one:')).to.equal(1);
        });

        it('should convert :two: to 2', () => {
            expect(Util.convertEmojiToNumber(':two:')).to.equal(2);
        });

        it('should convert :three: to 3', () => {
            expect(Util.convertEmojiToNumber(':three:')).to.equal(3);
        });

        it('should convert :four: to 4', () => {
            expect(Util.convertEmojiToNumber(':four:')).to.equal(4);
        });

        it('should convert :five: to 5', () => {
            expect(Util.convertEmojiToNumber(':five:')).to.equal(5);
        });

        it('should convert :six: to 6', () => {
            expect(Util.convertEmojiToNumber(':six:')).to.equal(6);
        });

        it('should convert :seven: to 7', () => {
            expect(Util.convertEmojiToNumber(':seven:')).to.equal(7);
        });

        it('should convert :eight: to 8', () => {
            expect(Util.convertEmojiToNumber(':eight:')).to.equal(8);
        });

        it('should convert :nine: to 9', () => {
            expect(Util.convertEmojiToNumber(':nine:')).to.equal(9);
        });

        it('should convert multiple emoji', () => {
            expect(Util.convertEmojiToNumber(':one::two::three::four:')).to.equal(1234);
        });
    });
});
