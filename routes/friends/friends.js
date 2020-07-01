var express = require("express");
var router = express.Router();
var passport = require("passport");
const friendController = require("./controller/friendsController");

/* GET users listing. */
router.get(
  "/get-all-friends",
  passport.authenticate("jwt-user", { session: false }),
  friendController.getAllFriends
);

router.post(
  "/create-friend",
  passport.authenticate("jwt-user", { session: false }),
  friendController.createFriend
);

module.exports = router;
