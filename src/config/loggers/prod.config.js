import winston from "winston";

const myCustomLevels = {
    levels: {
        fatal: 1,
        error: 2,
        warn: 3,
        info: 4,
        http: 5,
        debug: 6
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warn: "yellow",
        info: "blue",
        http: "cyan",
        debug: "green"
    }
}

winston.addColors(myCustomLevels.colors);

const logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: myCustomLevels.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "info",
            format: winston.format.simple()
        }),
    ],
});

export default logger;
