const usersModel = require("./../../db/models/user");
const postsModel = require("./../../db/models/post");
const commentsMoedl = require("./../../db/models/comment");
const likesModel = require("./../../db/models/like");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Secret = process.env.SECRET;
const SALT = Number(process.env.SALT);
//// signUp function
const signUp = async (req, res) => {
  const { email, userName, password, avatar, role } = req.body;

  const emailLC = email.toLowerCase();
  const usernameLC = userName.toLowerCase();

  const userExist = await usersModel.findOne({
    $or: [{ email: emailLC }, { userName: usernameLC }],
  });

  if (!userExist) {
    const hashPass = await bcrypt.hash(password, SALT);

    let activeCode = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++) {
      activeCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.WORD,
      },
    });
    const newUser = new usersModel({
      email: emailLC,
      userName: usernameLC,
      password: hashPass,
      avatar,
      // passwordCode: "",
      activeCode,
      role,
    });
    newUser.save().then((result) => {
      res.status(201).json(result);
      transporter
        .sendMail({
          from: process.env.EMAIL,
          to: emailLC,
          subject: "Email Confirmation",
          html: `<h2> Hello ${usernameLC}</h2>
         
          <p>  Your Verifiction Code : [ ${activeCode} ] </p>
          <h4> Thank You </h4>
          `,
        })
        .catch((error) => {
          res.status(400).json(error);
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    });
  } else {
    res.send({ message: "Email or Username already exist! " });
  }
};

const verifyAccount = async (req, res) => {
  const { id, code } = req.body;

  const user = await usersModel.findById(id);
  if (user) {
    if (user.activeCode == code) {
      usersModel
        .findByIdAndUpdate(
          id,
          { isActive: true, activeCode: "" },
          { new: true }
        )
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    } else {
      res.status(404).json("Incorrect Confirmation Code! ");
    }
  }
};

////// login function
const login = (req, res) => {
  const { identity, password } = req.body;

  //  const savedEmail = email.toLowerCase();
  //     console.log(email.toLowerCase());

  // const identityLC = identity.toLowerCase();

  usersModel
    .findOne({
      $or: [{ email: identity }, { userName: identity }],
    })
    .populate("role")
    .then(async (result) => {
      if (result) {
        if (result.isDel === false) {
          if (result.email == identity || result.userName == identity) {
            if (result.isActive == true) {
              const savedPassword = await bcrypt.compare(
                password,
                result.password
              );

              if (savedPassword) {
                const payload = {
                  id: result._id,
                  email: result.email,
                  username: result.userName,
                  isDel: result.isDel,
                  role: result.role,
                };
                const options = {
                  expiresIn: "60m",
                };
                const token = jwt.sign(payload, Secret, options);
                //  console.log(result);

                res.status(200).json({ result, token });
              } else {
                res
                  .status(400)
                  .json({ message: "Incorrect Username or Password !" });
              }
            } else {
              res
                .status(403)
                .json({ message: "This Email Is Not Activated Yet !" });
            }
          } else {
            res
              .status(404)
              .json({ message: " Email Or Username Doesn't Exist !" });
          }
        }
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });

  // if (email) {
  //

  //
  //     .
  //     .then(async (result) => {
  //       if (result) {
  //         if (result.email == savedEmail) {
  //           // console.log(result, "here");
  //           console.log(passowrd, result.password);
  //

  //
  //           if (savedPassword) {
  //
  //             res.status(200).json({ result, token });
  //           } else {
  //             res.status(400).json("Wrong email or password!");
  //           }
  //         } else {
  //           res.status(400).json("Wrong email or password!");
  //         }
  //       } else {
  //         res.status(404).json("Email does not exist!");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(400).json(err);
  //     });
  // }
  // if (userName) {
  //   usersModel
  //     .findOne({ userName: userName })
  //     .then(async (result) => {
  //       if (result) {
  //         if (result.userName == userName) {
  //           const savedPassword = await bcrypt.compare(
  //             passowrd,
  //             result.password
  //           );
  //           const payload = {
  //             id: result._id,
  //             isDel: result.isDel,
  //             role: result.role,
  //           };

  //           if (savedPassword) {
  //             let token = jwt.sign(payload, Secret);
  //             res.status(200).json({ result, token });
  //           } else {
  //             res.status(400).json("Wrong Username or password!");
  //           }
  //         } else {
  //           res.status(400).json("Wrong Username or password!");
  //         }
  //       } else {
  //         res.status(404).json(" Username does not exist!");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(400).json(err);
  //     });
  // }
  //  if else {
  //   res.status(404).json({ message: " Invalid inputs" });
  // }
};

//// to reset user's password first we must check user's email :
const checkTheEmail = async (req, res) => {
  const { email } = req.body;

  const exist = await usersModel.findOne({ email });
  if (exist) {
    let resetCode = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++) {
      resetCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    usersModel
      .findByIdAndUpdate(exist._id, { resetCode }, { new: true })
      .then((result) => {
        transporter.sendMail({
          from: process.env.EMAIL,
          to: result.email,
          subject: "Reset Password",
          html: `<h2> Hello ${result.userName} </h2>
         
          <p>  This Code To Reset Your Password : [ ${resetCode} ] 
          <a href=http://localhost:3000/reset_password/${result._id}> Click here</a> And Enter the Code 
          </p>

          <h4> Thank You </h4>
          `,
        });
        res.status(200).json({ result });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(404).json({ message: "Invalid Email !" });
  }
};

///// after we check if the email valid or not , now reset the password :
const resetPassword = async (req, res) => {
  const { id, code, password } = req.body;

  const user = await usersModel.findOne({ _id: id });

  if (user.resetCode == code) {
    const savedPassword = await bcrypt.hash(password, SALT);
    usersModel
      .findByIdAndUpdate(
        id,
        { password: savedPassword, resetCode: "" },
        { new: true }
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(404).json({ message: "Incorrect Code !" });
  }
};

//// get All users function:
const getAllUsers = (req, res) => {
  usersModel
    .find({ isDel: false })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

////// delete an acoount => soft delete

const deleteAccount = (req, res) => {
  usersModel
    .findByIdAndUpdate(req.token.id, { isDel: true })
    .then((result) => {
      if (result) {
        postsModel
          .updateMany(
            { createdBy: req.token.id, isDel: false },
            { isDel: true }
          )
          .then(() => {
            res.status(200).json({
              message: "All posts for this account has been deleted ",
            });
          })
          .catch((error) => {
            res.status(400).json(error);
          });
        commentsMoedl
          .updateMany({ user: req.token.id, isDel: false }, { isDel: true })
          .then(() => {
            res.status(200).json({
              message: "All comments for this account has been deleted ",
            });
          })
          .catch((error) => {
            res.status(400).json(error);
          });
        likesModel
          .updateMany({ user: req.token.id, isLike: true }, { isLike: false })
          .then(() => {
            res.status(200).json({
              message: "All likes for this account has been deleted ",
            });
          })
          .catch((error) => {
            res.status(400).json(error);
          });
        res
          .status(200)
          .json({ message: "This User has been deleted successfully" });
      } else {
        res.status(404).json({ message: "There Is No User With This ID !" });
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

////// delete users function :
const deleteUser = (req, res) => {
  const { id } = req.params;

  usersModel
    .findOneAndUpdate({ _id: id, isDel: false }, { isDel: true }, { new: true })
    .then((result) => {
      if (result) {
        res.send("this user has been removed!");
      } else {
        res.status(404).json({ message: " There Is No User To Remove!" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = {
  signUp,
  verifyAccount,
  checkTheEmail,
  resetPassword,
  login,
  getAllUsers,
  deleteUser,
  deleteAccount,
};
