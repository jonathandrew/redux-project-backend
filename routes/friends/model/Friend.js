const mongoose = require("mongoose");
const moment = require("moment");
const now = moment();

const FriendSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: "full-name is requred",
  },
  firstName: {
    type: String,
    trim: true,
    required: "first Name is requred",
  },
  lastName: {
    type: String,
    trim: true,
    required: "last Name is requred",
  },
  email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  mobile: {
    type: String,
    trim: true,
    required: "Mobile number is required",
  },
  birthday: {
    type: Date,
    required: "Birthday is required",
  },
  friendCreated: {
    type: String,
    default: new Date(),
  },
  friend: { type: mongoose.Schema.ObjectId, ref: "User" },
  interests: { type: Array, default: [] },
  appointments: [{ type: mongoose.Schema.ObjectId, ref: "Appointment" }],
});

module.exports = mongoose.model("Friend", FriendSchema);
