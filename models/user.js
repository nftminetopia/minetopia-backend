const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  wallet: {
    type: String,
  },
  balance: {
    type: String,
  },
  expiresIn: {
    type: Number,
  },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
