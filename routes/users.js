var express = require('express');
var router = express.Router();

const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", [
  verifySignUp.checkDuplicateEmail
],
controller.signup);

router.post("/signin", controller.signin)

module.exports = router;
