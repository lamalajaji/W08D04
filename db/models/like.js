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



module.exports = mongoose.model("Like", likeSchema);
