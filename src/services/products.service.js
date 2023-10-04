import DAOFactory from "../dao/dao.factory.js";
import * as ProductDTO from "../dto/products.dto.js";
import CustomError from "../utils/custom.error.js";
import EErrors from "../utils/enum.error.js";
import { productInfoError } from "../utils/causes.error.js";

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
        return ProductDTO.addURL(query, limit, sort, host, url, products);
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

export const AddProduct = async (data) => {
    if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category)
        CustomError.newError({
            message: 'product was not added',
            cause: productInfoError(data),
            name: 'new product error',
            code: EErrors.USER_INPUT_ERROR
        });
    const prdtExists = await db.getProductByCode(data.code);
    if (prdtExists) throw new Error("product already exists");
    const newProduct = new ProductDTO.Create(data);
    return await db.addProduct(newProduct);
}

export const UpdateProduct = async (id, data) => {
    try {
        const newData = new ProductDTO.Update(data);
        return await db.updateProduct(id, newData);
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