const express = require("express");
const authRouter = express.Router();
const passport = require("../configs/passport");
const { checkSession, signIn } = require("../controller/authController");

/**
 * @dev checks the jwt token's validity. if token is valid, it returns the user info.
 */
authRouter.get(
  "/session",
  passport.authenticate("jwt", { session: false }),
  checkSession
);

/**
 * @dev it will fetch the balance and store it in local database. if the user has NFT(s), it will issue jwt.
 */
authRouter.post("/signin", signIn);

module.exports = authRouter;
