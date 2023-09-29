import DAOFactory from "../dao/dao.factory.js";
import * as UserDTO from "../dto/users.dto.js";

const { usersDAO } = DAOFactory;
const dao = new usersDAO();

export const GetUser = async (id) => {
    try {
        const user = await dao.getUserByID(id);
        if (!user) throw new Error("user not found");
        return UserDTO.removePW(user);
    } catch (e) {
        switch (e.message) {
            case "user not found":
                throw e;
            default:
                throw new Error("db error");
        }
    }
}