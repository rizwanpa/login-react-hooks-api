const { Users } = require("../models");
const { Op } = require("sequelize");
const config = require("../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

signup = (req, res) => {
  // Save User to Database
  Users.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

signin = (req, res) => {  
  Users.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        res.status(404).json({
          errorCode : 1,
          code : "auth/invalid-user",
          message: "The user is invalid or the user does noe exist!" 
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        res.status(401).json({
          accessToken: null,
          errorCode : 1,
          code : "auth/invalid-password",
          message: "The password is invalid or the user does not have a password!"
        });
      }

      var token = jwt.sign({ 
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        config.secret, {
          expiresIn: 86400 // 24 hours
      });

      res.status(200).json({accessToken: token});
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = {
  signup,
  signin
};
