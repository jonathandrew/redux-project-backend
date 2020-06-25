const User = require("../model/Users");
const bcrypt = require("bcryptjs");
const jwtHelper = require("../tokenSetup/jwtHelper");

module.exports = {
  signUp: async (req, res) => {
    try {
      let createdUser = await new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
      });

      let genSalt = await bcrypt.genSalt(12);
      let hashedPassword = await bcrypt.hash(createdUser.password, genSalt);

      createdUser.password = hashedPassword;

      await createdUser.save();

      res.json({
        message: "User created",
      });
    } catch (e) {
      res.status(500).json({
        message: "user was not created input a dbError helper",
        // dbErrorHelper(e),
      });
    }
  },
};
