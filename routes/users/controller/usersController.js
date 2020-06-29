const Users = require("../model/Users");
const bcrypt = require("bcryptjs");
const jwtHelper = require("../tokenSetup/jwtHelper");

module.exports = {
  signUp: async (req, res) => {
    try {
      let createdUser = await new Users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      let genSalt = await bcrypt.genSalt(12);
      let hashedPassword = await bcrypt.hash(createdUser.password, genSalt);

      createdUser.password = hashedPassword;
      console.log(createdUser);
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
  signIn: async (req, res) => {
    try {
      let findUser = await Users.find({
        email: req.body.email,
      }).select("-__v -userCreated");
      console.log(findUser);
      if (findUser === null) {
        throw Error("User not found, please sign up.");
      }

      let comparedPassword = await jwtHelper.comparePassword(
        req.body.password,
        foundUser.password
      );

      if (comparedPassword === 409) {
        throw Error("Check your email and password.");
      }

      let jwtTokenObj = await jwtHelper.createJwtToken(foundUser);

      res.json({
        message: "success",
        jwtToken: jwtTokenObj.jwtToken,
        jwtRefreshToken: jwtTokenObj.jwtRefreshToken,
      });
    } catch (e) {
      res.status(500).json({
        message:
          "error using this code for signin create a db error when chance arises",
      });
    }
  },
};
