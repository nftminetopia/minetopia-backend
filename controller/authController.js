const createHttpError = require("http-errors");
const { MinetopiaNFT } = require("../configs/contracts");
const Web3Initializer = require("../configs/web3");
const User = require("../models/user");
const { issueJWT } = require("../utils/passport");

/**
 * @dev checks the jwt token's validity. if token is valid, it returns the user info.
 * @param {Object} req is request object
 * @param {Object} res is request object
 * @returns void
 */
const checkSession = (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

/**
 * @dev helper function to fetch the tokens balance of wallet.
 * @param wallet is the ethereum public key
 * @returns Promise
 *
 */
const getBalanceOf = async (wallet) => {
  const minetopiaNFT = new MinetopiaNFT(wallet);
  return parseInt(await minetopiaNFT.balanceOf());
};

const createOrUpdateUser = async ({ wallet, balance, expiresIn }) => {
  let userInfo = await User.findOne({ wallet });

  if (!userInfo) {
    const user = User({
      wallet,
      balance,
      expiresIn, // one day
    });

    return await user.save(); // creating user
  }

  return await User.updateOne({ wallet }, { balance, expiresIn });
};
/**
 * @dev it will fetch the balance and store it in local database. if the user has NFT(s), it will issue jwt.
 * @param {Object} req is request object
 * @param {Object} res is request object
 * @param {Function} next is middleware function
 * @returns Promise
 */
const signIn = async (req, res, next) => {
  try {
    const { web3 } = new Web3Initializer();
    const { message, signature } = req.body;

    if (!message || !signature) throw new Error(createHttpError(400));
    // const walletAddress = "0x8e22c3f1339e515161d8ab754b9e0d9de196bc93";
    const walletAddress = "0xfaa9f97a08446004fd005c4e9b526c053afd4a0b"; //
    // const walletAddress = await web3.eth.accounts.recover(message, signature);

    console.log(`For Auth: ${walletAddress}`);
    let userInfo = await User.findOne({ wallet: walletAddress });

    if (!userInfo || userInfo.expiresIn <= Date.now()) {
      const nftsBalance = await getBalanceOf(walletAddress);
      if (!nftsBalance) return res.sendStatus(403); // if no nfts for user do not generate access token

      userInfo = {
        wallet: walletAddress,
        balance: nftsBalance,
        expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 1, // one day
      };
      await createOrUpdateUser(userInfo);
    }

    const token = issueJWT(userInfo);

    console.log(token);

    res.status(200).json({
      accessToken: token,
      ...userInfo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkSession, signIn };
