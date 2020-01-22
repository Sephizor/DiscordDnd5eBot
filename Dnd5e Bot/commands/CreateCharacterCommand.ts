import { MessageEmbedField } from "discord.js";

import ICommand from "./ICommand";
import IStorageClient from "../persistence/IStorageClient";
import StorageClientFactory from "../persistence/StorageClientFactory";
import Character from "../Character";

export default class CreateCharacterCommand implements ICommand {

    private _storageClient: IStorageClient;
    private _message: string;

    constructor(message: string) {
        this._message = message;
        this._storageClient = new StorageClientFactory().getInstance();
    }

    async execute(): Promise<MessageEmbedField[]> {
        const characterRegex = /^newcharacter (.*)/g
        const characterMatches = characterRegex.exec(this._message);
        if(characterMatches) {
            const character = Character.fromJSON(characterMatches[1]);
            const isSaved = await this._storageClient.save(Character.serialise(character), character.name);
            if(!isSaved) {
                throw new Error('An error occurred while saving the character data');
            }
            return <MessageEmbedField[]>[
                {
                    name: "Result",
                    value: `Character ${character.name}} created successfully`
                }
            ];
        }

        throw new Error('Invalid syntax for new character');
    }

}
