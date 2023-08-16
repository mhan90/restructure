import express from "express";
import mongoose from "mongoose";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import handlebars from "express-handlebars";
import dotenv from "dotenv";
import __dirname from "./config/__dirname.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import mainRouter from "./routes/main.js";

// Setting DB
dotenv.config();
const conn = await mongoose.connect(process.env.MONGODB_URL);
// Setting express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static content
app.use(express.static(`${__dirname}/public`));
// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
//  Setting up server with http
const httpServer = HttpServer(app);
// Socket wrapper
const io = new SocketServer(httpServer);
// Middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});
//  Router
app.use("/", mainRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// Socket methods

// Listen
httpServer.listen(8080, () => {
  console.log("Server is now listening at port: 8080.");
});