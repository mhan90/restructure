import * as ProductService from "../services/products.service.js";
import errorHandler from "../config/error.handler.js";

export const GetProducts = async (req, res) => {
    try {
        const host = req.headers.host;
        const { limit = 10, page = 1, query, sort } = req.query;
        const result = await ProductService.GetProducts(query, limit, page, sort, host);
        result.status = "success";
        res.send(result);
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const GetProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductService.GetProductById(id);
        if (!product) throw new Error("product not found");
        res.send({ status: "success", payload: product });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const PostNewProduct = async (req, res) => {
    try {
        const product = req.body;
        const files = req.files;
        product.thumbnails = [];
        if (files) files.forEach((file) => product.thumbnails.push(file.path));
        const result = await ProductService.AddProduct(product);
        res.send({ status: "success", payload: result });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;
        const files = req.files;
        product.thumbnails = [];
        if (files) files.forEach((file) => product.thumbnails.push(file.path));
        const result = await ProductService.UpdateProduct(id, product);
        res.send({ status: "success", payload: result });
    } catch (e) {
        errorHandler(e.message, res);
    }
}

export const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductService.DeleteProduct(id);
        res.send({ status: "success", payload: result });
    } catch (e) {
        errorHandler(e.message, res);
    }
}