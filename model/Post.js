const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, //connecting it to the user schema to get the user specific id
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Story = new mongoose.model("Story", storySchema);
module.exports = Story;
