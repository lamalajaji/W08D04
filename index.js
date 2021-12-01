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



//// PORT
PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Started On ${PORT}`);
});