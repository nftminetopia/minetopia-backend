// const path = require("path");
// const JSONdb = require("simple-json-db");
// const filePath = path.resolve(__dirname, "../db/users.json");

// const db = new JSONdb(filePath);

const db = require("../configs/database");       // to import database.js
const mongoose = require("mongoose");
const { Schema } = mongoose

const userSchema = new mongoose.Schema({
  wallet_address : "",
  user : [{
    wallet: "",
    balance: 0,
    expiresIn: 0,
    nfts: [{ type: Schema.Types.ObjectId, ref: 'Nft' }]
  }],
});

const User = mongoose.model("User", userSchema);


// schema for entry
/**
 * [
 *  "0x00000000000"://wallet address
 *  [
 *    {
 *      wallet: string, // is wallet address
 *      balance: number,// is number of nfts
 *      expiresIn: number,// is time in seconds for information to expired
 *    }
 *  ]
 * ]
 *
 **/

/**
 * @dev fetches the NFTs of `wallet` address from local database/storage
 * @param info is an array of object
 * @returns user info
 */
const insertUser = (info) => {
  if (!info.wallet) throw new Error("Wallet is required");

  db.connect();
  const result = User.create(
    {info}
  );

  return info.wallet;

  // db.set(info.wallet, info);
  // return db.get(info.wallet);
};

/**
 * @dev fetches the user info of `wallet` address from local database/storage
 * @param wallet is the ethereum public key
 * @returns user info
 */
const getUserByWallet = (wallet) => {
  if (!wallet) throw new Error("Wallet is required");

  db.connect();
  const result = User.find(
    {wallet:wallet}
  );

  return result;
};

/**
 * @dev removes the user info of `wallet` address from local database/storage
 * @param wallet is the ethereum public key
 * @returns Boolean
 */
const deleteUserByWallet = (wallet) => {
  if (!wallet) throw new Error("Wallet is required");

  db.connect();
  const result = User.delete(
    {wallet:wallet}
  );

  return wallet;
};

module.exports = {
  insertUser,
  getUserByWallet,
  deleteUserByWallet,
};
