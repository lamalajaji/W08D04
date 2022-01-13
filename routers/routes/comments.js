const express = require("express");
const commentsRouter = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const {
  addComment,
  showComments,
  getPostComments,
  editComment,
  removeComment,
  removeCommentForAdmin,
} = require("../controllers/comments");


/// Routes
commentsRouter.post("/comment", authentication, addComment);
commentsRouter.get("/comments", authentication, showComments);
commentsRouter.get("/comments/:id", authentication, getPostComments);
commentsRouter.put("/comment/:id", authentication, editComment);
commentsRouter.put("/delcomment/:id", authentication, removeComment);
commentsRouter.put(
  "/deletecomment",
  authentication,
  authorization,
  removeCommentForAdmin

);



module.exports = commentsRouter;
