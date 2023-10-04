import DAOFactory from "../dao/dao.factory.js";
import * as ProductDTO from "../dto/products.dto.js";
import CustomError from "../utils/custom.error.js";
import EErrors from "../utils/enum.error.js";
import { productInfoError } from "../utils/causes.error.js";

const { productsDAO } = DAOFactory;
const db = new productsDAO();

export const GetProducts = async (query, limit, page, sort, host, url = "/api/products") => {
    if (!Number(page) || page < 0) {
        CustomError.newError({
            message: 'invalid page',
            cause: 'page should be > 0',
            name: 'product get error',
            code: EErrors.USER_INPUT_ERROR
        });
    }
    const _query = query ? JSON.parse(query) : {};
    const _options = { limit, page, customLabels: { docs: "payload" }, lean: true, leanWithId: false };
    if (sort) _options.sort = { price: sort };

    const products = await db.getProducts(_query, _options);

    if (page > products.totalPages) {
        CustomError.newError({
            message: 'invalid page',
            cause: `page should be <= ${products.totalPage}`,
            name: 'product get error',
            code: EErrors.USER_INPUT_ERROR
        });
    }

    return ProductDTO.addURL(query, limit, sort, host, url, products);
}

export const GetProductById = async (id) => {
    return await db.getProductById(id);
}

export const AddProduct = async (data) => {
    if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category) {
        CustomError.newError({
            message: 'product was not added',
            cause: productInfoError(data),
            name: 'new product error',
            code: EErrors.USER_INPUT_ERROR
        });
    }
    const prdtExists = await db.getProductByCode(data.code);
    if (prdtExists) throw new Error("product already exists");
    const newProduct = new ProductDTO.Create(data);

    return await db.addProduct(newProduct);
}

export const UpdateProduct = async (id, data) => {
    const newData = new ProductDTO.Update(data);
    return await db.updateProduct(id, newData);

}

export const DeleteProduct = async (id) => {
    return await db.deleteProduct(id);
}