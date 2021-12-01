const postsModel = require("./../../db/models/post");

//// create a post by user
const createPost = (req, res) => {
  const { desc, title, img } = req.body;

  const newePost = new postsModel({
    desc,
    title,
    img,
    createdBy: req.token.id,
  });

  newePost
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};


///// get all posts :
const showPosts = (req, res) => {
  postsModel
    .find({ createdBy: req.token.id, isDel: false })
    .populate("createdBy")
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "There Is No Posts!!" });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};


module.exports = { createPost, showPosts };
