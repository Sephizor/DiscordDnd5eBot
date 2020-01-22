import winston = require("winston");
import { MessageEmbedField } from "discord.js";

import RollCommand from "./commands/RollCommand";
import ICommand from "./commands/ICommand";
import HelpCommand from "./commands/HelpCommand";
import UnknownCommand from "./commands/UnknownCommand";
import CreateCharacterCommand from "./commands/CreateCharacterCommand";
import SelectCharacterCommand from "./commands/SelectCharacterCommand";
import { ICharacter } from "./Character";

interface CharacterMapping {
    userId: string;
    activeCharacter: ICharacter;
}

export default class DndBot {

    private _characterMap: CharacterMapping[];

    constructor() {
        this._characterMap = [];
    }

    async handleMessage(message: string, userId: string, logger: winston.Logger) : Promise<MessageEmbedField[]> {
        const lowercaseMessage = message.toLowerCase();
        let cmd: ICommand = new UnknownCommand(lowercaseMessage);

        // Roll commands
        if(lowercaseMessage.match(/^$/)) {
            cmd = new RollCommand(`r1d20`, logger);
        }
        
        else if(lowercaseMessage.match(/^[rad].*/)) {
            cmd = new RollCommand(lowercaseMessage, logger);
        }

        // Create new character
        else if(lowercaseMessage.match(/^newcharacter .*/)) {
            cmd = new CreateCharacterCommand(lowercaseMessage, userId);
        }

        // Select character
        else if(lowercaseMessage.match(/^selectcharacter .*/)) {
            cmd = new SelectCharacterCommand(message, userId);
        }

        // Help command
        else if(lowercaseMessage.match(/^help$/)) {
            cmd = new HelpCommand();
        }

        const result = await cmd.execute();
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
