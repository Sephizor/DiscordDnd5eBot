import winston = require('winston');
import {
    Client,
    MessageEmbedField,
    RichEmbedOptions,
    RichEmbed,
    Message
} from 'discord.js';
const settings: Settings = require('./settings.json');

import DndBot from './DndBot';
import Settings from './Settings';

// Configure logger settings
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: true
                })
            ),
            level: settings.logLevel,
        })
    ],
    exitOnError: false
});

logger.verbose('Logger initialised');

// Initialize Discord Bot
const discordBot = new Client();

discordBot.on('ready', () => {
    logger.info('Connected');
    logger.info(`Logged in as: ${discordBot.user.tag}`);
});

const _messageHandler = new DndBot();

discordBot.on('message', async (message: Message) => {
    if(message.author.bot) return;
    if(message.channel.type !== 'text') return;

    if(message.content.match(`^[${settings.messagePrefix}]`)) {
        try {
            const outputMessage: MessageEmbedField[] = await _messageHandler.handleMessage(
                message.content.substring(settings.messagePrefix.length, message.content.length),
                message.author.id,
                logger
            );
            message.channel.send(new RichEmbed(<RichEmbedOptions> {
                color: 1530000,
                title: `${message.member.displayName}'s results`,
                fields: outputMessage,
            }));
        }
        catch(e) {
            message.channel.send(new RichEmbed(<RichEmbedOptions> {
                color: 153000,
                title: `${message.member.displayName}'s results`,
                fields: <MessageEmbedField[]>[{
                    name: 'Error',
                    value: e.message
                }]
            }));
        }
    }
});

discordBot.login(settings.token);

logger.verbose(discordBot);
