const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  title: { type: String },
  isDel: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },
});


module.exports = mongoose.model("Post", postSchema);

