import winston = require("winston");
import { MessageEmbedField } from "discord.js";

import RollCommand from "./commands/RollCommand";
import ICommand from "./commands/ICommand";
import HelpCommand from "./commands/HelpCommand";
import UnknownCommand from "./commands/UnknownCommand";

export default class DndBot {

    handleMessage(message: string, logger: winston.Logger) : MessageEmbedField[] {
        const lowercaseMessage = message.toLowerCase();
        let cmd: ICommand = new UnknownCommand(lowercaseMessage);

        // Roll commands
        if(lowercaseMessage.match(/^$/)) {
            cmd = new RollCommand(`r1d20`, logger);
        }
        
        else if(lowercaseMessage.match(/^[rad].*/)) {
            cmd = new RollCommand(lowercaseMessage, logger);
        }

        // Skill checks
        else if(lowercaseMessage.match(/^[A-Z]{1}[a-z]{2}[A-Z]{1}$/)) {

        }

        // Help command
        else if(lowercaseMessage.match(/^help$/)) {
            cmd = new HelpCommand();
        }

        return cmd.execute();
    }

}
