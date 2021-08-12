const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // Its needed here so , pass it in as a second argument
const Post = require("../model/Post"); // to use the story schema to crate a story in the database

// Show add Page
// GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// Process the add form
// Post /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Post.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// To Show all stories for public (to be continued)
router.get("/public", ensureGuest, async (req, res) => {
  try {
    // const publicStory = Story.find({}).sort({ createdAt: "desc" }).lean();
    Post.find({}, function (err, stories) {
      if (err) {
        console.log(err);
      } else {
        if (stories) {
          res.render("stories/public", { publicStory: stories });
        }
      }
    })
      .populate("user")
      .lean();
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Show all stories
// GET  /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Post.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", { stories });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// Show single story
// GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Post.findById(req.params.id).populate("user").lean();
    if (!story) {
      return res.render("error/404");
    }
    res.render("stories/show", { story });
  } catch (error) {
    console.error(error);
    res.render("error/404");
  }
});

// Show edit Page
// GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Post.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render("error/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// Update Story Page
// PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Post.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// Delete a story
// DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Post.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// Show User stories
// GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Post.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    res.render("stories/index", { stories });
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

module.exports = router; // Important!
