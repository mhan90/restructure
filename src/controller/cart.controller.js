import CartManager from "../dao/mongo/CartManager.js";

const db = new CartManager();

export const GetCart = async (req, res) => {
    try {
        const { id } = req.params;
        res.send(await db.getCart(id));
    } catch (e) {
        res.status(500).send({ status: "error while getting cart", error: e });
    }
}

export const PostNewCart = async (req, res) => {
    try {
        res.send(await db.addCart());
    } catch (e) {
        res.status(500).send({ status: "error while adding new cart", error: e });
    }
}

export const PostNewProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        res.send(await db.addProductToCart(cid, pid));
    } catch (e) {
        res
            .status(500)
            .send({ status: "error while adding product to cart", error: e });
    }
}

export const PutCart = async (req, res) => {
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
}

export const PutProductToCart = async (req, res) => {
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
}

export const DeleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        res.send(await db.deleteCart(cid));
    } catch (e) {
        res.status(500).send({ status: "error while deleting cart", error: e });
    }
}

export const DeleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        res.send(await db.deleteProductFromCart(cid, pid));
    } catch (e) {
        res
            .status(500)
            .send({ status: "error while deleting product from cart", error: e });
    }
}

