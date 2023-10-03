import DAOFactory from "../dao/dao.factory.js";

const { productsDAO, cartsDAO, ticketsDAO } = DAOFactory;
const prodsDB = new productsDAO();
const cartsDB = new cartsDAO();
const tktDB = new ticketsDAO();

export const GetCart = async (id) => {
    try {
        return await cartsDB.getCart(id);
    } catch (e) {
        throw new Error("db error");
    }
}

export const AddCart = async () => {
    try {
        const newCart = {
            products: []
        };
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

export const Checkout = async (cid, email) => {
    try {
        const cart = await cartsDB.findCart(cid);
        if (!cart) throw new Error("cart not found");

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

    } catch (e) {
        console.log(e);
        switch (e.message) {
            case "cart not found":
            case "product not found at cart":
                throw e;
            default:
                throw new Error("db error");
        }
    }
}