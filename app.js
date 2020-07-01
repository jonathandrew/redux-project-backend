require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var helmet = require("helmet");
var xss = require("xss-clean");
var compression = require("compression");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users/users");
var friendsRouter = require("./routes/friends/friends");
var appointmentsRouter = require("./routes/appointments/appointments");

var schedulerFactory = require("./routes/lib/twilio/scheduleFactory");

var passport = require("passport");
var userJWTLoginStrategy = require("./routes/lib/passport/user-passport-auth");

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGODB Connected");
  })
  .catch((e) => {
    console.log(e);
  });

var app = express();

app.use(passport.initialize());

passport.serializeUser((user, cb) => {
  console.log("----");
  console.log(user);
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  console.log("====");
  console.log(user);
  cb(null, user);
});

passport.use("jwt-user", userJWTLoginStrategy);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
// Set security HTTP headers
app.use(helmet());

app.use(xss());

app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/appointments", appointmentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

schedulerFactory.start();

module.exports = app;
