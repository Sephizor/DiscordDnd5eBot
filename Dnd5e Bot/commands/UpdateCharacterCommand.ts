import {MessageEmbedField} from 'discord.js';

import ICommand from "./ICommand";
import Character from '../Character';
import CreateCharacterCommand from './CreateCharacterCommand';

export default class UpdateCharacterCommand implements ICommand {

    private _character: Character;
    private _message: string;
    private _userId: string;

    constructor(message: string, character: Character, userId: string) {
        this._character = character;
        this._message = message;
        this._userId = userId;
    }

    async execute(): Promise<MessageEmbedField[]> {
        const regex = /^(updatecharacter|uc) (.*)$/g;
        const json = regex.exec(this._message);
        if(json) {
            let newStats: Object;
            try {
                newStats = JSON.parse(json[2]);
            }
            catch(e) {
                throw new Error('Invalid JSON specified for update character');
            }

            let allValid = true;
            for(const key in newStats) {
                if(Character.ValidStats.indexOf(key) === -1) {
                    allValid = false;
                }
            }

            if(allValid) {
                Object.assign(this._character, newStats);
                await new CreateCharacterCommand(`newcharacter ${JSON.stringify(this._character)}`, this._userId).execute();
            }
            else {
                throw new Error('Invalid stat specified in JSON');
            }

            return <MessageEmbedField[]> [
                {
                    name: "Result",
                    value: "Character updated successfully"
                }
            ];
        }
        
        throw new Error('Invalid syntax for update character');
    }

}