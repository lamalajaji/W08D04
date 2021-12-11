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

  if (userExist) {
    const hashPass = await bcrypt.hash(password, SALT);

    let activeCode = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++) {
      activeCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    let transporter = nodemailer.createTransport({
      service: "Gmail",
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
      passwordCode: "",
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
          html: `<h1> Hello ${usernameLC}</h1>
          <p>  Please  <a href=http://localhost:3000/verify_account/${result._id}> Click Here </a> to Active your email , and Enter this Code : ${activeCode}  to confirm your account  </p>
          <h2> Thank You </h2>
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

  const user = await usersModel.findOne({ _id: id });
  if (user.activeCode == code) {
    usersModel
      .findByIdAndUpdate(id, { isActive: true, activeCode: "" }, { new: true })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(404).json("Incorrect Confirmation Code! ");
  }
};

////// login function
const login = (req, res) => {
  const { identity, passowrd } = req.body;

  //  const savedEmail = email.toLowerCase();
  //     console.log(email.toLowerCase());

  const identityLC = identity.toLowerCase();

  usersModel
    .findOne({
      $or: [{ email: identityLC }, { userName: identityLC }],
    })
    .populate("role")
    .then(async (result) => {
      if (result) {
        if (result.isDel === false) {
          if (result.email == identityLC || result.userName == identityLC) {
            const savedPassword = await bcrypt.compare(
              passowrd,
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
                expires: "60m",
              };
              let token = jwt.sign(payload, Secret, options);

              res.status(200).json({ result, token });
            } else {
              res
                .status(400)
                .json({ message: "Incorrect Username or Password !" });
            }
          } else {
            res
              .status(404)
              .json({ message: "This Email Is Not Activated Yet !" });
          }
        } else {
          res
            .status(404)
            .json({ message: " Email Or Username Doesn't Exist !" });
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

//// get All users function:
const getAllUsers = (req, res) => {
  usersModel
    .find({isDel : false})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
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

module.exports = { signUp, login, getAllUsers, deleteUser };
