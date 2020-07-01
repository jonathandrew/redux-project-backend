const Friend = require("../model/Friend");
const User = require("../../users/model/User");
const dbErrorHelper = require("../../lib/dbErrorHelpers/dbErrorHelper");

module.exports = {
  createFriend: async (req, res) => {
    try {
      const newFriend = new Friend({
        interests: req.body.interests,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fullName: `${req.body.firstName} ${req.body.lastName}`,
        email: req.body.email,
        mobile: req.body.mobile,
        birthday: req.body.birthday,
        friend: req.user._id,
      });

      const savedUser = await newFriend.save();

      const foundUser = await User.findById({ _id: req.user._id });

      foundUser.friends.push(savedUser._id);

      res.json(savedUser);
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },
  getAllFriends: async (req, res) => {
    try {
      let allFriends = await Friend.find({ friend: req.user._id });

      res.json(allFriends);
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },
};
