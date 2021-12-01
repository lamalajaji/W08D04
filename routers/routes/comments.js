const express = require("express");
const commentsRouter = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const {
  addComment,
  showComments,
  editComment,
  removeComment,
  removeCommentForAdmin,
} = require("../controllers/comments");

commentsRouter.post("/comment", authentication, addComment);
commentsRouter.get("/comments", authentication, showComments);
commentsRouter.put("/comment/:id", authentication, editComment);
commentsRouter.put("/delcomment/:id", authentication, removeComment);
commentsRouter.put(
  "/deletecomment",
  authentication,
  authorization,
  removeCommentForAdmin

);



module.exports = commentsRouter;
