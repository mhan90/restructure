import { Router } from "express";
import { uploader } from "../config/multer.js";
import * as ProductController from "../controller/products.controller.js";
import passportMDW from "../utils/jwt.mdw.js";
import { permissions } from "../utils/protection.middleware.js";

const productsRouter = Router();

productsRouter.get("/", ProductController.GetProducts);
productsRouter.get("/:id", ProductController.GetProductById);
productsRouter.post("/", passportMDW("jwt"), permissions("admin"), uploader.array("thumbnails"), ProductController.PostNewProduct);
productsRouter.put("/:id", passportMDW("jwt"), permissions("admin"), uploader.array("thumbnails"), ProductController.UpdateProduct);
productsRouter.delete("/:id", passportMDW("jwt"), permissions("admin"), ProductController.DeleteProduct);

export default productsRouter;
