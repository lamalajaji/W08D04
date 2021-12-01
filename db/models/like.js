const mongoose = require("mongoose");



//// likes schema
const likeSchema = new mongoose.Schema({
  isLike: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post" }
  
});

const likeSchema = mongoose.model("Like", likeSchema);

module.exports = likeSchema;
