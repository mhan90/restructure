export const removePW = (user) => {
    delete user.password;
    delete user.role;
    return user;
}