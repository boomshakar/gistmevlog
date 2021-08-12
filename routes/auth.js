const express = require("express");
const passport = require("passport");
const router = express.Router();

// Auth with google
// GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google auth callback
// GET /auth/google/callback
router.get(
  "/google/callback",
  // passport.authenticate("google", { failureRedirect: "/login" }),
  // (req, res) => {
  //   // Successful authentication, redirect home.
  //   res.redirect("/dashboard");
  // }
  passport.authenticate("google", {
    failureRedirect: "/users/login",
    successRedirect: "/dashboard",
    failureFlash: true,
    successFlash: "Successfully logged in!",
  })
);

module.exports = router;
