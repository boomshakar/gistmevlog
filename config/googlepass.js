const passport = require("passport");
const UserService = require("../model/userpack/userIndex");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../model/googleuser/Googleuser");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const email = profile.emails[0].value.toLowerCase();
      const firstname = profile.name.givenName;
      const lastname = profile.name.familyName;
      const profilePhoto = profile.photos[0].value;
      const source = "google";

      try {
        const currentUser = await UserService.getUserByEmail({ email });
        if (currentUser) {
          if (currentUser.source != "google") {
            //return error
            return done(null, false, {
              message: `You have previously signed up with a different signin method`,
            });
          }
          return done(null, currentUser);
        } else {
          const newUser = await UserService.addGoogleUser({
            googleId,
            email,
            firstname,
            lastname,
            profilePhoto,
            source,
          });
          return done(null, newUser);
        }
      } catch (error) {
        console.error(error);
      }
    }
  )
);

const User = require("../model/userpack/userModel");

// for unique coookie identification
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   const currentUser = User.findOne({ id });
//   done(null, currentUser);
// });
