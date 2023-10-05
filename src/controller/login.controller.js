import * as LoginService from "../services/login.service.js";

export const PostUserLogin = async (req, res) => {
    const { email, password } = req.body;
    const token = await LoginService.ValidateUser(email, password);
    if (!token) {
        res.send({ error: true });
    } else {
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        res.send({ error: false, token: token });
    }
}