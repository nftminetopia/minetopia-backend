const jsonwebtoken = require("jsonwebtoken");

/**
 * @dev removes the user info of `wallet` address from local database/storage
 * @param user is the user info object
 * @returns string
 */
const issueJWT = (user) => {
  const wallet = user.wallet;
  const payload = {
    sub: wallet,
    expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 1, // one day
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET);

  return "Bearer " + signedToken;
};

module.exports = { issueJWT };
