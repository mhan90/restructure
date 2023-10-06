import EErrors from "./enum.error.js";
import logger from "../config/loggers/logger.factory.js";

const ErrorHandler = (error, req, res, next) => {
    const response = { status: "error" };
    switch (error.code) {
        case EErrors.USER_INPUT_ERROR:
            logger.warn(
                `[${req.method}]${req.url} - ${new Date().toUTCString()}\n  error: ${error.name}\n  cause: ${error.cause}`);
            response.message = error.message;
            res.status(400).send(response);
            break;
        case EErrors.DATABASE_ERROR:
            logger.error(
                `[${req.method}]${req.url} - ${new Date().toUTCString()}\n  error: ${error}`);
            res.status(500);
            break;
        default:
            logger.error(
                `[${req.method}]${req.url} - ${new Date().toUTCString()}\n  error: ${error}`);
            response.msg = "unhandled error/promise";
            res.status(500).send(response);
    }
}

export default ErrorHandler;