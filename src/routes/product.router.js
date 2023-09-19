import { Router } from "express";
import { uploader } from "../config/multer.js";
import * as ProductController from "../controller/product.controller.js";

const productsRouter = Router();

productsRouter.get("/", ProductController.GetProducts);
productsRouter.get("/:id", ProductController.GetProductById);
productsRouter.post("/", uploader.array("thumbnails"), ProductController.PostNewProduct);
productsRouter.put("/:id", uploader.array("thumbnails"), ProductController.PutProduct);
productsRouter.delete("/:id", ProductController.DeleteProduct);

export default productsRouter;
