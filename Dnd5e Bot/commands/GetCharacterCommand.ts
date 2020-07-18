import { ICharacter } from "../Character";
import { MessageEmbedField } from "discord.js";

export default class GetCharacterCommand {
    private _character: ICharacter;

    constructor(character: ICharacter) {
        this._character = character;
    }

    async execute(): Promise<MessageEmbedField[]> {
        return <MessageEmbedField[]>[
            {
                name: 'Character data',
                value: JSON.stringify(this._character)
            }
        ];
    }
}