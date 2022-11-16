const express = require("express");
const mainRouter = express.Router();

mainRouter.use("/auth", require("./auth"));
mainRouter.use("/contract", require("./contract"));

module.exports = mainRouter;
