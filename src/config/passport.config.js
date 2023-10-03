import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import UserManager from "../dao/mongo/managers/UserManager.js";
import cookieExtrator from "../utils/cookieJWT.js";
import ENV from "../config/config.js";

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
                const user = (email == ENV.ADMIN_EMAIL && password == ENV.ADMIN_PW)
                    ? {
                        _id: 0,
                        first_name: "Super",
                        last_name: "Admin",
                        email: ENV.ADMIN_EMAIL,
                        password: ENV.ADMIN_PW,
                        role: "admin"
                    }
                    : await User.validateUser(email, password);
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
                clientID: ENV.GIT_ID,
                clientSecret: ENV.GIT_SECRET,
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
                secretOrKey: ENV.JWT_SECRET,
            },
            async (payload, done) => {
                const user = (payload.sub == 0)
                    ? {
                        _id: 0,
                        first_name: "Super",
                        last_name: "Admin",
                        email: ENV.ADMIN_EMAIL,
                        password: ENV.ADMIN_PW,
                        role: "admin"
                    }
                    : await User.getUserByID(payload.sub);
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