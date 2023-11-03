import __dirname from "./__dirname.js";

const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Ecommerce REST API",
            description: "Documentation",
        },
    },
    apis: [`${__dirname}/config/docs/*.yaml`]
}

export default options;