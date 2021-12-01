const express = require("express");
const postsRouter = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const {
  createPost,
  showPosts,
  // editPost,
  // removePost,
} = require("../controllers/posts");

postsRouter.post("/post", authentication,  createPost);
postsRouter.get("/posts", authentication, showPosts);
// postsRouter.put("/post/:id", editPost);
// postsRouter.delete("/post/:id", removePost);

module.exports = postsRouter;
