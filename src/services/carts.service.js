import DAOFactory from "../dao/dao.factory.js";
import * as error from "../utils/custom.error.js";

const { productsDAO, cartsDAO, ticketsDAO } = DAOFactory;
const prodsDB = new productsDAO();
const cartsDB = new cartsDAO();
const tktDB = new ticketsDAO();

export const GetCart = async (id) => {
    const cart = cartsDB.getCart(id);
    if (!cart) error.notFound("cart", id);
    return cart;
}

export const AddCart = async () => {
    const newCart = { products: [] };
    return await cartsDB.addCart(newCart);
}

export const AddProductToCart = async (cid, pid, qty, method = "post") => {
    if (!qty) error.missingData("qty")
    const product = await prodsDB.getProductById(pid);
    if (!product) error.invalid("product", pid);
    qty = Number(qty);
    const cart = await cartsDB.findCart(cid);
    if (!cart) error.notFound("cart", cid);
    const pIdx = cart.products.findIndex(
        (_product) => _product.product == pid
    );
    if (pIdx != -1) {
        cart.products[pIdx].quantity += qty;
    } else {
        if (method == "put") error.prodCartNotFound(pid, cid);
        const newProduct = { product: pid, quantity: qty };
        cart.products.push(newProduct);
    }

    return await cartsDB.updateCart(cid, { products: cart.products });
}

export const UpdateCart = async (id, products) => {
    if (!products) error.missingData("products");
    const cart = await cartsDB.findCart(id);
    if (!cart) error.notFound("cart", id);
    for (const newProduct of products) {
        const product = await prodsDB.getProductById(newProduct.product);
        if (!product) error.invalid("product", newProduct.product);
        const pIdx = cart.products.findIndex(
            (_product) => _product.product == newProduct.product
        );
        (pIdx == -1) ? cart.products.push(newProduct) : cart.products[pIdx].quantity += newProduct.quantity;
    }
    return await cartsDB.updateCart(id, { products: cart.products });
}

export const DeleteCart = async (id) => {
    return await cartsDB.deleteCart(id);
}

export const DeleteProductFromCart = async (cid, pid) => {
    const cart = await cartsDB.findCart(cid);
    if (!cart) error.notFound("cart", cid);
    const pIdx = cart.products.findIndex(
        (_product) => _product.product == pid
    );
    if (pIdx == -1) error.prodCartNotFound(pid, cid);
    cart.products.splice(pIdx, 1);
    return await cartsDB.updateCart(cid, { products: cart.products });
}

export const Checkout = async (cid, email) => {
    const cart = await cartsDB.findCart(cid);
    if (!cart) error.notFound("cart", cid);
    const noStockIds = [];
    const noStockProducts = [];
    let amount = 0;

    for (const productToPurchase of cart.products) {
        const _product = await prodsDB.getProductById(productToPurchase.product);
        if (productToPurchase.quantity > _product.stock) {
            noStockIds.push(productToPurchase.product);
            noStockProducts.push(productToPurchase);
            continue;
        };
        _product.stock -= productToPurchase.quantity;
        await prodsDB.updateProduct(productToPurchase.product, { stock: _product.stock });
        amount += productToPurchase.quantity * _product.price;
    }

    if (amount == 0) return { noStockIds };

    await cartsDB.updateCart(cid, { products: noStockProducts });

    const data = {
        code: Math.floor(Math.random() * Date.now()).toString(36),
        purchase_datetime: new Date().toUTCString(),
        amount,
        purchaser: email
    }

    const ticket = await tktDB.addTicket(data);

    return { noStockIds, ticket };
}