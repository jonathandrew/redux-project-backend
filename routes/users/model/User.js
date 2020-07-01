const mongoose = require("mongoose");
const moment = require("moment");
const now = moment();

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: "username is requred",
    unique: "Username already exists",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  password: {
    type: String,
    required: "password is required",
  },
  userCreated: {
    type: Date,
    default: new Date(),
    //now.format("dddd, MMMM Do YYYY, h:mm:ss a")
    //moment("2020-06-08T04:55:09.034Z").format('dddd, MMMM Do YYYY, h:mm:ss a');
  },
  friends: [{ type: mongoose.Schema.ObjectId, ref: "Friend" }],
});

module.exports = mongoose.model("User", UserSchema);
