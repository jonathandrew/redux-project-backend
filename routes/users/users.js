var express = require("express");
var router = express.Router();
var userController = require("./controller/userController");
var passport = require("passport");
/* GET users listing. */

router.get(
  "/",
  passport.authenticate("jwt-user", { session: false }),
  function (req, res, next) {
    console.log(req.user);
    res.send("From User");
  }
);

router.post("/sign-up", userController.signUp);

router.post("/login", userController.login);

router.post("/mylist", userController.test);

module.exports = router;
