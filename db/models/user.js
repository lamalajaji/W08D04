const mongoose = require("mongoose");

//// Users Schema:
const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  isDel: { type: Boolean, default: false },

  passowrd: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
});

const userSchema = mongoose.model("User", usersSchema);

module.exports = userSchema;
