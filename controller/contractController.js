const {
  Bitcon_USD_PriceFeed,
  Ethereum_USD_PriceFeed,
  Litecoin_USD_PriceFeed,
  Kadena_USD_PriceFeed,
  MinetopiaNFT,
} = require("../configs/contracts");
const NodeCache = require("node-cache");
const Web3Initializer = require("../configs/web3");
const NFT = require("../models/nfts");
const contractCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

/**
 * @dev it fetches the current conversion rate for btc, eth, ltc coins.
 * @param {Object} req is request object
 * @param {Object} res is request object
 * @param {Function} next is middleware function
 * @returns Promise
 */
const getPriceFeeds = async (req, res, next) => {
  try {
    const CACHE_KEY = "priceFeed"; // unique key for data to be cached

    if (contractCache.has(CACHE_KEY)) {
      // read data from cache. if it exists return it
      const payload = contractCache.get(CACHE_KEY);
      return res.status(200).json(payload);
    }

    // fetch the price feed
    const btcPriceFeed = new Bitcon_USD_PriceFeed();
    const ethPriceFeed = new Ethereum_USD_PriceFeed();
    const ltcPriceFeed = new Litecoin_USD_PriceFeed();
    const kdaPriceFeed = new Kadena_USD_PriceFeed();

    let btcToUsd = btcPriceFeed.get_BTC_USD_price();
    let ethToUsd = ethPriceFeed.get_ETH_USD_price();
    let ltcToUsd = ltcPriceFeed.get_LTC_USD_price();
    let kdaToUsd = kdaPriceFeed.get_KDA_USD_price();

    [btcToUsd, ethToUsd, ltcToUsd, kdaToUsd] = await Promise.all([
      btcToUsd,
      ethToUsd,
      ltcToUsd,
      kdaToUsd,
    ]);
    const payload = {
      // "BTC/USD": btcToUsd,
      "ETH/USD": ethToUsd,
      "LTC/USD": ltcToUsd,
      "KDA/USD": kdaToUsd,
    };
    // save the payload to cache
    contractCache.set(CACHE_KEY, payload);
    return res.status(200).json(payload); // return response
  } catch (err) {
    next(err);
  }
};

/**
 * @dev it reads the balance of given wallet from ethereum.
 * @param {string} wallet is ethereum wallet address
 * @returns Promise
 */
const getBalance = async (wallet) => {
  const { web3 } = new Web3Initializer();
  const balance = await web3.eth.getBalance(wallet);
  return web3.utils.fromWei(balance.toString(), "ether");
};

/**
 * @dev it fetches the balance (eth amount) of each wallet.
 * @param {Object} req is request object
 * @param {Object} res is request object
 * @param {Function} next is middleware function
 * @returns Promise
 */

const getWalletBalance = async (req, res, next) => {
  try {
    const CACHE_KEY = "walletsBalances"; // unique key for data to be cached

    if (contractCache.has(CACHE_KEY)) {
      // read data from cache. if it exists return it

      const payload = contractCache.get(CACHE_KEY);
      return res.status(200).json(payload);
    }

    const walletsInfo = {
      Treasury: "0x2307962b8E30aec64B92fe0DAdA7D687498FE0f2",
      Community: "0xD1CFc6c11Df58AAA0d1Ef72BCA6917d05a9E3414",
      Expansion: "0x775B5cF93aD7f2176E96fD5d4d512B53749BBe1a",
      MaintenanceAndTeam: "0x4EB68786E188a3931a05e9C03E5B25f8Ca229B6c",
    };

    const names = {
      Treasury: "Treasury",
      Community: "Community",
      Expansion: "Expansion",
      MaintenanceAndTeam: "Maintenance And Team",
    };

    const balancesPromises = Object.keys(walletsInfo).map((key) =>
      getBalance(walletsInfo[key])
    );

    const balances = await Promise.all(balancesPromises);

    const payload = Object.keys(walletsInfo).map((key, index) => {
      return {
        [key]: {
          wallet: walletsInfo[key],
          balance: balances[index],
          name: names[key],
        },
      };
    });

    // save the payload to cache
    contractCache.set(CACHE_KEY, payload);
    return res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @dev helper function to fetch the tokens info of wallet.
 * @param wallet is the ethereum public key
 * @returns Promise
 *
 */
const _getWalletNFTsInfo = async (wallet) => {
  const contractInstance = new MinetopiaNFT(wallet);

  return await contractInstance.getWalletNFTs();
};

const createOrUpdate = async ({ expiresIn, wallet, nfts }) => {
  let nftsInfo = await NFT.findOne({ wallet });

  if (!nftsInfo) {
    const document = NFT({
      wallet: wallet,
      nfts,
      expiresIn,
    });

    return await document.save(); // creating user
  }

  return await NFT.updateOne({ wallet }, { nfts, expiresIn });
};
/**
 * @dev fetches the NFTs
 * @param {Object} req is request object
 * @param {Object} res is request object
 * @param {Function} next is middleware function
 * @returns Promise
 */
const getWalletNFTs = async (req, res, next) => {
  try {
    const { wallet } = req.user;

    // const wallet = "0xfaa9f97a08446004fd005c4e9b526c053afd4a0b"; //is temp
    if (!wallet) throw new Error(createHttpError(400));

    let nftsOwn = await NFT.findOne({ wallet });
    if (!nftsOwn || nftsOwn.expiresIn <= Date.now()) {
      const nfts = await _getWalletNFTsInfo(wallet);
      const payload = {
        nfts,
        expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 1, // one day
      };

      await createOrUpdate({ ...payload, wallet });
    }

    res.status(200).json(nftsOwn);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPriceFeeds, getWalletBalance, getWalletNFTs };
