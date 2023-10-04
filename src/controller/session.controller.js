import * as SessionService from "../services/session.service.js";
import errorHandler from "../config/error.handler.js";


export const GetCurrentUser = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await SessionService.GetUser(id);
        res.send({ status: "success", user });
    } catch (e) {
        errorHandler(e.message, res);
    }
}