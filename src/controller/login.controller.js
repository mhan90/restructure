import UserManager from "../dao/mongo/UserManager.js";
import { newToken } from "../utils/jwt.js";
import ENV from "../config/config.js"

const User = new UserManager();

export const PostUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = (email == ENV.ADMIN_EMAIL && password == ENV.ADMIN_PW)
            ? {
                _id: 0,
                first_name: "Super",
                last_name: "Admin",
                email: ENV.ADMIN_EMAIL,
                password: "",
                role: "admin"
            }
            : await User.validateUser(email, password);
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
}