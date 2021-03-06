const mongoose = require("mongoose");

//// likes schema
const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  isDel: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});


module.exports = mongoose.model("Comment", commentSchema);
