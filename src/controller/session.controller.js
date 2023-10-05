import * as SessionService from "../services/session.service.js";

export const GetCurrentUser = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await SessionService.GetUser(id);
        res.send({ status: "success", user });
    } catch (e) {
        next(e);
    }
}