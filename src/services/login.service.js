import DAOFactory from "../dao/dao.factory.js";
import bcrypt from "bcrypt";
import { newToken } from "../utils/jwt.js";
import ENV from "../config/dotenv.config.js"


const { usersDAO } = DAOFactory;
const dao = new usersDAO();

export const ValidateUser = async (email, password) => {
    if (!email || !password) return false;
    if (email == ENV.ADMIN_EMAIL && password == ENV.ADMIN_PW) {
        const user = {
            _id: 0,
            first_name: "Super",
            last_name: "Admin",
            email: ENV.ADMIN_EMAIL,
            password: ENV.ADMIN_PW,
            role: "admin"
        }
        const token = newToken({
            sub: user._id,
            user: { email: user.email },
        });
        return token;
    }
    const user = await dao.getUserByEmail(email);
    if (!user) return false;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return false;
    const token = newToken({
        sub: user._id,
        user: { email: user.email },
    });
    return token;
}