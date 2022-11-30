const express = require("express");
const router = express.Router();

const { getdata } = require("../controller/hashrateController"); // to import Controllers

router.get("/get_hashrate/:placeholder", getdata);

router.get("/get_hashrate/", getdata);

module.exports = router;
