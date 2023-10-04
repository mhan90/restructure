export class Create {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.price = Number(data.price);
        this.thumbnails = data.thumbnails;
        this.code = data.code;
        this.stock = Number(data.stock);
        this.category = data.category;
        this.status = data.status.toLowerCase() === "true"; //parse to boolean
    }
}

export class Update {
    constructor(data) {
        if (data.title) this.title = data.title;
        if (data.description) this.description = data.description;
        if (data.price) this.price = Number(data.price);
        if (data.thumbnails) this.thumbnails = data.thumbnails;
        if (data.code) this.code = data.code;
        if (data.stock) this.stock = Number(data.stock);
        if (data.category) this.category = data.category;
        if (data.status) this.status = data.status.toLowerCase() === "true"; //parse to boolean
    }
}

export const addURL = (query, limit, sort, host, url, products) => {
    url += "?";
    if (query) url += `query=${query}&`;
    if (sort) url += `sort=${sort}&`;
    if (products.hasPrevPage) {
        url += `limit=${limit}&page=${products.prevPage}`;
        products.prevLink = new URL(url, `http://${host}`)
    } else {
        products.prevLink = null;
    }
    if (products.hasNextPage) {
        url += `limit=${limit}&page=${products.nextPage}`;
        products.nextLink = new URL(url, `http://${host}`)
    } else {
        products.nextLink = null;
    }
    return products;
}