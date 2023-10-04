import { Router } from "express";
import * as LoginController from "../controller/login.controller.js";

const loginRouter = new Router();

loginRouter.post("/", LoginController.PostUserLogin);

export default loginRouter;