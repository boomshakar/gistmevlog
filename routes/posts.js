const path = require("path");
const express = require("express");
const router = express.Router();
const moment = require("moment");
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // Its needed here so , pass it in as a second argument
const {Post} = require("../model/User"); // to use the story schema to crate a story in the database
const crypto = require("crypto");
const {GridFsStorage} = require("multer-gridfs-storage");
const multer = require("multer");
const User = require("../model/User");



// // create storagge engine
// const storage = new GridFsStorage({
//   url: process.env.MONGO_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });
// Show all stories
// GET  /post
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Post.find({})
      .populate("user")
      .populate("stories")
      .sort({ createdAt: "desc" })
      .lean();
      res.render("post/index", { stories});
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// Show add Page
// GET /posts/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("post/add-post");
});

// Process the add form
// Post /posts
router.post("/", ensureAuth, async (req, res) => {
  try {
    // const { title, postbody, status, category, postimg } =
    // req.body;
    // const title = req.body.title;
    // console.log(title);
    // res.json({file: req.file});
    await Post.create(req.body);
    console.log(req.body);
    res.redirect("/posts");
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

// Show single story
// GET /posts/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Post.findById(req.params.id).populate("user").lean();
    if (!story) {
      return res.render("error/404");
    }
    res.render("post/show-post", { story });
  } catch (error) {
    console.error(error);
    res.render("error/404");
  }
});

// Show edit Page
// GET /posts/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Post.findOne({ _id: req.params.id }).lean();

    // if (!story) {
    //   return res.render("error/404");
    // }
    // if (story.user != req.user.id) {
    //   res.redirect("/posts");
    // } else {
    //   res.render("post/edit-post", { story });
    // }
    res.render("post/edit-post", { story });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// Update Story Page
// PUT /posts/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Post.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/posts");
    } else {
      story = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/posts");
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// Delete a story
// DELETE /posts/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Post.remove({ _id: req.params.id });
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// Show User stories
// GET /post/user/:userId
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
