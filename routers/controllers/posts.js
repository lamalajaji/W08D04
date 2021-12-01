const postsModel = require("./../../db/models/post");
const commentsMoedl = require("./../../db/models/comment");

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

///// edit a post function => By id

const editPost = (req, res) => {
  const { id } = req.params;
  const { desc, img } = req.body;
  //// update
  postsModel
    .findOneAndUpdate(
      {
        _id: id,
        isDel: false,
        createdBy: req.token.id,
      },
      {
        desc,
        img,
      },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: " No Result ! " });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

///// delete a post by id function => soft delete 
// const removePost = (req , res) => {
//   const { id } = req.params;

//   postsModel
//     .findOneAndUpdate(
//       {
//         _id: id,
//         isDel: false,
//         createdBy: req.token.id,
//       },
//       {
//         isDel : true
//       },
//       { new: true }
//     )
//     .then((result) => {
//       if (result) {

//         res.status(200).json(result);
//       } else {
//         res.status(404).json({ message: " There Is No Post To Delete ! " });
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// }
module.exports = { createPost, showPosts, editPost  };
