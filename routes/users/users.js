var express = require("express");
var router = express.Router();
const userController = require("./controller/usersController");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("this is the users route using get");
});

router.post("/signin", userController.signIn);

router.post("/sign-up", userController.signUp);

module.exports = router;
