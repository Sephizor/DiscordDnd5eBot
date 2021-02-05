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
        const matches = fileName.match(/^[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_\\ ]+$/);
        return matches !== null && matches.length > 0;
    }

    async save(json: string, fileName: string): Promise<boolean> {
        fileName = fileName.replace('/', path.sep);
        if(!this.validateFilename(fileName)) {
            throw new Error(`Invalid file name: ${fileName}`);
        }
        fs.writeFileSync(`${this._rootDirectory}${path.sep}${fileName}`, json);
        return fs.existsSync(`${this._rootDirectory}${path.sep}${fileName}`);
    }

    async fetch(fileName: string): Promise<string> {
        fileName = fileName.replace('/', path.sep);
        if(!this.validateFilename(fileName)) {
            throw new Error(`Invalid file name: ${fileName}`);
        }
        const file = `${this._rootDirectory}${path.sep}${fileName}`;
        if(!fs.existsSync(file)) {
            return '';
        }
        return fs.readFileSync(file, 'utf8');
    }

    async find(filepathPart: string): Promise<string[]> {
        const dirFiles = fs.readdirSync(`${this._rootDirectory}${path.sep}`);
        const fileList = [];
        for(const item of dirFiles) {
            if(item.indexOf(filepathPart) !== -1) {
                fileList.push(item);
            }
        }
        return fileList;
    }

}
