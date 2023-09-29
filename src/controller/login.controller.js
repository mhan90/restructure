import * as LoginService from "../services/login.service.js";

export const PostUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await LoginService.ValidateUser(email, password);
        if (!token) res.send({ error: true });
        res.send({ error: false, token: token });
    } catch (e) {
        errorHandler(e.message, res);
    }
}