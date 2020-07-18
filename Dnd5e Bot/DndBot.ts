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
import { ServerMap } from "./persistence/ServerMap";
import InitiativeCommand from "./commands/InitiativeCommand";

export default class DndBot {

    private _serverMaps: ServerMap[];
    private _storageClient: IStorageClient | undefined;
    private _logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this._serverMaps = [];
        this._logger = logger;
        try {
            this._storageClient = new StorageClientFactory().getInstance();
        }
        catch(e) {}
        
        setTimeout(async () => {
            try {
                if(this._storageClient !== undefined) {
                    const serverMapfiles = await this._storageClient.find('servermap');
                    for(const file of serverMapfiles) {
                        this._serverMaps.push(JSON.parse(await this._storageClient.fetch(file)));
                    }
                }
            }
            catch(e) {}
        }, 0);
        setInterval(async () => {
            try {
                if(this._storageClient !== undefined) {
                    for(var sm of this._serverMaps) {
                        await this._storageClient.save(JSON.stringify(sm), `servermap_${sm.serverId}.json`);
                    }
                }
            }
            catch(e) {}
        }, 0.5 * 60 * 1000);
    }

    getCharacterName(userId: string, serverId?: string): string | null {
        if(this._storageClient !== undefined && serverId !== undefined) {
            const activeChar = this._serverMaps.filter(x => x.serverId === serverId)[0]
                ?.characterMap.filter(x => x.userId === userId)[0]?.activeCharacter;
            if(activeChar) {
                let charName = activeChar.name;
                const firstLetter = charName[0].toUpperCase();
                charName = firstLetter + charName.substring(1, charName.length);
                return charName;
            }
        }

        return null;
    }

    getActiveCharacter(userId: string, serverId: string): ICharacter | null {
        if(this._storageClient !== undefined) {
            const activeChar = this._serverMaps.filter(x => x.serverId === serverId)[0]
                ?.characterMap.filter(x => x.userId === userId)[0]?.activeCharacter;
            if(activeChar) {
                return activeChar;
            }
        }

        return null;
    }

    async handleMessage(message: string, userId: string, serverId?: string) : Promise<MessageEmbedField[]> {
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
            if(serverId === undefined) {
                throw new Error('You must use this command in a channel on the server which your character belongs to.')
            }
            cmd = new CreateCharacterCommand(lowercaseMessage, userId, serverId);
        }

        // Select character
        else if(lowercaseMessage.match(/^selectcharacter|sc .*/)) {
            if(serverId === undefined) {
                throw new Error('You must use this command in a channel on the server which your character belongs to.')
            }
            cmd = new SelectCharacterCommand(lowercaseMessage, userId, serverId);
        }

        else if(lowercaseMessage.match(/^updatecharacter|uc .*/)) {
            if(serverId === undefined) {
                throw new Error('You must use this command in a channel on the server which your character belongs to.')
            }
            const char = this.getActiveCharacter(userId, serverId);
            if(char !== null) {
                if(this._storageClient !== undefined) {
                    cmd = new UpdateCharacterCommand(lowercaseMessage, char, userId, serverId);
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
            if(serverId === undefined) {
                throw new Error('You must use this command in a channel on the server which your character belongs to.')
            }
            const char = this.getActiveCharacter(userId, serverId);
            if(char !== null) {
                const diceRoll = StatRoll.getDiceRoll(lowercaseMessage, char);
                cmd = new RollCommand(diceRoll, this._logger);
            }
            else {
                throw new Error('You must have created and selected a character before rolling skill checks');
            }
        }

        else if(lowercaseMessage.match(/^init .*/)) {
            if(serverId === undefined) {
                throw new Error('You must use this command in a channel on the server which your character belongs to.')
            }
            cmd = new InitiativeCommand(message, userId, serverId, this.getActiveCharacter(userId, serverId));
        }

        // Help command
        else if(lowercaseMessage.match(/^help$/)) {
            cmd = new HelpCommand();
        }

        const result = await cmd.execute();

        this._logger.verbose(`Command result: ${JSON.stringify(result)}`);

        if(serverId !== undefined) {
            if(cmd instanceof SelectCharacterCommand) {
                const char = (<SelectCharacterCommand>cmd).getCharacter();
                if(char !== null) {
                    let serverMap = this._serverMaps.filter(x => x.serverId === serverId)[0];
                    if(!serverMap) {
                        serverMap = {
                            serverId: serverId,
                            characterMap: []
                        };
                        this._serverMaps.push(serverMap);
                    }
                    const existingChar = serverMap.characterMap.filter(x => x.userId === userId)[0];
                    if(existingChar) {
                        existingChar.activeCharacter = char;
                    }
                    else {
                        serverMap.characterMap.push({
                            userId: userId,
                            activeCharacter: char
                        });
                    }
                }
            }
        }

        return result;
    }

}
