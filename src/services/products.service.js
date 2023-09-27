import DAOFactory from "../dao/dao.factory.js";

const { productsDAO } = DAOFactory;
const db = new productsDAO();

export const GetProducts = async (query, limit, page, sort, host, url = "/api/products") => {
    if (!Number(page) || page < 0) throw new Error("invalid page");
    const _query = query ? JSON.parse(query) : {};
    const _options = { limit, page, customLabels: { docs: "payload" }, lean: true, leanWithId: false };
    if (sort) _options.sort = { price: sort };
    try {
        const products = await db.getProducts(_query, _options);
        if (page > products.totalPages) throw new Error("invalid page");
        url += "?";
        if (query) url += `query=${query}&`;
        if (sort) url += `sort=${sort}&`;
        if (products.hasPrevPage) {
            url += `limit=${limit}&page=${products.prevPage}`;
            products.prevLink = new URL(url, `http://${host}`)
        } else {
            products.prevLink = null;
        }
        if (products.hasNextPage) {
            url += `limit=${limit}&page=${products.nextPage}`;
            products.nextLink = new URL(url, `http://${host}`)
        } else {
            products.nextLink = null;
        }
        return products;
    } catch (e) {
        switch (e.message) {
            case "invalid page":
                throw e;
            default:
                throw new Error("db error");
        }
    }
}

export const GetProductById = async (id) => {
    try {
        return await db.getProductById(id);
    } catch (e) {
        throw new Error("db error");
    }
}

export const AddProduct = async ({ title, description, price, thumbnails, code, stock, category, status = "true" }) => {
    try {
        if (
            !title ||
            !description ||
            !code ||
            !price ||
            !stock ||
            !category
        ) throw new Error("missing data");

        const prdtExists = await db.getProductByCode(code);
        if (prdtExists) throw new Error("product already exists");
        const newProduct = {
            title,
            description,
            price: Number(price),
            thumbnails,
            code,
            stock: Number(stock),
            category,
            status: status.toLowerCase() === "true", //parse to boolean
        };
        return await db.addProduct(newProduct);

    } catch (e) {
        switch (e.message) {
            case "missing data":
            case "product already exists":
                throw e;
            default:
                throw new Error("db error");
        }
    }

}

export const UpdateProduct = async (id, data) => {
    try {
        if (data.price) data.price = Number(data.price);
        if (data.stock) data.stock = Number(data.stock);
        if (data.status) data.status = data.status.toLowerCase() === "true";
        return await db.updateProduct(id, data);
    } catch (e) {
        throw new Error("db error");
    }

}

export const DeleteProduct = async (id) => {
    try {
        return await db.deleteProduct(id);
    } catch (e) {
        throw new Error("db error");
    }
}