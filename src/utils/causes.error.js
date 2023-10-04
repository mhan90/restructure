export const productInfoError = (product) => {
    return `One or more properties were incomplete or not valid. Expected:
    * title: type String, received ${product.title}
    * description: type String, received ${product.description}
    * price: type Number, received ${product.price}
    * code: type String, received ${product.code}
    * stock: type Number, received ${product.stock}
    * category: type String, received ${product.category}`
}

export const invalidPage = (page, totalPage) => {
    if (!page || page < 0) return 'page should be > 0';
    if (page > totalPage) return `page should be <= ${totalPage}`
}