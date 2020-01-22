import path from 'path';

import IStorageClient from "./IStorageClient";
import AzureBlobClient from "./AzureBlobClient";
import FileStorageClient from "./FileStorageClient";
import Settings from '../Settings';

const settings: Settings = require('../settings.json');

export default class StorageClientFactory {

    getInstance(): IStorageClient {
        const storageType = settings.storageType;
        switch(storageType) {
            case 'blob':
                if(!settings.blobStorage) {
                    throw new Error('Character creation is not configured for this bot');
                }
                return new AzureBlobClient(settings.blobStorage.accountName,
                    settings.blobStorage.accountKey, settings.blobStorage.containerName);
            default:
                if(!settings.fileStorage) {
                    throw new Error('Character creation is not configured for this bot');
                }
                return new FileStorageClient(settings.fileStorage.rootDirectory);
        }
    }

}
