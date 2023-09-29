import UserModel from "./models/user.model.js";

export default class User {
    getUsers = async () => UserModel.find();
    getUserByID = async (id) => UserModel.findById(id).lean();
    getUserByEmail = async (email) => UserModel.findOne({ email }).lean();
    newUser = async (user) => UserModel.create(user);
}