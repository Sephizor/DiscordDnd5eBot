import path from 'path';
import express from 'express';
import fetch from 'node-fetch';

import DndBot from "../DndBot";
import Settings from "../Settings";

const settings: Settings = require('../settings.json');

export default function BotWeb(bot: DndBot): express.Application {
    const app = express();
    const discordEndpoint = 'https://discordapp.com/api';
    const clientId = settings.discordApi.clientId;
    const clientSecret = settings.discordApi.clientSecret;
    const baseUri = settings.discordApi.baseUri;
    const sitePath = [__dirname, 'site'].join(path.sep)

    app.use('/', express.static(sitePath));

    app.get('/auth/login', (req, res) => {
        const encodedUri = encodeURIComponent(`${baseUri}/auth/callback`);
        res.redirect(`${discordEndpoint}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=identify&redirect_uri=${encodedUri}`);
    });

    app.get('/auth/callback', async (req, res) => {
        if(!req.query.code) {
            res.statusCode = 400;
            res.send('No Discord access code specified');
        }

        const code = req.query.code;
        const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const encodedUri = encodeURIComponent(`${baseUri}/auth/callback`);

        const response = await fetch(`${discordEndpoint}/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodedUri}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                'Authorization': `basic ${creds}`
            }
        });
        const json = await response.json();
        res.redirect(`/?token=${json.access_token}`);
    });

    app.get('/activechars', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(bot.getActiveCharacters());
    });

    return app;
}
