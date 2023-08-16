import { Router } from "express";
import ProductManager from "../dao/mongo/ProductManager.js";
import CartManager from "../dao/mongo/CartManager.js";

const mainRouter = Router();
const prodsDB = new ProductManager();
const cartsDB = new CartManager();


mainRouter.get("/products", async (req, res) => {
    try {
        const host = req.headers.host;
        const { limit = 10, page = 1, query, sort } = req.query;
        const result = await prodsDB.getProducts(query, limit, page, sort, host, "/products");
        if (result.status == "error") {
            res.status(400).send(result);
        } else {
            const cart = await cartsDB.addCart();
            const data = { title: "Products list", products: result.payload, page: result.page, cart: cart.payload._id };
            res.render("products", data);
        }
    } catch (e) {
        res.status(500).send({ status: "error", error: e });
    }
});

mainRouter.get("/carts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await cartsDB.getCart(id);
        if (result.status == "error") {
            res.status(400).send(result);
        } else {
            res.render("cart", { title: "Cart", id: result.payload._id, products: result.payload.products });
        }
    } catch (e) {
        res.status(500).send({ status: "error", error: e });
    }
});

export default mainRouter;
