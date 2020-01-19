import { MessageEmbedField } from "discord.js";

import ICommand from "./ICommand";

export default class CreateCharacterCommand implements ICommand {

    constructor() {

    }

    execute(): MessageEmbedField[] {
        return <MessageEmbedField[]> [
            {
                name: 'Error',
                value: 'Not implemented'
            }
        ];
    }
}