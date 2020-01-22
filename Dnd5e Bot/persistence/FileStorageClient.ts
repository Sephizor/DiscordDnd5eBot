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

    private validateFilename(fileName: string): boolean {
        const matches = fileName.match(/^[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/);
        return matches !== null && matches.length > 0;
    }

    async save(json: string, fileName: string): Promise<boolean> {
        if(!this.validateFilename(fileName)) {
            throw new Error('Invalid character name');
        }
        fs.writeFileSync(`${this._rootDirectory}${path.sep}${fileName}`, json);
        return fs.existsSync(`${this._rootDirectory}${path.sep}${fileName}`);
    }
    async fetch(fileName: string): Promise<string> {
        if(!this.validateFilename(fileName)) {
            throw new Error('Invalid character name');
        }
        return fs.readFileSync(`${this._rootDirectory}${path.sep}${fileName}`, 'utf8');
    }

}
