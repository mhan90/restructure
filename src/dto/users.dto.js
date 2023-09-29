export const removePW = (user) => {
    delete user.password;
    return user;
}