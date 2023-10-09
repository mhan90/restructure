import { Router } from "express";
import EErrors from "../utils/enum.error.js";
import logger from "../config/loggers/logger.factory.js";

const loggerTest = Router();

loggerTest.get("/", (req, res) => {
    const { type } = req.query;
    let newError = new Error(type);
    const string = `[${req.method}]${req.url} - ${new Date().toUTCString()}\n ${newError}`;
    logger[type](string);
    res.send({ type: newError.message });
});

export default loggerTest;