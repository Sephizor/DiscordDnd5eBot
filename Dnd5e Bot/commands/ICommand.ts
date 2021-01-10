import { EmbedField } from "discord.js";

export default interface ICommand {
    execute(): Promise<EmbedField[]>;
}
