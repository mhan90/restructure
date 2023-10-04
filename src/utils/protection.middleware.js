export const protectView = (req, res, next) => {
    if (!req.user) return res.redirect("/login");
    next();
};
export const isLogged = (req, res, next) => {
    if (req.session.user) return res.redirect("/products");
    next();
};

export const permissions = (role) => (req, res, next) => {
    if (req.user.role == role) {
        next();
    } else {
        res.sendStatus(403);
    }
}