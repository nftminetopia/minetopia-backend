const express = require("express");
const contractRouter = express.Router();
const passport = require("../configs/passport");
const {
  getPriceFeeds,
  getWalletBalance,
  getWalletNFTs,
} = require("../controller/contractController");

/**
 * @dev it fetches the current conversion rate for btc, eth, ltc coins.
 */
contractRouter.get("/price-feed", getPriceFeeds);

/**
 * @dev it fetches the balance (eth amount) of admin wallets.
 */
contractRouter.get(
  "/wallets-balance",
  passport.authenticate("jwt", { session: false }),
  getWalletBalance
);

contractRouter.get(
  "/wallet-nfts",
  passport.authenticate("jwt", { session: false }),
  getWalletNFTs
);

module.exports = contractRouter;
