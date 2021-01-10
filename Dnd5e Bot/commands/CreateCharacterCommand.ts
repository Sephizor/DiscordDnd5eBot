import { EmbedField } from "discord.js";

import ICommand from "./ICommand";
import IStorageClient from "../persistence/IStorageClient";
import StorageClientFactory from "../persistence/StorageClientFactory";
import { Character } from "../Character";
import Logger from "../Logger";

export default class CreateCharacterCommand implements ICommand {

    private _storageClient: IStorageClient;
    private _message: string;
    private _owner: string;
    private _serverId: string;

    constructor(message: string, owner: string, serverId: string) {
        Logger.Instance?.verbose(`[${CreateCharacterCommand.name}][Server: ${serverId}]: Initialise`);
        this._message = message;
        this._owner = owner;
        this._serverId = serverId;
        this._storageClient = new StorageClientFactory().getInstance();
    }

    async execute(): Promise<EmbedField[]> {
        const characterRegex = /^(newcharacter|nc) (.*)/g
        const characterMatches = characterRegex.exec(this._message);
        if(characterMatches) {
            const character = Character.fromJSON(characterMatches[2]);
            const isSaved = await this._storageClient.save(Character.serialise(character), `server-${this._serverId}/${this._owner}-${character.name}.json`);
            if(!isSaved) {
                const err = 'An error occurred while saving the character data';
                Logger.Instance?.error(`[${CreateCharacterCommand.name}][Server: ${this._serverId}]: ${err}`);
                Logger.Instance?.debug(`[${CreateCharacterCommand.name}][Server: ${this._serverId}]: Input: ${this._message}`);
                throw new Error(err);
            }
            return <EmbedField[]>[
                {
                    name: "Result",
                    value: `Character ${character.name} created successfully`
                }
            ];
        }
        const err = 'Invalid syntax for new character';
        Logger.Instance?.error(`[${CreateCharacterCommand.name}][Server: ${this._serverId}]: ${err}`);
        Logger.Instance?.debug(`[${CreateCharacterCommand.name}][Server: ${this._serverId}]: Data: ${this._message}`);
        throw new Error(err);
    }

}
