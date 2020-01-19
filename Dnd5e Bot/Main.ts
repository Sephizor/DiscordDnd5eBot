import winston = require('winston');
import {
    Client,
    MessageEmbedField,
    RichEmbedOptions,
    RichEmbed,
    Message
} from 'discord.js';
const auth = require('./auth.json');

import DndBot from './DndBot';

// Configure logger settings
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: true
                })
            ),
            level: 'verbose',
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
const respondPrefix = '+';

discordBot.on('message', (message: Message) => {
    if(message.author.bot) return;
    if(message.channel.type !== 'text') return;

    if(message.content.match(`^[${respondPrefix}]`)) {
        const outputMessage: MessageEmbedField[] = _messageHandler.handleMessage(message.content.substring(respondPrefix.length, message.content.length), logger);
        message.channel.send(new RichEmbed(<RichEmbedOptions>{
            color: 1530000,
            title: `${message.member.displayName}'s results`,
            fields: outputMessage,
        }));
    }
});

discordBot.login(auth.token);

logger.verbose(discordBot);
