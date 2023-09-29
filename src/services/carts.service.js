import DAOFactory from "../dao/dao.factory.js";

const { productsDAO, cartsDAO } = DAOFactory;
const prodsDB = new productsDAO();
const cartsDB = new cartsDAO();

export const GetCart = async (id) => {
    try {
        return await cartsDB.getCart(id);
    } catch (e) {
        throw new Error("db error");
    }
}

export const AddCart = async () => {
    try {
        const newCart = { products: [] };
        return await cartsDB.addCart(newCart);
    } catch (e) {
        throw new Error("db error");
    }
}

export const AddProductToCart = async (cid, pid, qty, method = "post") => {
    if (!qty) throw new Error("missing data");
    try {
        const product = await prodsDB.getProductById(pid);
        if (!product) throw new Error("invalid product");
        qty = Number(qty);
        const cart = await cartsDB.findCart(cid);
        if (!cart) throw new Error("cart not found");
        const pIdx = cart.products.findIndex(
            (_product) => _product.product == pid
        );
        if (pIdx != -1) {
            cart.products[pIdx].quantity += qty;
        } else {
            if (method == "put") throw new Error("product not found at cart");
            const newProduct = { product: pid, quantity: qty };
            cart.products.push(newProduct);
        }
        // await cart.save();
        return await cartsDB.updateCart(cid, { products: cart.products });
    } catch (e) {
        switch (e.message) {
            case "invalid product":
            case "product not found at cart":
            case "cart not found":
                throw e;
            default:
                throw new Error("db error");
        }
    }
}

export const UpdateCart = async (id, products) => {
    try {
        if (!products) throw new Error("missing data");
        const cart = await cartsDB.findCart(id);
        if (!cart) throw new Error("cart not found");
        for (const newProduct of products) {
            const product = await prodsDB.getProductById(newProduct.product);
            if (!product) throw new Error("invalid product");
            const pIdx = cart.products.findIndex(
                (_product) => _product.product == newProduct.product
            );
            (pIdx == -1) ? cart.products.push(newProduct) : cart.products[pIdx].quantity += newProduct.quantity;
        }
        return await cartsDB.updateCart(id, { products: cart.products });
    } catch (e) {
        switch (e.message) {
            case "missing data":
            case "cart not found":
            case "invalid product":
                throw e;
            default:
                throw new Error("db error");
        }
    }
}

export const DeleteCart = async (id) => {
    try {
        return await cartsDB.deleteCart(id);
    } catch (e) {
        throw new Error("db error");
    }
}

export const DeleteProductFromCart = async (cid, pid) => {
    try {
        const cart = await cartsDB.findCart(cid);
        if (!cart) throw new Error("cart not found");
        const pIdx = cart.products.findIndex(
            (_product) => _product.product == pid
        );
        if (pIdx == -1) throw new Error("product not found at cart");
        cart.products.splice(pIdx, 1);
        return await cartsDB.updateCart(cid, { products: cart.products });
    } catch (e) {
        switch (e.message) {
            case "cart not found":
            case "product not found at cart":
                throw e;
            default:
                throw new Error("db error");
        }
    }
}

export const Checkout = async (cid) => {
    try {
        const cart = await cartsDB.findCart(cid);
        if (!cart) throw new Error("cart not found");
        const noStock = [];
        for (const cartProd of cart.products) {
            const _product = await prodsDB.getProductById(cartProd.product);
            if (cartProd.quantity > _product.stock) {
                noStock.push(cartProd.product);
                continue;
            };
            _product.stock -= cartProd.quantity;
            await prodsDB.updateCart(cartProd.product, { stock: _product.stock });


        }
    } catch (e) {
        switch (e.message) {
            case "cart not found":
            case "product not found at cart":
                throw e;
            default:
                throw new Error("db error");
        }
    }
}