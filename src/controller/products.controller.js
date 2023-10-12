import * as ProductService from "../services/products.service.js";

export const GetProducts = async (req, res, next) => {
    try {
        const host = req.headers.host;
        const { limit = 10, page = 1, query, sort } = req.query;
        const result = await ProductService.GetProducts(query, limit, page, sort, host);
        result.status = "success";
        res.send(result);
    } catch (e) {
        next(e);
    }
}

export const GetProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ProductService.GetProductById(id);
        res.send({ status: "success", payload: product });
    } catch (e) {
        next(e);
    }
}

export const PostNewProduct = async (req, res, next) => {
    try {
        const product = req.body;
        const files = req.files;
        product.thumbnails = [];
        if (files) files.forEach((file) => product.thumbnails.push(file.path));
        const result = await ProductService.AddProduct(product);
        res.send({ status: "success", payload: result });
    } catch (e) {
        next(e);
    }
}

export const UpdateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = req.body;
        const files = req.files;
        product.thumbnails = [];
        if (files) files.forEach((file) => product.thumbnails.push(file.path));
        const result = await ProductService.UpdateProduct(id, product);
        res.send({ status: "success", payload: result });
    } catch (e) {
        next(e);
    }
}

export const DeleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await ProductService.DeleteProduct(id);
        res.send({ status: "success", payload: result });
    } catch (e) {
        next(e);
    }
}