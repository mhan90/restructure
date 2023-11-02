import __dirname from "./__dirname.js";

const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Swagger for Ecommerce Project",
            description: "web service documentation",
        },
    },
    apis: [`${__dirname}/config/docs/*.yaml`]
}

export default options;