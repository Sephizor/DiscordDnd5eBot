import { EmbedField } from "discord.js";

import ICommand from "./ICommand";

export default class UnknownCommand implements ICommand {

    private _message: string;

    constructor(message: string) {
        this._message = message;
    }

    async execute(): Promise<EmbedField[]> {
        return <EmbedField[]>[
            {
                name: 'Error',
                value: `There was no command registered to handle the input: "${this._message}"`
            }
        ];
    }
    
}
