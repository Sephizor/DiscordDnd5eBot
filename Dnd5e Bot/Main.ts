import fs from 'fs';
import {
    Client,
    EmbedField,
    MessageEmbed,
    Message,
    PartialMessage,
    MessageEmbedOptions
} from 'discord.js';
const settings: Settings = require('./settings.json');

import DndBot from './DndBot';
import Settings from './Settings';
import Logger from './Logger';

let localSettings: any = null;

if(fs.existsSync(`${__dirname}/settings.local.json`)) {
    localSettings = require('./settings.local.json');
    Object.assign(settings, localSettings);
}

Logger.Level = settings.logLevel;
Logger.Setup();
Logger.Instance.verbose('[Main]: Logger initialised');

// Initialize Discord Bot
const discordBot = new Client();

discordBot.on('ready', () => {
    Logger.Instance.info('[Main]: OnReady: Connected');
    if(discordBot.user) {
        Logger.Instance.info(`[Main]: OnReady: Logged in as: ${discordBot.user.tag}`);
    }
    else {
        Logger.Instance.error('[Main]: OnReady: Discord bot user is null!');
        throw new Error('Discord bot user is null');
    }
});

const _messageHandler = new DndBot();

async function handleMessage(message: Message | PartialMessage) {
    if(message.author?.bot) return;

    if(!message.author) {
        Logger.Instance.error('[Main]: handleMessage: Message author details are null');
        throw new Error('Discord API did not send message author details');
    }

    if(!message.member) {
        Logger.Instance.error('[Main]: handleMessage: Message member details are null');
        throw new Error('Discord API did not send message author details');
    }

    if(!message.content) {
        Logger.Instance.error('[Main]: handleMessage: Message content is null')
        throw new Error('Discord API did not send message content');
    }

    if(message.content.charAt(1) ===settings.messagePrefix) {
        return;
    }

    const addressName = message.channel.type !== 'text' ? message.author.username : message.member.displayName

    if(message.content.match(`^[${settings.messagePrefix}]`)) {
        try {
            const outputMessage: EmbedField[] = await _messageHandler.handleMessage(
                message.content.substring(settings.messagePrefix.length, message.content.length),
                message.author.id,
                message.guild !== null ? message.guild.id : undefined
            );

            const charName = _messageHandler.getCharacterName(message.author.id, message.guild !== null ? message.guild.id : undefined);
            const title = (charName !== null ? charName : addressName) + "'s results";

            const messageEmbed = new MessageEmbed(<MessageEmbedOptions> {
                color: 1530000,
                title: title,
                fields: outputMessage
            });
            messageEmbed.type = 'rich';
            message.channel.send(messageEmbed);
        }
        catch(e) {
            const messageEmbed = new MessageEmbed(<MessageEmbedOptions> {
                color: 153000,
                title: `${addressName}'s results`,
                fields: <EmbedField[]>[{
                    name: 'Error',
                    value: e.message
                }]
            });
            messageEmbed.type = 'rich';
            message.channel.send(messageEmbed);
        }
    }
}

discordBot.on('message', handleMessage);
discordBot.on('messageUpdate', async (o, n) => {
    if(o !== n) {
        try {
            return await handleMessage(n);
        }
        catch(e) {
            const messageEmbed = new MessageEmbed(<MessageEmbedOptions> {
                color: 153000,
                title: `Unhandled Error`,
                fields: <EmbedField[]>[{
                    name: 'Error',
                    value: e.message
                }]
            });
            messageEmbed.type = 'rich';
            n.channel.send(messageEmbed);
        }
    }
});

discordBot.login(settings.token);
