import { MessageEmbedField } from "discord.js";

export default interface ICommand {
    execute(): MessageEmbedField[];
}
