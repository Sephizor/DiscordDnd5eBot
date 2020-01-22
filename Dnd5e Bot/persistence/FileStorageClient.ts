import IStorageClient from "./IStorageClient";
import fs from 'fs';
import path from 'path';

export default class FileStorageClient implements IStorageClient {

    _rootDirectory: string;

    constructor(rootDirectory: string) {
        this._rootDirectory = rootDirectory;
        try {
            if(!fs.existsSync(rootDirectory)) {
                fs.mkdirSync(rootDirectory);
            }
        }
        catch(e) {
            throw new Error('There was a failure while creating the character due to a bot configuration issue. Please contact the bot owner');
        }

    }

    save(json: string, fileName: string): boolean {
        fs.writeFileSync(`${this._rootDirectory}${path.sep}${fileName}`, json);
        return fs.existsSync(`${this._rootDirectory}${path.sep}${fileName}`);
    }
    fetch(fileName: string): string {
        return fs.readFileSync(`${this._rootDirectory}${path.sep}${fileName}`, 'utf8');
    }

}
