import CartModel from "./models/cart.model.js";
import EErrors from "../../utils/enum.error.js";

export default class Carts {
    addCart = async (cart) => CartModel.create(cart)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    getCart = async (id) => CartModel.findById(id).populate('products.product').lean()
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    findCart = async (id) => CartModel.findById(id)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    updateCart = async (id, data) => CartModel.findByIdAndUpdate(id, data, { new: true })
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    deleteCart = async (id) => CartModel.findByIdAndDelete(id)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
}