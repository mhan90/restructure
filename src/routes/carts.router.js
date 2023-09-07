import { Router } from "express";
import CartManager from "../dao/mongo/CartManager.js";

const cartsRouter = Router();
const db = new CartManager();

cartsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.send(await db.getCart(id));
  } catch (e) {
    res.status(500).send({ status: "error while getting cart", error: e });
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    res.send(await db.addCart());
  } catch (e) {
    res.status(500).send({ status: "error while adding new cart", error: e });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    res.send(await db.addProductToCart(cid, pid));
  } catch (e) {
    res
      .status(500)
      .send({ status: "error while adding product to cart", error: e });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;
    if (!products) {
      res.status(400).send({ status: "error", error: "missing data" });
    } else {
      res.send(await db.updateCart(cid, products));
    }
  } catch (e) {
    res
      .status(500)
      .send({ status: "error while adding products to cart", error: e });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const qty = req.body.quantity;
    if (!qty) {
      res.status(400).send({ status: "error", error: "missing data" });
    } else {
      res.send(await db.addProductToCart(cid, pid, qty, "put"));
    }
  } catch (e) {
    res.status(500).send({ status: "error while updating product quantity", error: e });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    res.send(await db.deleteCart(cid));
  } catch (e) {
    res.status(500).send({ status: "error while deleting cart", error: e });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    res.send(await db.deleteProductFromCart(cid, pid));
  } catch (e) {
    res
      .status(500)
      .send({ status: "error while deleting product from cart", error: e });
  }
});

export default cartsRouter;
