import DAOFactory from "../dao/dao.factory.js";
import * as ProductDTO from "../dto/products.dto.js";
import * as error from "../utils/custom.error.js";

const { productsDAO } = DAOFactory;
const db = new productsDAO();

export const GetProducts = async (query, limit, page, sort, host, url = "/api/products") => {
    page = Number(page);
    if (!page || page < 0) error.invalidPage(page, null);
    const _query = query ? JSON.parse(query) : {};
    const _options = { limit, page, customLabels: { docs: "payload" }, lean: true, leanWithId: false };
    if (sort) _options.sort = { price: sort };
    const products = await db.getProducts(_query, _options);
    if (page > products.totalPages) error.invalidPage(page, products.totalPages);
    return ProductDTO.addURL(query, limit, sort, host, url, products);
}

export const GetProductById = async (id) => {
    const product = await db.getProductById(id);
    if (!product) error.notFound("product", id)
    return product;
}

export const AddProduct = async (data) => {
    if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category) {
        error.newProductError(data);
    }
    const prdtExists = await db.getProductByCode(data.code);
    if (prdtExists) error.productExists(data.code);

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