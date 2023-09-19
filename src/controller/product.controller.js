import ProductManager from "../dao/mongo/ProductManager.js";

const db = new ProductManager();

export const GetProducts = async (req, res) => {
    try {
        const host = req.headers.host;
        const { limit = 10, page = 1, query, sort } = req.query;
        const result = await db.getProducts(query, limit, page, sort, host, "/api/products");
        res.send(result);
    } catch (e) {
        res.status(500).send({ status: "error while getting products", error: e });
    }
}

export const GetProductById = async (req, res) => {
    try {
        const { id } = req.params;
        res.send(await db.getProductById(id));
    } catch (e) {
        res.status(500).send({ status: "error while getting product", error: e });
    }
}

export const PostNewProduct = async (req, res) => {
    try {
        const product = req.body;
        if (
            !product.title ||
            !product.description ||
            !product.code ||
            !product.price ||
            !product.stock ||
            !product.category
        ) {
            res.status(400).send({ status: "error", error: "missing data" });
        } else {
            // if (product.status) product.status = (product.status.toLowerCase() === "true"); // Parse string to boolean.
            if (req.files) {
                product.thumbnails = [];
                req.files.forEach((file) => product.thumbnails.push(file.path));
            }
            res.send(await db.addProduct(product));
        }
    } catch (e) {
        res
            .status(500)
            .send({ status: "error while adding new product", error: e });
    }
}

export const PutProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;
        if (req.files) {
            product.thumbnails = [];
            req.files.forEach((file) => product.thumbnails.push(file.path));
        }
        res.send(await db.updateProduct(id, product));
    } catch (e) {
        res.status(500).send({ status: "error", error: e });
    }
}

export const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        res.send(await db.deleteProduct(id));
    } catch (e) {
        res.status(500).send({ status: "error", error: e });
    }
}