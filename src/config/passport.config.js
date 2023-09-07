import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { SECRET } from "../utils/jwt.js";
import UserManager from "../dao/mongo/UserManager.js";
import dotenv from "dotenv";
import cookieExtrator from "../utils/cookieJWT.js";
dotenv.config();

const User = new UserManager();

const InitPassportStrategies = () => {
    // local register
    passport.use(
        "register",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, email, password, done) => {
                const isValid = await User.getUserByEmail(email);

                if (isValid) return done(null, false);

                const { first_name, last_name, age } = req.body;

                const user = await User.newUser({
                    first_name,
                    last_name,
                    email,
                    age,
                    password,
                    role: email == "adminCoder@coder.com" ? "admin" : "user",
                });

                return done(null, user.toObject());
            }
        )
    );

    // local login
    passport.use(
        "login",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, email, password, done) => {
                const user = await User.validateUser(email, password);
                if (!user) return done("Invalid email/password combination");
                return done(null, user);
            }
        )
    );

    // Github login
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: process.env.GIT_ID,
                clientSecret: process.env.GIT_SECRET,
                callbackURL: "http://localhost:8080/api/auth/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                const email = profile._json.email;
                const user = await User.getUserByEmail(email);
                if (user) return done(null, user);
                const newUser = await User.newUser({
                    first_name: profile._json.name.split(" ")[0],
                    last_name: profile._json.name.split(" ")[1],
                    email: profile._json.email,
                    password: "",
                    role: profile._json.email == "adminCoder@coder.com" ? "admin" : "user",
                });
                done(null, newUser);
            }
        )
    );

    // JWT 
    passport.use(
        "jwt",
        new jwt.Strategy(
            {
                jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtrator]),
                // jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: SECRET,
            },
            async (payload, done) => {
                const user = await User.getUserByID(payload.sub);
                if (!user) return done("Unauthorized");
                return done(null, user);
            }
        )
    );

    passport.serializeUser((user, done) => {
        // console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.getUserByID(id);
            done(null, user);
        } catch (e) {
            done(null, false);
        }
    });
};
export default InitPassportStrategies;