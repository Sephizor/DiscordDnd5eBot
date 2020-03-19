import winston = require("winston");
import { MessageEmbedField } from "discord.js";

import RollCommand from "./commands/RollCommand";
import ICommand from "./commands/ICommand";
import HelpCommand from "./commands/HelpCommand";
import UnknownCommand from "./commands/UnknownCommand";
import CreateCharacterCommand from "./commands/CreateCharacterCommand";
import SelectCharacterCommand from "./commands/SelectCharacterCommand";
import { ICharacter } from "./Character";
import StatRoll from "./commands/StatRoll";
import StorageClientFactory from "./persistence/StorageClientFactory";
import IStorageClient from "./persistence/IStorageClient";
import UpdateCharacterCommand from "./commands/UpdateCharacterCommand";

interface CharacterMapping {
    userId: string;
    activeCharacter: ICharacter;
}

export default class DndBot {

    private _characterMap: CharacterMapping[];
    private _storageClient: IStorageClient | undefined;
    private _logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this._characterMap = [];
        this._logger = logger;
        try {
            this._storageClient = new StorageClientFactory().getInstance();
        }
        catch(e) {}
        
        setTimeout(async () => {
            try {
                this._characterMap = JSON.parse(await this._storageClient!.fetch('charactermap.json'));
            }
            catch(e) {}
        }, 0);
        setInterval(async () => {
            try {
                await this._storageClient!.save(JSON.stringify(this._characterMap), 'charactermap.json');
            }
            catch(e) {}
        }, 3 * 60 * 1000);
    }

    getActiveCharacters(): CharacterMapping[] {
        return this._characterMap;
    }

    getCharacterName(userId: string): string | null {
        if(this._storageClient !== null) {
            const charIdx = this._characterMap.map(x => x.userId).indexOf(userId);
            if(charIdx !== -1) {
                let charName = this._characterMap[charIdx].activeCharacter.name;
                const firstLetter = charName[0].toUpperCase();
                charName = firstLetter + charName.substring(1, charName.length);
                return charName;
            }
        }

        return null;
    }

    async handleMessage(message: string, userId: string) : Promise<MessageEmbedField[]> {
        this._logger.verbose(`Handling input ${message}`);

        const lowercaseMessage = message.toLowerCase();
        let cmd: ICommand = new UnknownCommand(lowercaseMessage);

        // Roll commands
        if(lowercaseMessage.match(/^$/)) {
            cmd = new RollCommand(`r1d20`, this._logger);
        }
        
        else if(lowercaseMessage.match(/^[rad]\d.*/)) {
            cmd = new RollCommand(lowercaseMessage, this._logger);
        }

        // Create new character
        else if(lowercaseMessage.match(/^newcharacter|nc .*/)) {
            cmd = new CreateCharacterCommand(lowercaseMessage, userId);
        }

        // Select character
        else if(lowercaseMessage.match(/^selectcharacter|sc .*/)) {
            cmd = new SelectCharacterCommand(lowercaseMessage, userId);
        }

        else if(lowercaseMessage.match(/^updatecharacter|uc .*/)) {
            const index = this._characterMap.map(x => x.userId).indexOf(userId);
            if(index !== -1) {
                if(this._storageClient !== undefined) {
                    cmd = new UpdateCharacterCommand(lowercaseMessage, this._characterMap[index].activeCharacter, userId);
                }
                else {
                    throw new Error('This command is disabled');
                }
            }
            else {
                throw new Error('You must create and/or select a character first');
            }
        }

        else if(lowercaseMessage.match(/^[a-z]{3,4}[cs][ad]?$/)) {
            const index = this._characterMap.map(x => x.userId).indexOf(userId);
            if(index !== -1) {
                const char = this._characterMap[index].activeCharacter;
                const diceRoll = StatRoll.getDiceRoll(lowercaseMessage, char);
                cmd = new RollCommand(diceRoll, this._logger);
            }
            else {
                throw new Error('You must have created and selected a character before rolling skill checks');
            }
        }

        else if(lowercaseMessage === 'ini') {
            const index = this._characterMap.map(x => x.userId).indexOf(userId);
            if(index !== -1) {
                const char = this._characterMap[index].activeCharacter;
                const diceRoll = `r1d20+${char.initiative}`;
                cmd = new RollCommand(diceRoll, this._logger);
            }
            else {
                throw new Error('You must have created and selected a character before rolling initiative checks');
            }
        }

        // Help command
        else if(lowercaseMessage.match(/^help$/)) {
            cmd = new HelpCommand();
        }

        const result = await cmd.execute();

        this._logger.verbose(`Command result: ${JSON.stringify(result)}`);

        if(cmd instanceof SelectCharacterCommand) {
            const char = (<SelectCharacterCommand>cmd).getCharacter();
            if(char !== null) {
                const existingChar = this._characterMap.filter(x => x.userId === userId).length === 1;
                if(existingChar) {
                    const index = this._characterMap.map(x => x.userId).indexOf(userId);
                    this._characterMap[index].activeCharacter = char;
                }
                else {
                    this._characterMap.push({
                        userId: userId,
                        activeCharacter: char
                    });
                }
            }
        }

        return result;
    }

}
