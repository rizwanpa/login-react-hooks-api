const db = require("../models");
const Users = db.Users;

checkDuplicateEmail = (req, res, next) => {
  Users.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).json({
        message: "Failed! Username is already in use!"
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicateEmail
};

module.exports = verifySignUp;
