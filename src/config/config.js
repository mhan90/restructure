import dotenv from "dotenv";

dotenv.config();

export default {
    MONGODB_URL: process.env.MONGODB_URL,
    GIT_ID: process.env.GIT_ID,
    GIT_SECRET: process.env.GIT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PW: process.env.ADMIN_PW
};