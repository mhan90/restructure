import * as cause from "../utils/causes.error.js";
import EErrors from "./enum.error";

class CustomError {
    static newError({ message, cause, name = "Error", code = 1 }) {
        const error = new Error(message, { cause });
        error.name = name;
        error.code = code;
        throw error;
    }
}

export const newProductError = (product) => {
    return new CustomError({
        message: 'product was not added',
        cause: cause.productInfoError(product),
        name: 'new product error',
        code: EErrors.USER_INPUT_ERROR
    })
}

export const productExists = (code) => {
    return new CustomError({
        message: 'product already exists',
        cause: `product with code ${code} already exists`,
        name: 'new product error',
        code: EErrors.USER_INPUT_ERROR
    })
}

export const notFound = (item, id) => {
    return new CustomError({
        message: `${item} not found`,
        cause: `${item} with id ${id} not found`,
        name: `${item} not found`,
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const missingData = (item) => {
    return new CustomError({
        message: `missing ${item}`,
        cause: `expecting ${item}`,
        name: `missing ${item}`,
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const invalid = (item, id) => {
    return new CustomError({
        message: `invalid ${item}`,
        cause: `${item} with id ${id} is not valid`,
        name: `invalid ${item}`,
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const invalidPage = (page, totalPage) => {
    return new CustomError({
        message: 'invalid page',
        cause: cause.invalidPage(page, totalPage),
        name: 'invalid page',
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const prodCartNotFound = (pid, cid) => {
    return new CustomError({
        message: "product not found at cart",
        cause: `product: ${pid} not found at cart: ${cid}`,
        name: "product not found at cart",
        code: EErrors.USER_INPUT_ERROR,
    })
}