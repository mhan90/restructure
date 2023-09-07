import { Router } from "express";
import passportMDW from "../utils/jwt.mdw.js";

const sessionRouter = new Router();

sessionRouter.get("/current", passportMDW("jwt"), (req, res) => {
    res.send({ user: req.user.email })
});

export default sessionRouter;
