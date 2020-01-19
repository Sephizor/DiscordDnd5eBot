import { MessageEmbedField } from "discord.js";

import ICommand from "./Command";

export default class HelpCommand implements ICommand {

    private _helpText: string = '';

    constructor() {
        this.buildHelpText();
    }

    private buildHelpText() {
        this._helpText =
            'For help, please read the "usage" section in my README on [Github](https://github.com/Sephizor/DiscordDnd5eBot/tree/typescriptRewrite)';
    }

    execute(): MessageEmbedField[] {
        return <MessageEmbedField[]> [
            {
                name: 'Commands',
                value: this._helpText
            }
        ];
    }
    
}
