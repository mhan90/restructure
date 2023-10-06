import { Router } from "express";
import EErrors from "../utils/enum.error.js";
import logger from "../config/loggers/dev.config.js";

const loggerTest = Router();

loggerTest.get("/", (req, res) => {
    const { type } = req.query;
    let newError = new Error("test");
    logger[type](`[${req.method}]${req.url} - ${new Date().toUTCString()}\n ${newError}`);
    res.json({ newError });
});

export default loggerTest;