import CustomError from "./error.js";
import * as cause from "./causes.error.js";
import EErrors from "./enum.error.js";

/* class CustomError {
    static create({ message, cause, name = "Error", code = 1 }) {
        const error = new Error(message, { cause });
        error.name = name;
        error.code = code;
        throw error;
    }
}
 */
export const newProductError = (product) => {
    CustomError.create({
        message: 'product was not added',
        cause: cause.productInfoError(product),
        name: 'new product error',
        code: EErrors.USER_INPUT_ERROR
    })
}

export const productExists = (code) => {
    CustomError.create({
        message: 'product already exists',
        cause: `product with code ${code} already exists`,
        name: 'new product error',
        code: EErrors.USER_INPUT_ERROR
    })
}

export const notFound = (item, id) => {
    CustomError.create({
        message: `${item} not found`,
        cause: `${item} with id ${id} not found`,
        name: `${item} not found`,
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const missingData = (item) => {
    CustomError.create({
        message: `missing ${item}`,
        cause: `expecting ${item}`,
        name: `missing ${item}`,
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const invalid = (item, id) => {
    CustomError.create({
        message: `invalid ${item}`,
        cause: `${item} with id ${id} is not valid`,
        name: `invalid ${item}`,
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const invalidPage = (page, totalPage) => {
    CustomError.create({
        message: 'invalid page',
        cause: cause.invalidPage(page, totalPage),
        name: 'invalid page',
        code: EErrors.USER_INPUT_ERROR,
    })
}

export const prodCartNotFound = (pid, cid) => {
    CustomError.create({
        message: "product not found at cart",
        cause: `product: ${pid} not found at cart: ${cid}`,
        name: "product not found at cart",
        code: EErrors.USER_INPUT_ERROR,
    })
}