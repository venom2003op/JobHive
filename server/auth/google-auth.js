import GoogleStrategy from 'passport-google-oauth20';
GoogleStrategy.Strategy;
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "http://localhost:8050/api/v2/employees/auth/google/callback",
      scope: ["profile", "email"],  
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }  
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

