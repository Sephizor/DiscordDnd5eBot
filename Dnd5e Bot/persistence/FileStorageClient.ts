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
        let directory = '';

        fileName = fileName.replace('/', path.sep);
        if(fileName.indexOf(path.sep) !== -1) {
            const splitFilename = fileName.split(path.sep)
            directory = splitFilename[0] + path.sep;
            fileName = splitFilename[1];
        }
        if(!this.validateFilename(fileName)) {
            return false
        }
        if(directory !== '' && !fs.existsSync(`${this._rootDirectory}${path.sep}${directory}`)) {
            fs.mkdirSync(`${this._rootDirectory}${path.sep}${directory}`);
        }
        fs.writeFileSync(`${this._rootDirectory}${path.sep}${directory}${fileName}`, json);
        return fs.existsSync(`${this._rootDirectory}${path.sep}${directory}${fileName}`);
    }

    async fetch(fileName: string): Promise<string> {
        let directory = '';

        fileName = fileName.replace('/', path.sep);
        if(fileName.indexOf(path.sep) !== -1) {
            const splitFilename = fileName.split(path.sep)
            directory = splitFilename[0] + path.sep;
            fileName = splitFilename[1];
        }
        if(!this.validateFilename(fileName)) {
            return '';
        }
        const file = `${this._rootDirectory}${path.sep}${directory}${fileName}`;
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
