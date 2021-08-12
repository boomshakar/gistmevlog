const passport = require("passport");
const User = require("../model/userpack/userModel");

// for unique coookie identification
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const currentUser = User.findOne({ id });
  done(null, currentUser);
});
// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });
