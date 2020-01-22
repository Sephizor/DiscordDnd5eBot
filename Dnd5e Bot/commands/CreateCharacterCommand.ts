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

    execute(): MessageEmbedField[] {
        const characterRegex = /^newcharacter (.*)/g
        const characterMatches = characterRegex.exec(this._message);
        if(characterMatches) {
            const character = Character.fromJSON(characterMatches[1]);
            this._storageClient.save(Character.serialise(character), character.name);
        }

        return <MessageEmbedField[]>[
            {
                name: "Result",
                value: "Success"
            }
        ];
    }

}
