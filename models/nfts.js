const mongoose = require("mongoose");
const { Schema } = mongoose;

const NFTSchema = new Schema({
  wallet: String,
  expiresIn: Number,
  nfts: [
    {
      etherscan: String,
      ipfs: String,
      metadata: {
        name: String,
        description: String,
        image: String,
        animation_url: String,
      },
    },
  ],
});

module.exports = mongoose.models.NFT || mongoose.model("NFT", NFTSchema);
