import mongoose from "mongoose";
import env from "../config/config.js";

const DAO = {

    mongo: async () => {
        await mongoose.connect(env.MONGODB_URL);
        const { default: productsDAO } = await import("./mongo/products.dao.js");
        const { default: cartsDAO } = await import("./mongo/carts.dao.js");
        const { default: usersDAO } = await import("./mongo/users.dao.js");
        const { default: ticketsDAO } = await import("./mongo/tickets.dao.js");


        return { productsDAO, cartsDAO, usersDAO, ticketsDAO };
    },
    fs: async () => {
        return null;
    }
}

const dao = await DAO[env.PERSISTENCE ?? "mongo"]();
export default dao;
