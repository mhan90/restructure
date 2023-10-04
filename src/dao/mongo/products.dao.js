import ProductModel from "./models/product.model.js";
import EErrors from "../../utils/enum.error.js";

export default class Products {
    getProducts = async (query, options) => ProductModel.paginate(query, options)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    getProductById = async (id) => ProductModel.findById(id)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    getProductByCode = async (code) => ProductModel.findOne({ code })
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    addProduct = async (product) => ProductModel.create(product)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    updateProduct = async (id, data) => ProductModel.findByIdAndUpdate(id, data, { new: true })
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    deleteProduct = async (id) => ProductModel.findByIdAndDelete(id)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
}