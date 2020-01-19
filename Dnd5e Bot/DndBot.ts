import winston = require("winston");
import { MessageEmbedField } from "discord.js";

import RollCommand from "./commands/RollCommand";
import ICommand from "./commands/ICommand";
import HelpCommand from "./commands/HelpCommand";

export default class DndBot {

    handleMessage(message: string, logger: winston.Logger) : MessageEmbedField[] {
        let cmd: ICommand | null = null;
        let lowercaseMessage = message.toLowerCase();

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

        if(cmd) {
            return cmd.execute();
        }

        return <MessageEmbedField[]>[
            {
                name: 'Error',
                value: `There was no command registered to handle the input: "${message}"`
            }
        ];
    }

}
