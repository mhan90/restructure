import env from "../dotenv.config.js";

const Logger = {
    dev: async () => {
        const { default: logger } = await import("./dev.config.js")
        return logger;
    },
    prod: async () => {
        const { default: logger } = await import("./prod.config.js")
        return logger;
    }
}

const logger = await Logger[env.ENV ?? "prod"]();

export default logger;
