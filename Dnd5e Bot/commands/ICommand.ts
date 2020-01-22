import { MessageEmbedField } from "discord.js";

export default interface ICommand {
    execute(): Promise<MessageEmbedField[]>;
}
