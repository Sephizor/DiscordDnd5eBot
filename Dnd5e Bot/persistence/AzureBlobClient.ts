import { IStorageClient } from "./IStorageClient";

export default class AzureBlobClient implements IStorageClient {

    constructor(connectionString: string, containerName: string) {

    }

    save(json: string, fileName: string): boolean {
        throw new Error("Method not implemented.");
    }

    fetch(fileName: string): string {
        throw new Error("Method not implemented.");
    }

}
