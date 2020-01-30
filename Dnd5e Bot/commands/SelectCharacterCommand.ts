import { MessageEmbedField } from 'discord.js';

import ICommand from "./ICommand";
import IStorageClient from "../persistence/IStorageClient";
import StorageClientFactory from "../persistence/StorageClientFactory";
import Character, { ICharacter } from '../Character';

export default class SelectCharacterCommand implements ICommand {

    private _storageClient: IStorageClient;
    private _message: string;
    private _userId: string;
    private _character: ICharacter | null = null;

    constructor(message: string, userId: string) {
        this._message = message;
        this._userId = userId;
        this._storageClient = new StorageClientFactory().getInstance();
    }

    getCharacter(): ICharacter | null {
        return this._character;
    }

    async execute(): Promise<MessageEmbedField[]> {
        const selectCharRegex = /^selectcharacter|sc ([a-zA-Z]+)$/;
        const charName = selectCharRegex.exec(this._message);
        if(charName) {
            const characterName = charName[1];
            const characterData = await this._storageClient.fetch(`${this._userId}-${characterName}.json`);
            if(characterData !== '') {
                this._character = Character.fromJSON(characterData);
            }
            else {
                throw new Error(`Could not find a character that belongs to you called "${characterName}"`);
            }
        }
        else {
            throw new Error('Invalid syntax for selecting a character');
        }

        return <MessageEmbedField[]> [
            {
                name: 'Result',
                value: `Selected character ${this._character?.name}`
            }
        ];
    }

}