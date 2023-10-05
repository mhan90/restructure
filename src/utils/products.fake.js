import { faker } from "@faker-js/faker";

export default function generateProduct() {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnails: [faker.image.avatar()],
        code: faker.commerce.isbn(),
        stock: faker.finance.amount(undefined, undefined, 0),
        category: faker.commerce.department(),
        status: faker.datatype.boolean()
    }
}