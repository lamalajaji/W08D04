const express = require("express");
require("dotenv").config();
const app = express();
const db = require("./db");
const morgan = require("morgan");



/// app Level Middleware
app.use(express.json());
///// morgan middleware
app.use(morgan("dev"));


//// craete a middleware for roles router
const rolesRouter = require("./routers/routes/roles");
app.use(rolesRouter);

//// create a middleware for users router
const usersRouter = require("./routers/routes/users");
app.use(usersRouter);

//// create a middleware for posts router
const postsRouter = require("./routers/routes/posts");
app.use(postsRouter);

///// create a middleware for comments routers
const commentsRouter = require("./routers/routes/comments");
app.use(commentsRouter);


//// PORT
PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Started On ${PORT}`);
});