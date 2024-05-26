import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ email: username });
                if (!user) {
                    return done(null, false, { message: "User not found" });
                }
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return done(null, false, { message: "Invalid credentials" });
                }
                console.log(user);
                return done(null, user);
            } catch (err) {
                return done(err, null, { message: "Something went wrong" });
            }
        }
    )
)

passport.serializeUser((user, done) => {
    console.log(user);
  done(null, user.id);

});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log(user);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

