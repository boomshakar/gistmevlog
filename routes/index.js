const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

// Public story/ Landing Page
// GET  /
router.get("/", (req, res) => {
  res.render("public-post", {
    layout: "./layouts/public",
  });
});
// Dashboard
// GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    res.render("dashboard", { name: "NotYet" });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
