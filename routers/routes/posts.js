const express = require("express");
const postsRouter = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const {
  createPost,
  showPosts,
  editPost,
  getPost,
  removePost,
  addLike,
  removePostByAdmin,
} = require("../controllers/posts");


/// Routes
postsRouter.post("/post", authentication, createPost);
postsRouter.get("/posts", authentication, showPosts);
postsRouter.put("/post/:id", authentication, editPost);
postsRouter.get("/post/:id", authentication, getPost);
postsRouter.put("/postDel/:id", authentication, removePost);
postsRouter.post("/like/:id", authentication, addLike);
postsRouter.put("/delPost", authentication, authorization, removePostByAdmin);



module.exports = postsRouter;
