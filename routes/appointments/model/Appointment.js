"use strict";

const mongoose = require("mongoose");
const moment = require("moment");

const Twilio = require("twilio");

const AppointmentSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  notification: Number,
  timeZone: String,
  time: { type: Date, index: true },
});

AppointmentSchema.methods.requiresNotification = function (date) {
  // console.log("THIS", this);
  // console.log(this.time.toString());

  var currentDateAndTime = moment(this.time).format(
    "dddd, MMMM Do YYYY, h:mm:ss a"
  );
  var nowDateAndTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

  // console.log("currentDateAndTime", currentDateAndTime);
  // console.log("nowDateAndTime", nowDateAndTime);

  if (nowDateAndTime === currentDateAndTime) {
    console.log("NOW");
    return this;
  } else {
    console.log("Current");
  }
};

AppointmentSchema.statics.sendNotifications = function (callback) {
  // now
  const searchDate = new Date();
  Appointment.find().then(function (appointments) {
    appointments = appointments.filter(function (appointment) {
      return appointment.requiresNotification(searchDate);
    });

    //console.log(appointments);
    if (appointments.length > 0) {
      sendNotifications(appointments);
    }
  });

  async function deleteAppointmentByID(id) {
    await Appointment.findByIdAndDelete({ _id: id });
  }

  /**
   * Send messages to all appoinment owners via Twilio
   * @param {array} appointments List of appointments.
   */
  function sendNotifications(appointments) {
    const client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    appointments.forEach(function (appointment) {
      // Create options to send the message
      const options = {
        to: `+ ${appointment.phoneNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        /* eslint-disable max-len */
        body: `Hi ${appointment.fullName}. Just a reminder that you have an appointment coming up.`,
        /* eslint-enable max-len */
      };

      // Send the message!
      client.messages.create(options, async function (err, response) {
        if (err) {
          // Just log it for now
          console.error(err);
        } else {
          // Log the last few digits of a phone number
          let masked = appointment.phoneNumber.substr(
            0,
            appointment.phoneNumber.length - 5
          );
          masked += "*****";
          console.log(`Message sent to ${masked}`);

          await deleteAppointmentByID(appointment._id);
        }
      });
    });

    // Don't wait on success/failure, just indicate all messages have been
    // queued for delivery
    if (callback) {
      callback.call();
    }
  }
};
const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
