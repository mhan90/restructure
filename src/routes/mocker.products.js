import { Router } from "express";
import generateProduct from "../utils/products.fake.js";

const mocker = Router();

mocker.get("/", (req, res) => {
    // const products = [];
    // for (let i = 0; i < 100; i++) {
    //     products.push(generateProduct());
    // }
    // res.send({ status: "success", payload: products })
    const product = generateProduct();
    res.send({ product })
});

export default mocker;