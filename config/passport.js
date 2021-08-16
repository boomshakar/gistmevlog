const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
// User model
// const User = require("../model/User");
const UserService = require("../model/userpack/userIndex");

passport.use(
  new localStrategy(async (email, password, done) => {
    //Match user
    const currentUser = await UserService.getUserByEmail({ email });
    if (!currentUser) {
      return done(null, false, {
        message: "That email is not registered",
      });
    }
    if (currentUser.source != "local") {
      return done(null, false, {
        message: `You have previously signed up with a different signin method`,
      });
    }
    // Match the password
    if (!bcrypt.compareSync(password, currentUser.password)) {
      return done(null, false, { message: `Incorrect password provided` });
    }
    return done(null, currentUser);
  })
);

const User = require("../model/User");

// for unique coookie identification
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   const currentUser = User.findOne({ id });
//   done(null, currentUser);
// });
