import RollCommand from "./RollCommand";
import ICommand from "./Command";
import winston = require("winston");
import { MessageEmbedField } from "discord.js";

export default class DndBot {

    handleMessage(message: string, logger: winston.Logger) : MessageEmbedField[] {
        let cmd: ICommand | null = null;
        // Roll commands
        if(message.match(/![rad].*/)) {
            cmd = new RollCommand(message, logger);
        }

        // Skill checks
        if(message.match(/![A-Z]{1}[a-z]{2}[A-Z]{1}$/)) {

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
