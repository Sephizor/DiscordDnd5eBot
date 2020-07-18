import { MessageEmbedField } from "discord.js";

import ICommand from "./ICommand";
import IStorageClient from "../persistence/IStorageClient";
import StorageClientFactory from "../persistence/StorageClientFactory";
import { Character } from "../Character";

export default class CreateCharacterCommand implements ICommand {

    private _storageClient: IStorageClient;
    private _message: string;
    private _owner: string;
    private _serverId: string;

    constructor(message: string, owner: string, serverId: string) {
        this._message = message;
        this._owner = owner;
        this._serverId = serverId;
        this._storageClient = new StorageClientFactory().getInstance();
    }

    async execute(): Promise<MessageEmbedField[]> {
        const characterRegex = /^(newcharacter|nc) (.*)/g
        const characterMatches = characterRegex.exec(this._message);
        if(characterMatches) {
            const character = Character.fromJSON(characterMatches[2]);
            const isSaved = await this._storageClient.save(Character.serialise(character), `server-${this._serverId}/${this._owner}-${character.name}.json`);
            if(!isSaved) {
                throw new Error('An error occurred while saving the character data');
            }
            return <MessageEmbedField[]>[
                {
                    name: "Result",
                    value: `Character ${character.name} created successfully`
                }
            ];
        }

        throw new Error('Invalid syntax for new character');
    }

}
