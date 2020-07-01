"use strict";

const CronJob = require("cron").CronJob;
const notificationsWorker = require("./notificationsWorkerFactory");
const moment = require("moment");

const schedulerFactory = function () {
  return {
    start: function () {
      new CronJob(
        "00 * * * * *",
        function () {
          console.log(
            "Running Send Notifications Worker for " +
              moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
          );
          notificationsWorker.run();
        },
        null,
        true,
        ""
      );
    },
  };
};

module.exports = schedulerFactory();
