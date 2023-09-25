import errorHandler from "../config/error.handler.js";
import * as CartService from "../services/carts.service.js";

export const GetCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await CartService.GetCart(id);
        if (!cart) throw new Error("cart not found");
        res.send({ status: "success", payload: cart });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const PostNewCart = async (req, res) => {
    try {
        const cart = await CartService.AddCart();
        res.send({ status: "success", payload: cart });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const PostNewProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartService.AddProductToCart(cid, pid, 1);
        res.send({ status: "success", payload: cart });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const UpdateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;
        const cart = await CartService.UpdateCart(cid, products);
        res.send({ status: "success", payload: cart });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const PutProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const qty = req.body.quantity;
        const cart = await CartService.AddProductToCart(cid, pid, qty, "put");
        res.send({ status: "success", payload: cart });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const DeleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await CartService.DeleteCart(cid);
        res.send({ status: "success", payload: result });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const DeleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await CartService.DeleteProductFromCart(cid, pid);
        res.send({ status: "success", payload: result });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

