const usersModel = require("./../../db/models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT = Number(process.env.SALT);

const Secret = process.env.SECRET;

//// signUp function
const signUp = async (req, res) => {
  const { email, userName, password, avatar, role } = req.body;

  const hashPass = await bcrypt.hash(password, SALT);

  const newUser = new usersModel({
    email: email.toLowerCase(),
    userName,
    password: hashPass,
    avatar,
    role,
  });
  newUser
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

////// login function
const login = (req, res) => {
  const { email, userName, passowrd } = req.body;

  //  const savedEmail = email.toLowerCase();
  //     console.log(email.toLowerCase());
  if (email) {
    const savedEmail = email.toLowerCase();

    usersModel
      .findOne({ email: savedEmail })
      .then(async (result) => {
        if (result) {
          if (result.email == savedEmail) {
            // console.log(result, "here");
            console.log(passowrd, result.password);
            const savedPassword = await bcrypt.compare(
              passowrd,
              result.password
            );

            const payload = {
              id: result._id,
              isDel: result.isDel,
              role: result.role,
            };
            if (savedPassword) {
              let token = jwt.sign(payload, Secret);
              res.status(200).json({ result, token });
            } else {
              res.status(400).json("Wrong email or password!");
            }
          } else {
            res.status(400).json("Wrong email or password!");
          }
        } else {
          res.status(404).json("Email does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
  if (userName) {
    usersModel
      .findOne({ userName: userName })
      .then(async (result) => {
        if (result) {
          if (result.userName == userName) {
            const savedPassword = await bcrypt.compare(
              passowrd,
              result.password
            );
            const payload = {
              id: result._id,
              isDel: result.isDel,
              role: result.role,
            };

            if (savedPassword) {
              let token = jwt.sign(payload, Secret);
              res.status(200).json({ result, token });
            } else {
              res.status(400).json("Wrong Username or password!");
            }
          } else {
            res.status(400).json("Wrong Username or password!");
          }
        } else {
          res.status(404).json(" Username does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
  //  if else {
  //   res.status(404).json({ message: " Invalid inputs" });
  // }
};

//// get All users function:
const getAllUsers = (req, res) => {
  usersModel
    .find({})
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
