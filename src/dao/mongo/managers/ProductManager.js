import ProductModel from "../models/product.model.js";

export default class ProductManager {
  constructor() { }

  /**
   * Adds a new product to db.
   * @param { { title: string, description: string, price: number, thumbnails: array , code: string, stock: number, category: string, status: boolean  } } param0
   */
  addProduct = async ({
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status = "true",
  }) => {
    try {
      const product = await ProductModel.findOne({ code });
      if (!product) {
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
        const result = await ProductModel.create(newProduct);
        return { status: "success", payload: { product: result } };
      } else {
        return {
          status: "error",
          error: `product with code ${code} already exists`,
        };
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   * @returns an array of objects with all products.
   */
  getProducts = async (query, limit, page, sort, host, url) => {
    try {
      if (!Number(page) || page < 0) return { status: "error", error: "invalid page" };
      const _query = query ? JSON.parse(query) : {};
      const _options = { limit, page, customLabels: { docs: "payload" }, lean: true, leanWithId: false };
      if (sort) _options.sort = { price: sort };
      const products = await ProductModel.paginate(_query, _options);
      if (page > products.totalPages) return { status: "error", error: "invalid page" };
      products.status = "success";
      // let url = `/api/products?`;
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
      console.error(e);
      throw e;
    }
  };

  /**
   *
   * @param {string} id
   * @returns an object with the requested product details.
   */
  getProductById = async (id) => {
    try {
      const product = await ProductModel.findById(id);
      return product
        ? { status: "success", payload: product }
        : { status: "error", error: "not found" };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   * Updates the details of the specified product.
   * @param {number} id
   * @param { { title: string, description: string, price: number, thumbnails: array, code: string, stock: number, category: string, status: boolean } } data
   */
  updateProduct = async (id, data) => {
    try {
      //   const product = await ProductModel.findById(id);
      if (data.price) data.price = Number(data.price);
      if (data.stock) data.stock = Number(data.stock);
      if (data.status) data.status = data.status.toLowerCase() === "true";
      await ProductModel.findByIdAndUpdate(id, data);
      return { status: "success" };
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  /**
   * Deletes the specified product.
   * @param {number} id
   */
  deleteProduct = async (id) => {
    try {
      await ProductModel.findByIdAndDelete(id);
      return { status: "success" };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
}
