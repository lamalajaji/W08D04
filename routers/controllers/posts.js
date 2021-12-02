const postsModel = require("./../../db/models/post");
const commentsMoedl = require("./../../db/models/comment");
const likesModel = require("./../../db/models/like")
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
      //  console.log(req);
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


////// add Like to post function 

const addLike = (req, res) => {
  const { id } = req.params;
  const { like } = req.body;

  if (like) {
    likesModel
      .findOne({ post: id, user: req.token.id })
      .then((result) => {
        if (result) {
          likesModel
            .findOneAndUpdate(
              { post: id, user: req.token.id, isLike: false },
              { like: true },
              { new: true }
            )
            .then((result) => {
              if (result) {
                res
                  .status(200)
                  .json({ message: "added like successfully" });
              } else {
                res
                  .status(404)
                  .json({ message: " There Is No Post !" });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          const newLike = new likesModel({
            post: id,
            user: req.token.id,
          });

          newLike
            .save()
            .then((result) => {
              res.status(201).json(result);
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    likesModel
      .findOneAndUpdate(
        { post: id, user: req.token.id, isLike: true },
        { like: false },
        { new: true }
      )
      .then((result) => {
        if (result) {
          res
            .status(200)
            .json({ message: " Unliked Post Successfully" });
        } else {
          res
            .status(404)
            .json({ message: "There Is No Post !" });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
};



/// delete a post by id function => soft delete 
const removePost = (req , res) => {
  const { id } = req.params;

  postsModel
    .findOneAndUpdate(
      {
        _id: id,
        isDel: false,
        createdBy: req.token.id,
      },
      {
        isDel : true
      },
      { new: true }
    )
    .then((result) => {
      if (result) {
        commentsMoedl
          .updateMany({ post: id, isDel: false }, { isDel: true })
          .then(() => {
            res.status(200).json({ message: " All Post's Comments Deleted !" });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
          likesModel
            .updateMany({ post: id, isLike: true }, { isLike: false })
            .then(() => {
              res.status(200).json({ message: " All Post's Likes Deleted !" });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
             res
               .status(200)
               .json({ message: "Post has been Deleted successfully " });

        
      } else {
        res.status(404).json({ message: " There Is No Post To Delete ! " });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

const removePostByAdmin = (req, res) => {
  const {  postId, user } = req.body;

  postsModel
    .findOneAndUpdate(
      { _id: postId, createdBy:  user, isDel: false },
      { isDel: true },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json({ message: " Post has been deleted by Admin " });
      } else {
        res.status(404).json({ message: " There Is No Comment To Delete !" });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};


module.exports = {
  createPost,
  showPosts,
  editPost,
  removePost,
  addLike,
  removePostByAdmin,
};
