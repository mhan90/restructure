import jwt from "jsonwebtoken";
import ENV from "../config/dotenv.config.js";

export const newToken = (object) =>
    jwt.sign(object, ENV.JWT_SECRET, { expiresIn: "1h" });

export const jwtMDW = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).send({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
        const user = jwt.verify(token, ENV.JWT_SECRET);
        req.user = user.user;
        next();
    } catch (e) {
        return res.status(403).send({ error: "Unauthorized" });
    }
};

export const jwtCookieMDW = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.send({ error: true });
    try {
        jwt.verify(token, ENV.JWT_SECRET);
        next();
    } catch (e) {
        return res.send({ error: true });
    }
};