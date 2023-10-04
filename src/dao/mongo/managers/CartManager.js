import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export default class CartManager {
  constructor() { }

  /**
   * Adds an empty new cart to db.
   * @returns cart id
   */
  addCart = async () => {
    try {
      const newCart = {
        products: [],
      };
      const cart = await CartModel.create(newCart);
      return { status: "success", payload: cart };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   * @param {string} cid
   * @returns an object with the requested cart
   */
  getCart = async (cid) => {
    try {
      const cart = await CartModel.findById(cid).populate('products.product').lean();
      return cart
        ? { status: "success", payload: cart }
        : { status: "error", error: "not found" };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   * Adds a product to the specified cart
   * @param {string} cid
   * @param {string} pid
   * @param {string} qty
   */
  addProductToCart = async (cid, pid, qty = 1, method = "post") => {
    try {
      const product = await ProductModel.findById(pid);
      if (!product) return { status: "error", error: "invalid product" };
      qty = Number(qty);
      const cart = await CartModel.findById(cid);
      if (!cart) return { status: "error", error: "cart not found" };
      let _payload = {};
      const pIdx = cart.products.findIndex(
        (_product) => _product.product == pid
      );
      if (pIdx != -1) {
        cart.products[pIdx].quantity += qty;
        _payload = cart.products[pIdx];
      } else {
        if (method == "put") return { status: "error", error: "product not found at cart" };
        const newProduct = { product: pid, quantity: qty };
        cart.products.push(newProduct);
        _payload = newProduct;
      }
      await cart.save();
      return { status: "success", payload: _payload };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   *  Deletes all products from the specified cart.
   * @param {string} cid
   */
  deleteCart = async (cid) => {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) return { status: "error", error: "invalid cart" };
      cart.products = [];
      await cart.save();
      return { status: "success" };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   *  Deletes the specified product from cart.
   * @param {string} cid
   * @param {string} pid
   */
  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) return { status: "error", error: "invalid cart" };
      const pIdx = cart.products.findIndex(
        (_product) => _product.product == pid
      );
      cart.products.splice(pIdx, 1);
      await cart.save();
      return { status: "success" };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  updateCart = async (cid, products) => {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) return { status: "error", error: "invalid cart" };
      for (const newProduct of products) {
        const product = await ProductModel.findById(newProduct.product);
        if (!product) return { status: "error", error: `invalid product ${newProduct.product}`, payload: cart };
        const pIdx = cart.products.findIndex(
          (_product) => _product.product == newProduct.product
        );
        (pIdx == -1) ? cart.products.push(newProduct) : cart.products[pIdx].quantity += newProduct.quantity;
      }
      await cart.save();
      return { status: "success", payload: cart };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
