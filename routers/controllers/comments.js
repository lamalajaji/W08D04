const commentsMoedl = require("./../../db/models/comment");
const postsModel = require("./../../db/models/post");

const addComment = (req, res) => {
  const { comment, postID } = req.body;

  const neweComment = new commentsMoedl({
    comment,
    user: req.token.id,
    post: postID,
  });

  neweComment
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

///// get all comments :
const showComments = (req, res) => {
  commentsMoedl
    .find({ user: req.token.id, isDel: false })
    .populate("post")
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "There Is No Comment!!" });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

/// edit comment function
const editComment = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  //// update
  commentsMoedl
    .findOneAndUpdate(
      {
        _id: id,
        isDel: false,
        user: req.token.id,
      },
      {
        comment,
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

const removeComment = (req, res) => {
  const { id } = req.params;
  const postID = req.body;
  //// update
  postsModel
    .findOne({ _id: postID, isDel: false })
    .then((post) => {
      if (post) {
        commentsMoedl.findOne({ _id: id, post: postID }).then((comment) => {
          if (comment) {
            if (
              comment.user == req.token.id ||
              post.createdBy == req.token.id
            ) {
              commentsMoedl
                .findByIdAndUpdate(
                  { _id: id, isDel: false, post: postID },
                  {
                    isDel: true,
                  },
                  { new: true }
                )
                .then(() => {
                  res
                    .status(200)
                    .json({ message: "commnet has been deleted !" });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            } else {
              res.status(403).json({ message: " Forbbiden !" });
            }
          } else {
            res.status(404).json({ message: " There Is No Comment !" });
          }
        });
      } else {
        res.status(404).json({ message: " There Is No Post !" });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const removeCommentForAdmin = (req, res) => {
  const { commentId, postId, user } = req.body;

  commentsMoedl
    .findOneAndUpdate(
      { _id: commentId, post: postId, user, isDel: false },
      { isDel: true },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json({ message: " comment has been deleted by Admin " });
      } else {
        res.status(404).json({ message: " There Is No Comment To Delete !" });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  addComment,
  showComments,
  editComment,
  removeComment,
  removeCommentForAdmin,
};
