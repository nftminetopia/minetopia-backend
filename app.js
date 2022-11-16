require("dotenv").config();

// const { reset } = require("nodemon");

const createError = require("http-errors"),
express = require("express"),
  // logger = require("morgan"),
  cors = require("cors");
  passport = require("./configs/passport");
const helmet = require("helmet");
const app = express();

const hashRouter = require("./routes/hashrate"); //to import Hashrate Router

app.use(helmet());

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(cors());
app.use(express.static("public"));

app.use("/api/hash", hashRouter.router);
app.use("/api/v1", require("./routes/index"));

app.use("/", (req, res) => {
  res.status(200);
  res.send({msg: "This is home"});
  res.end();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;