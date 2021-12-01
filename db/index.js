const mongoose = require("mongoose");
require("dotenv").config();




/// get database url from variables enviroment
DB = process.env.DB;


////options 
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};



//// mongoDB connection
mongoose.connect(DB, options).then(
  () => {
    console.log("DB Ready To Use");
  },
  (err) => {
    console.log(err);
  }
);
