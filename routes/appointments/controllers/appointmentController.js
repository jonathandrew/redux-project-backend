const moment = require("moment");
const Twilio = require("twilio");
const momentTimeZone = require("moment-timezone");
const Appointment = require("../model/Appointment");
const Friend = require("../../friends/model/Friend");
const parseISO = require("date-fns").parseISO;
const dbErrorHelper = require("../../lib/dbErrorHelpers/dbErrorHelper");
const {
  KeyInstance,
} = require("twilio/lib/rest/preview/deployed_devices/fleet/key");

const getTimeZones = function () {
  return momentTimeZone.tz.names();
};

module.exports = {
  getSchedule: async (req, res) => {
    let foundAppointments = await Appointment.find();

    res.json({
      appointments: foundAppointments,
    });

    try {
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },
  createAppointment: async (req, res) => {
    try {
      let newAppointment = new Appointment({
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        notification: req.body.notification,
        timeZone: req.body.timeZone,
        time: "",
      });

      await newAppointment.save();

      res.json({
        timeZones: getTimeZones(),
        appointment: newAppointment,
      });
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },
  sendBirthdayTextNow: async (req, res) => {
    const client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log(client);
    console.log(req.body);
    // Create options to send the message
    const options = {
      to: `+${req.body.mobile}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      /* eslint-disable max-len */
      body: `Hi ${req.body.fullName}. Happy Birthday. From your friend Hamster!.`,
      /* eslint-enable max-len */
    };
    console.log(options);
    // Send the message!
    client.messages.create(options, function (err, response) {
      if (err) {
        // Just log it for now
        console.error(err);
        res.status(500).json({ message: "something went wrong" });
      } else {
        // Log the last few digits of a phone number
        let masked = req.body.mobile.substr(0, req.body.mobile.length - 5);
        masked += "*****";
        console.log(`Message sent to ${masked}`);
        res.send("success");
      }
    });
  },
  sendTextScheduledBirthday: async (req, res) => {
    let fullName = req.body.fullName;
    let mobile = req.body.mobile;
    let scheduleDateAndTime = req.body.scheduleDateAndTime;
    let email = req.body.email;
    let _id = req.body._id;

    let parsedUTCScheduleDateAndTime = Date.parse(
      parseISO(scheduleDateAndTime)
    );
    // console.log(scheduleDateAndTime);
    // console.log(Date.parse(scheduleDateAndTime));
    // console.log(Date.parse(parseISO(scheduleDateAndTime)));

    // console.log(new Date(parsedUTCScheduleDateAndTime * 1000));

    try {
      let createdAppointment = new Appointment({
        fullName: fullName,
        phoneNumber: mobile,
        time: parsedUTCScheduleDateAndTime,
      });

      await createdAppointment.save();

      let foundFriend = await Friend.findById({ _id: _id });

      foundFriend.appointments.push(createdAppointment._id);

      await foundFriend.save();

      res.send("success");
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },
};
