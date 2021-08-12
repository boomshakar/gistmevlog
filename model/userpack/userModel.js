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
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
