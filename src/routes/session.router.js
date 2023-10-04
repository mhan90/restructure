import { Router } from "express";
import passportMDW from "../utils/jwt.mdw.js";
import * as SessionController from "../controller/session.controller.js"

const sessionRouter = new Router();

sessionRouter.get("/current", passportMDW("jwt"), SessionController.GetCurrentUser);

export default sessionRouter;
