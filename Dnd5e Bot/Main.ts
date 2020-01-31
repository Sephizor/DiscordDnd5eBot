import winston = require('winston');
import {
    Client,
    MessageEmbedField,
    RichEmbedOptions,
    RichEmbed,
    Message
} from 'discord.js';
import express from 'express';
const settings: Settings = require('./settings.json');

import DndBot from './DndBot';
import Settings from './Settings';
import BotWeb from './web/WebMain';

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

const _messageHandler = new DndBot(logger);

discordBot.on('message', async (message: Message) => {
    if(message.author.bot) return;
    const addressName = message.channel.type !== 'text' ? message.author.username : message.member.displayName

    if(message.content.match(`^[${settings.messagePrefix}]`)) {
        try {
            const outputMessage: MessageEmbedField[] = await _messageHandler.handleMessage(
                message.content.substring(settings.messagePrefix.length, message.content.length),
                message.author.id
            );
            message.channel.send(new RichEmbed(<RichEmbedOptions> {
                color: 1530000,
                title: `${addressName}'s results`,
                fields: outputMessage,
            }));
        }
        catch(e) {
            message.channel.send(new RichEmbed(<RichEmbedOptions> {
                color: 153000,
                title: `${addressName}'s results`,
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

if(settings.webEnabled) {
    const app = BotWeb(_messageHandler);
    if(!settings.webPort) {
        logger.error('Failed to start web server as port was not specified in config');
    }
    else {
        app.listen(settings.webPort);
    }
}
