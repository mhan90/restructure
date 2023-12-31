import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import __dirname from "./config/__dirname.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import mainRouter from "./routes/main.router.js";
import InitPassportStrategies from "./config/passport.config.js";
import authRouter from "./routes/auth.router.js";
import loginRouter from "./routes/login.router.js";
import sessionRouter from "./routes/session.router.js";
import ENV from "./config/dotenv.config.js";
import ErrorHandler from "./utils/mdw.error.js";
import mocker from "./routes/mocker.products.js";
import logger from "./config/loggers/prod.config.js";
import loggerTest from "./routes/loggerTest.js";
import cluster from "cluster";
import { cpus } from "os";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import swgConf from "./config/swagger.js";

// Setting express
const app = express();

// Swagger
const specs = swaggerJSDoc(swgConf);

// Body middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
app.use("/api/mockingproducts", mocker);
app.use("/api/loggerTest", loggerTest);
app.use("/api/docs", serve, setup(specs));
app.use(ErrorHandler);
// Listen
if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) cluster.fork();

} else {
  app.listen(ENV.PORT, (req) => {
    logger.info(`Worker ${process.pid} is now listening at port: ${ENV.PORT} - ${new Date().toUTCString()}.`)
  });
}
