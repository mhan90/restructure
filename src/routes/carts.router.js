import { Router } from "express";
import * as CartController from "../controller/carts.controller.js";
import { permissions } from "../utils/protection.middleware.js";
import passportMDW from "../utils/jwt.mdw.js";

const cartsRouter = Router();

cartsRouter.get("/:cid", CartController.GetCart);
cartsRouter.post("/", CartController.PostNewCart);
cartsRouter.post("/:cid/products/:pid", passportMDW("jwt"), permissions("user"), CartController.PostNewProductToCart);
cartsRouter.put("/:cid", passportMDW("jwt"), permissions("user"), CartController.UpdateCart);
cartsRouter.put("/:cid/products/:pid", passportMDW("jwt"), permissions("user"), CartController.PutProductToCart);
cartsRouter.delete("/:cid", passportMDW("jwt"), permissions("user"), CartController.DeleteCart);
cartsRouter.delete("/:cid/products/:pid", passportMDW("jwt"), permissions("user"), CartController.DeleteProductFromCart);
cartsRouter.post("/:cid/purchase", passportMDW("jwt"), permissions("user"), CartController.CheckoutCart);

export default cartsRouter;
