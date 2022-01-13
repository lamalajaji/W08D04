const express = require("express");
const rolesRouter = express.Router();

const { newRole, getRoles } = require("../controllers/roles");


/// Routes
rolesRouter.post("/role", newRole);
rolesRouter.get("/roles", getRoles);

module.exports = rolesRouter;
