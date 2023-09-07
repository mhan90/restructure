import { Router } from "express";
import UserManager from "../dao/mongo/UserManager.js";
import { newToken } from "../utils/jwt.js";

const loginRouter = new Router();

const User = new UserManager();

loginRouter.post("/", async (req, res) => {
    try {
        const user = await User.validateUser(req.body.email, req.body.password);
        if (!user) return res.send({ error: true });
        const token = newToken({
            sub: user._id,
            user: { email: user.email },
        });
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        res.send({ error: false, token: token });

    } catch (e) {
        res.status(500).send({ error: true });
    }
});

export default loginRouter;