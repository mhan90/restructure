import { Router } from "express";
import * as CartController from "../controller/cart.controller.js";

const cartsRouter = Router();

cartsRouter.get("/:id", CartController.GetCart);
cartsRouter.post("/", CartController.PostNewCart);
cartsRouter.post("/:cid/products/:pid", CartController.PostNewProductToCart);
cartsRouter.put("/:cid", CartController.PutCart);
cartsRouter.put("/:cid/products/:pid", CartController.PutProductToCart);
cartsRouter.delete("/:cid", CartController.DeleteCart);
cartsRouter.delete("/:cid/products/:pid", CartController.DeleteProductFromCart);

export default cartsRouter;
