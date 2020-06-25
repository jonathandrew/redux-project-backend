const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function comparePassword(incomingPassword, userPassword) {
  try {
    let comparedPassword = await bcrypt.compare(incomingPassword, userPassword);
    if (comparedPassword) {
      return comparedPassword;
    } else {
      throw 409;
    }
  } catch (error) {
    return error;
  }
}

async function createJwtToken(user) {
  let payload;

  payload = {
    email: user.email,
    _id: user._id,
    username: user.username,
  };

  // let jwtToken = jwt.sign(payload, process.env.JWT_USER_SECRET_KEY, {
  //   expiresIn: "1min",
  // });

  let jwtToken = jwt.sign(payload, process.env.JWT_USER_SECRET_KEY, {
    expiresIn: "24h",
  });

  let jwtRefreshToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_USER_REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  return {
    jwtToken,
    jwtRefreshToken,
  };
}

module.exports = {
  comparePassword,
  createJwtToken,
};
