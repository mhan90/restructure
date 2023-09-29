import { Router } from "express";
import * as CartController from "../controller/carts.controller.js";

const cartsRouter = Router();

cartsRouter.get("/:cid", CartController.GetCart);
cartsRouter.post("/", CartController.PostNewCart);
cartsRouter.post("/:cid/products/:pid", CartController.PostNewProductToCart);
cartsRouter.put("/:cid", CartController.UpdateCart);
cartsRouter.put("/:cid/products/:pid", CartController.PutProductToCart);
cartsRouter.delete("/:cid", CartController.DeleteCart);
cartsRouter.delete("/:cid/products/:pid", CartController.DeleteProductFromCart);
cartsRouter.post("/:cid/purchase", CartController.CheckoutCart);

export default cartsRouter;
