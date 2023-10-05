export default class CustomError2 {
    static create({ message, cause, name = "Error", code = 1 }) {
        const error = new Error(message);
        error.name = name;
        error.code = code;
        error.cause = cause;
        throw error;
    }
}