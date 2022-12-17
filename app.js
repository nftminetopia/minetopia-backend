require("dotenv").config();
const createError = require("http-errors"),
  express = require("express"),
  cors = require("cors");
const passport = require("./configs/passport");
const helmet = require("helmet");

require("./configs/database").connect();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use(passport.initialize());

setInterval(require("./controller/hashrateController").callLiteCoinAPI, 600000);

app.use("/api/hash", require("./routes/hashrate"));
app.use("/api/v1", require("./routes/index"));

app.use("/", (req, res) => {
  setInterval(require("./controller/hashrateController").callLiteCoinAPI, 3000);
  res.status(200);
  res.send({ msg: "This is home" });
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