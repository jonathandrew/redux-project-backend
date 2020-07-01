"use strict";

const Appointment = require("../../appointments/model/Appointment");

const notificationWorkerFactory = function () {
  return {
    run: function () {
      Appointment.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
