const errorHandler = (error, res) => {
    const response = { status: "error", msg: error };
    switch (error) {
        case "invalid page":
        case "product not found":
        case "missing data":
        case "product already exists":
            res.status(400).send(response);
            break;
        default:
            res.status(500).send(response);
    }
}

export default errorHandler;