import UserModel from "./models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

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

    getUserByEmail = async (email) => {
        try {
            return await UserModel.findOne({ email }).lean();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Saves a new user at db.
     * @param {first_name: string, last_name: string, email: string, age: number, password: string, role: string} user 
     * @returns an user document
     */
    newUser = async (user) => {
        try {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
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
      * @returns user object if validates or false if not
      */
    validateUser = async (email, password) => {
        /* if (email == "adminCoder@coder.com" && password == "adminCod3r123") return {
            first_name: "Coder",
            last_name: "House",
            email: "adminCoder@coder.com",
            age: 33,
            password: "",
            salt: "",
            role: "admin"
        } */
        const user = await UserModel.findOne({ email });
        if (!user) return false;
        const valid = await bcrypt.compare(password, user.password);
        return valid ? user.toObject() : false;
    }
}