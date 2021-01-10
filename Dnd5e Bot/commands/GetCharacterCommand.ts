import { ICharacter } from "../Character";
import { EmbedField } from "discord.js";

export default class GetCharacterCommand {
    private _character: ICharacter;

    constructor(character: ICharacter) {
        this._character = character;
    }

    async execute(): Promise<EmbedField[]> {
        return <EmbedField[]>[
            {
                name: 'Character data',
                value: JSON.stringify(this._character)
            }
        ];
    }
}