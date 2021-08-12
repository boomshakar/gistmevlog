const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//after validation is passsed, require your User model
const User = require("../model/userpack/userIndex");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Login page
// GET /users/login
router.get("/login", ensureGuest, (req, res) => {
  res.render("signin", { layout: "./layouts/logging" });
});

// Login a user using the local strategy created in congig/passport.js
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Registration page
// GET /users/register
router.get("/register", ensureGuest, (req, res) => {
  res.render("signup", { layout: "./layouts/logging" });
});

// Login page & Registration page
// post /usersregister
router.post("/register", async (req, res) => {
  // doing some little validations
  const { firstname, lastname, username, email, password, password2 } =
    req.body;
  let errors = [];

  //check required fields
  if (
    !firstname ||
    !lastname ||
    !username ||
    !email ||
    !password ||
    !password2
  ) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // check if passwords do not match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("signup", {
      errors,
      firstname,
      lastname,
      username,
      email,
      password,
      password2,
    });
  } else {
    try {
      //Validation Passed, call the user model
      const currentUser = await User.getUserByEmail({ email: email });
      if (currentUser) {
        //user exist
        errors.push({ msg: "Email is already registered" });
        res.render("signup", {
          errors,
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      } else {
        const newUser = await User.addLocalUser({
          firstname,
          lastname,
          username,
          email: email.toLowerCase(),
          password,
          source: "local",
        });
        // hash&slat password with bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save the new user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

// Logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are now logged out");
  res.redirect("/users/login");
});

module.exports = router;
