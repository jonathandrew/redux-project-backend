var express = require("express");
var router = express.Router();
var appointmentController = require("./controllers/appointmentController");
var passport = require("passport");
/* GET home page. */
router.get(
  "/get-appointments",
  passport.authenticate("jwt-user", { session: false }),
  appointmentController.getSchedule
);

router.get(
  "/create-appointment",
  passport.authenticate("jwt-user", { session: false }),
  appointmentController.createAppointment
);

router.post(
  "/send-birthday-text-now",
  passport.authenticate("jwt-user", { session: false }),
  appointmentController.sendBirthdayTextNow
);

router.post(
  "/send-a-scheduled-birthday",
  passport.authenticate("jwt-user", { session: false }),
  appointmentController.sendTextScheduledBirthday
);

module.exports = router;
