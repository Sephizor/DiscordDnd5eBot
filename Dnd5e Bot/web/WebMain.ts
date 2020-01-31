import DndBot from "../DndBot";
import express from 'express';

export default function BotWeb(bot: DndBot): express.Application {
    const app = express();

    app.get('/activechars', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(bot.getActiveCharacters());
    });

    return app;
}