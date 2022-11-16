// const path = require("path");
// const JSONdb = require("simple-json-db");
// const filePath = path.resolve(__dirname, "../db/nfts.json");

const db = require("../configs/database");       // to import database.js
const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  wallet_address : "",
  expiresIn : 0,
  nfts: [
    {
      etherscan: "",
      ipfs: "",
      metadata: {
          name: "",
          description: "",
          image: "",
          animation_url: "",
      },
    },
  ],
});


const Nft = mongoose.model("Nft", nftSchema);

// schema for entry
/**
 * [
 *  "0x00000000000": // wallet address
 *  {
 *    nfts:[
 *      {
 *        tokenId: number, // token id
 *        tokenURI: string // uri/url to token asset
 *      }
 *    ],
 *   expiresIn: number,// is time in seconds for information to expired
 *  }
 * ]
 *  
 **/
// const db = new JSONdb(filePath);

const getNFTsByWallet = async (wallet) => {
  if (!wallet) throw new Error("Wallet is required");

  db.connect();
  const result = await Nft.findOne({wallet_address: wallet}).sort({created_at: -1})

  return result;
};

// const getNFTsByWallet = (wallet) => {
//   if (!wallet) throw new Error("Wallet is required");
//   return db.get(wallet);
// };

const insertNFTs = async (wallet, userNFTs) => {
  if (!wallet) throw new Error("Wallet is required");

  const {nfts, expiresIn} = userNFTs;

  db.connect();
  const result = await Nft.create(
    {
    wallet_address : wallet,
    expiresIn : expiresIn,
    nfts: nfts,
    }
  );

  return result;
};

// const insertNFTs = (wallet, userNFTs) => {
//   if (!wallet) throw new Error("Wallet is required");
//   db.set(wallet, userNFTs);
//   return db.get(wallet);
// };

module.exports = {
  insertNFTs,
  getNFTsByWallet,
};