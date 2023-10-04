import UserModel from "./models/user.model.js";
import EErrors from "../../utils/enum.error.js";
export default class User {
    getUsers = async () => UserModel.find()
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    getUserByID = async (id) => UserModel.findById(id).lean()
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    getUserByEmail = async (email) => UserModel.findOne({ email }).lean()
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    newUser = async (user) => UserModel.create(user)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
}