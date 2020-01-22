import IStorageClient from "./IStorageClient";

export default class FileStorageClient implements IStorageClient {

    constructor(rootDirectory: string) {

    }

    save(json: string, fileName: string): boolean {
        throw new Error("Method not implemented.");
    }
    fetch(fileName: string): string {
        throw new Error("Method not implemented.");
    }

}
