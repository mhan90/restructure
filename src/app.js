import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import __dirname from "./config/__dirname.js";
import productsRouter from "./routes/product.router.js";
import cartsRouter from "./routes/cart.router.js";
import mainRouter from "./routes/main.router.js";
import InitPassportStrategies from "./config/passport.config.js";
import authRouter from "./routes/auth.router.js";
import loginRouter from "./routes/login.router.js";
import sessionRouter from "./routes/session.router.js";
import ENV from "./config/config.js";

// Setting MongoDB
const conn = await mongoose.connect(ENV.MONGODB_URL);
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
    mongoUrl: ENV.MONGODB_URL,
    ttl: 3600
  }),
  ttl: 3600
}));
// Passport config
InitPassportStrategies();
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
app.use("/api/login", loginRouter)
app.use("/api/sessions", sessionRouter);
// Listen
app.listen(8080, () => {
  console.log("Server is now listening at port: 8080.");
});