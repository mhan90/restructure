import ProductModel from "./models/product.model.js";

export default class Products {
    getProducts = async (query, options) => ProductModel.paginate(query, options);
    getProductById = async (id) => ProductModel.findById(id);
    getProductByCode = async (code) => ProductModel.findOne({ code });
    addProduct = async (product) => ProductModel.create(product);
    updateProduct = async (id, data) => ProductModel.findByIdAndUpdate(id, data);
    deleteProduct = async (id) => ProductModel.findByIdAndDelete(id);
}