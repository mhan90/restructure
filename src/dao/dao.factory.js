import mongoose from "mongoose";
import env from "../config/config.js";

const DAO = {

    mongo: async () => {
        await mongoose.connect(env.MONGODB_URL);
        const { default: productsDAO } = await import("./mongo/products.dao.js");
        const { default: cartsDAO } = await import("./mongo/carts.dao.js");
        return { productsDAO, cartsDAO };
    },
    fs: async () => {
        return null;
    }
}

const dao = await DAO[env.PERSISTENCE ?? "mongo"]();
export default dao;
