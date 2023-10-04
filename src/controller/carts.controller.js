import * as CartService from "../services/carts.service.js";

export const GetCart = async (req, res) => {
    const { cid } = req.params;
    const cart = await CartService.GetCart(cid);
    res.send({ status: "success", payload: cart });
}

export const PostNewCart = async (req, res) => {
    const cart = await CartService.AddCart(email);
    res.send({ status: "success", payload: cart });

}

export const PostNewProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await CartService.AddProductToCart(cid, pid, 1);
    res.send({ status: "success", payload: cart });
}

export const UpdateCart = async (req, res) => {
    const { cid } = req.params;
    const products = req.body.products;
    const cart = await CartService.UpdateCart(cid, products);
    res.send({ status: "success", payload: cart });
}

export const PutProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const qty = req.body.quantity;
    const cart = await CartService.AddProductToCart(cid, pid, qty, "put");
    res.send({ status: "success", payload: cart });
}

export const DeleteCart = async (req, res) => {
    const { cid } = req.params;
    const result = await CartService.DeleteCart(cid);
    res.send({ status: "success", payload: result });
}

export const DeleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    const result = await CartService.DeleteProductFromCart(cid, pid);
    res.send({ status: "success", payload: result });
}

export const CheckoutCart = async (req, res) => {
    const { cid } = req.params;
    const { email } = req.user;
    const payload = await CartService.Checkout(cid, email);
    res.send({ status: "success", payload });
}

