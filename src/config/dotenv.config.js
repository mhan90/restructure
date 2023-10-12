import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("--env <env>", "app env", "production");
program.parse();
const options = program.opts();
dotenv.config({
    path: options.env == "production" ? "./.env.production" : "./.env.dev",
});

export default {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    PERSISTENCE: process.env.PERSISTENCE,
    MONGODB_URL: process.env.MONGODB_URL,
    GIT_ID: process.env.GIT_ID,
    GIT_SECRET: process.env.GIT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PW: process.env.ADMIN_PW
};