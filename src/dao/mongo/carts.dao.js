import CartModel from "./models/cart.model.js";

export class Carts {
    addCart = async (cart) => CartModel.create(cart);
    getCart = async (id) => CartModel.findById(id).populate('products.product').lean();
    findCart = async (id) => CartModel.findById(id);
    updateCart = async (id, data) => CartModel.findByIdAndUpdate(id, data, { new: true });
    deleteCart = async (id) => CartModel.findByIdAndDelete(id);
}