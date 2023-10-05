import DAOFactory from "../dao/dao.factory.js";
import * as UserDTO from "../dto/users.dto.js";
import * as error from "../utils/custom.error.js";

const { usersDAO } = DAOFactory;
const dao = new usersDAO();

export const GetUser = async (id) => {
    const user = await dao.getUserByID(id);
    if (!user) error.notFound("user", id);
    return UserDTO.removePW(user);
}