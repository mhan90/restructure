export default class CustomError {
    static newError({ message, cause, name = "Error", code = 1 }) {
        const error = new Error(message, { cause });
        error.name = name;
        error.code = code;

        throw error;
    }
}