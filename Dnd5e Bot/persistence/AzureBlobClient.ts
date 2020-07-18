import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

import IStorageClient from "./IStorageClient";

export default class AzureBlobClient implements IStorageClient {

    private _containerName: string;
    private _client: BlobServiceClient;

    constructor(accountName: string, accountKey: string, containerName: string) {
        this._containerName = containerName;
        this._client = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`,
            new StorageSharedKeyCredential(accountName, accountKey));
    }

    private validateFilename(fileName: string): boolean {
        const matches = fileName.match(/^[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_\/ ]+$/);
        return matches !== null && matches.length > 0;
    }

    async save(json: string, fileName: string): Promise<boolean> {
        if(!this.validateFilename(fileName)) {
            throw new Error('Invalid character name');
        }
        try {
            const containerClient = this._client.getContainerClient(this._containerName);
            const containerExists = await containerClient.exists();
            if(!containerExists) {
                await containerClient.create();
            }
            const blobClient = containerClient.getBlockBlobClient(fileName);
            await blobClient.upload(json, json.length);
            return await blobClient.exists();
        }
        catch(e) {
            return false;
        }
    }

    async fetch(fileName: string): Promise<string> {
        if(!this.validateFilename(fileName)) {
            throw new Error('Invalid character name');
        }
        
        try {
            const containerClient = this._client.getContainerClient(this._containerName);
            const blobClient = await containerClient.getBlockBlobClient(fileName.toLowerCase());
            if((await blobClient.exists())) {
                return (await blobClient.downloadToBuffer()).toString();
            }
            return '';
        }
        catch(e) {
            throw new Error('An error occurred while retrieving data from storage');
        }
    }

    async find(filepathPart: string): Promise<string[]> {
        const fileList = [];
        try {
            const containerClient = this._client.getContainerClient(this._containerName);
            
            for await (const item of containerClient.listBlobsFlat()) {
                if(item.name.indexOf(filepathPart) !== -1) {
                    fileList.push(item.name);
                }
            }
        }
        catch(e) {
            throw new Error('An error occurred while listing blobs');
        }
        return fileList;
    }

}
