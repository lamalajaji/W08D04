const express = require("express");
const usersRouter = express.Router();
const authentication = require("../middlewares/authentication");


const {
  signUp,
  login,
  getAllUsers,
  deleteUser,
} = require("../controllers/users");

usersRouter.post("/register", signUp);
usersRouter.post("/login", login);
usersRouter.get("/users", getAllUsers);
usersRouter.delete("/remove/:id", deleteUser);

module.exports = usersRouter;
