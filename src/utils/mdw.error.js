import EErrors from "./enum.error";

const ErrorHandler = (error, req, res, next) => {
    const response = { status: "error" };
    switch (error.code) {
        case EErrors.USER_INPUT_ERROR:
            response.message = error.message
            response.cause = error.cause;
            res.status(400).send(response);
            break;
        case EErrors.DATABASE_ERROR:
            console.log(error);
            res.status(500);
            break;
        default:
            console.log(error);
            response.msg = "unhandled error/promise";
            res.status(500).send(response);
    }
}