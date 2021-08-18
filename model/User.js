const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  username: {
    type: String,
    required: false,
  },
  profilePhoto: String,
  password: String,
  source: { type: String, required: [true, "source not specified"] },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastVisited: { type: Date, default: new Date() },
  stories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

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
    type: mongoose.Schema.Types.ObjectId,
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

const Post =  mongoose.model("Post", postSchema);
const User =  mongoose.model("User", userSchema);
module.exports = {User, Post};
