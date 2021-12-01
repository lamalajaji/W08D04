const mongoose = require("mongoose");


//// Role Schema
const rolesSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  permissions: {
    type: Array,
    required: true,
  },
});

const rolesModel = mongoose.model("Role", rolesSchema);

module.exports = rolesModel;
