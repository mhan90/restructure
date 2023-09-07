const cookieExtrator = (req) => {
    const token = req.cookies.token;

    return token ?? null;
};

export default cookieExtrator;