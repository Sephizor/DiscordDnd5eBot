import { MessageEmbedField } from "discord.js";

import ICommand from "./ICommand";
import { IStorageClient } from "../persistence/IStorageClient";
import StorageClientFactory from "../persistence/StorageClientFactory";

export default class CreateCharacterCommand implements ICommand {

    private _storageClient: IStorageClient;

    constructor() {
        this._storageClient = new StorageClientFactory().getInstance();
    }

    execute(): MessageEmbedField[] {
        throw new Error('Not implemented');
    }
}
