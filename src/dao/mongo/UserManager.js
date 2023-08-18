import UserModel from "./models/user.model.js";
import crypto from "crypto";

export default class UserManager {
    constructor() { }

    getUsers = async () => {
        try {
            return await UserModel.find();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    /**
     * Saves a new user at db.
     * @param {first_name: string, last_name: string, email: string, age: number, password: string, role: string} user 
     * @returns user document
     */
    newUser = async (user) => {
        try {
            user.salt = crypto.randomBytes(128).toString("base64");
            user.password = crypto
                .createHmac("sha256", user.salt)
                .update(user.password)
                .digest("hex");
            return await UserModel.create(user);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
      * Validates a user credentials.
      * @param {string} email 
      * @param {string} password 
      * @returns user object if validates or false
      */
    validateUser = async (email, password) => {
        const user = await UserModel.findOne({ email });
        if (!user) return false;
        const hash = crypto
            .createHmac("sha256", user.salt)
            .update(password)
            .digest("hex");
        return hash == user.password ? user.toObject() : false;
    }
}