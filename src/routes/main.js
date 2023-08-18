import { Router } from "express";
import ProductManager from "../dao/mongo/ProductManager.js";
import CartManager from "../dao/mongo/CartManager.js";
import UserManager from "../dao/mongo/UserManager.js";
import { isLogged, protectView } from "../utils/protection.middleware.js";

const mainRouter = Router();
const prodsDB = new ProductManager();
const cartsDB = new CartManager();
const userDB = new UserManager();

mainRouter.get("/login", isLogged, (req, res) => {
    res.render("login");
});

mainRouter.post("/login", isLogged, async (req, res) => {
    const { email, password } = req.body;
    const user = await userDB.validateUser(email, password);
    if (!user) return res.redirect("/login");
    delete user.password;
    delete user.salt;
    req.session.user = user;
    res.redirect("/products");
});

mainRouter.get("/logout", protectView, async (req, res) => {
    req.session.destroy((e) => {
        res.redirect("/login");
    });
});

mainRouter.get("/register", isLogged, (req, res) => {
    res.render("register");
});

mainRouter.post("/register", isLogged, async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;
    const user = await userDB.newUser({ first_name, last_name, email, password, age });
    res.redirect("/products");
});

mainRouter.get("/products", protectView, async (req, res) => {
    try {
        const host = req.headers.host;
        const { limit = 10, page = 1, query, sort } = req.query;
        const result = await prodsDB.getProducts(query, limit, page, sort, host, "/products");
        if (result.status == "error") {
            res.status(400).send(result);
        } else {
            const cart = await cartsDB.addCart();
            const data = { title: "Products list", products: result.payload, page: result.page, cart: cart.payload._id, user: req.session.user };
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
