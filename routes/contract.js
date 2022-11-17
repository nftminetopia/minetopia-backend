const express = require("express");
const contractRouter = express.Router();
const passport = require("../configs/passport");
const {
  getPriceFeeds,
  getWalletBalance,
  getWalletNFTs,
} = require("../controller/contractController");
const { getNFTsByWallet } = require("../models/nfts");

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

// for testing only
contractRouter.get("/temp", (req, res, next) => {
  let nftsOwn = getNFTsByWallet("0xfaa9f97a08446004fd005c4e9b526c053afd4a0b");

  res.status(200).json(nftsOwn);
});
module.exports = contractRouter;