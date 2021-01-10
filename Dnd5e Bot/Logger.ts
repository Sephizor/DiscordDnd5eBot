import winston = require('winston');

export default class Logger {
    public static Log: winston.Logger;
    private static level = 'debug';

    public static set Level(value: string) {
        this.level = value;
    }

    public static Setup() {
        this.Log = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize({
                            all: true
                        })
                    ),
                    level: this.level,
                })
            ],
            exitOnError: false
        });
    }

    public static get Instance(): winston.Logger {
        return this.Log;
    }
}