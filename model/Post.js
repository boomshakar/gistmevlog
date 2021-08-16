const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  postbody: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  category: {
    type: String,
    default: "general",
    enum: ["general", "webdesign", "technology", "lifestyle", "photography"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, //connecting it to the user schema to get the user specific id
    ref: "User",
  },
  postimg: {
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = new mongoose.model("Post", postSchema);
module.exports = Post;
