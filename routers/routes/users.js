const express = require("express");
const usersRouter = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");


const {
  signUp,
  verifyAccount,
  checkTheEmail,
  loginWithGoogle,
  resetPassword,
  login,
  getAllUsers,
  deleteAccount,
  deleteUser,
} = require("../controllers/users");


/// Routes
usersRouter.post("/register", signUp);
usersRouter.post("/verify", verifyAccount);
usersRouter.post("/check", checkTheEmail);
usersRouter.post("/reset_password", resetPassword);
usersRouter.post("/login", login);
usersRouter.post("/googlelogin", loginWithGoogle);

usersRouter.delete("/remove", authentication, deleteAccount);
usersRouter.get("/users",  getAllUsers);
usersRouter.delete("/remove/:id", authentication, authorization, deleteUser);

module.exports = usersRouter;
