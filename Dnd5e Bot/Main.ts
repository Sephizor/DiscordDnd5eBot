import * as discord from 'discord.js';
import winston = require('winston');
const auth = require('./auth.json');

import DndBot from './DndBot';
import { MessageEmbedField } from 'discord.js';

// Configure logger settings
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: true
                })
            ),
            level: 'info',
        })
    ],
    exitOnError: false
});

logger.verbose('Logger initialised');

// Initialize Discord Bot
const discordBot = new discord.Client();

discordBot.on('ready', () => {
    logger.info('Connected');
    logger.info(`Logged in as: ${discordBot.user.tag}`);
});

const _messageHandler = new DndBot();
const respondPrefix = '!';

discordBot.on('message', (message: discord.Message) => {
    if(message.author.bot) return;

    if(message.content.match(`^${respondPrefix}`)) {
        const outputMessage: MessageEmbedField[] = _messageHandler.handleMessage(message.content, logger);
        message.channel.send(new discord.RichEmbed(<discord.RichEmbedOptions>{
            color: 1530000,
            title: `${message.author.username}'s results`,
            fields: outputMessage,
        }));
    }
});

discordBot.login(auth.token);

logger.verbose(discordBot);