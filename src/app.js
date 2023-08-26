import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import dotenv from "dotenv";
import __dirname from "./config/__dirname.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import mainRouter from "./routes/main.js";
import InitPassportStrats from "./config/passport.config.js";
import authRouter from "./routes/auth.js";

// Setting MongoDB
dotenv.config();
const conn = await mongoose.connect(process.env.MONGODB_URL);
// Setting express
const app = express();
// Body middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Cookies config
app.use(cookieParser());
// Session config
app.use(session({
  secret: "coderHouseSecretKey",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URL,
    ttl: 3600
  }),
  ttl: 3600
}));
// Passport config
InitPassportStrats();
app.use(passport.initialize());
app.use(passport.session());
// Static content
app.use(express.static(`${__dirname}/public`));
// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
// Router
app.use("/", mainRouter);
app.use("/api/auth", authRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// Listen
app.listen(8080, () => {
  console.log("Server is now listening at port: 8080.");
});