const express = require("express");
const usersRouter = express.Router();


const {
  signUp,
  login,
  
} = require("../controllers/users");

usersRouter.post("/register", signUp);
usersRouter.post("/login", login);


module.exports = usersRouter;
