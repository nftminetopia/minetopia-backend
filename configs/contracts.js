const Web3Initializer = require("./web3");
const axios = require("axios");
const yfinance = require('yahoo-finance');

/**
 * @dev minetopia NFT's contract instance.
 */
class MinetopiaNFT extends Web3Initializer {
  wallet = null;
  contractAddress = "0x30ccf3Af1152791BB6220c78484a6E08DBE2d1dc";
  constructor(wallet) {
    super();

    if (!wallet) throw new Error("Wallet is required");
    const abi = require("../assets/minetopia.abi.json");
    const address = this.contractAddress;
    this.contractInstance = new this.web3.eth.Contract(abi, address);
    this.wallet = wallet;

    this._walletNFTs = this._walletNFTs.bind(this);
  }

  /**
   * @dev returns the number of NFTs owned `wallet`
   * @returns number
   */
  async balanceOf() {
    return await this.contractInstance.methods.balanceOf(this.wallet).call();
  }

  /**
   * @dev internal returns the an array for tokenIds owned `wallet`
   * @returns number[]
   */
  async _walletNFTs() {
    return await this.contractInstance.methods
      .tokensOfOwner(this.wallet)
      .call();
  }

  /**
   * @dev returns the an object of NFTs object info owned `wallet`
   * @returns Object[]
   */
  async getWalletNFTs() {
    const tokenIds = await this._walletNFTs();

    let tokenIdInfoPromise = tokenIds.map(
      (tokenId) =>
        new Promise((resolve, reject) => {
          this.contractInstance.methods
            .tokenURI(tokenId)
            .call()
            .then(async (tokenURI) => {
              try {
                const { data } = await axios.get(tokenURI);
                resolve({ ipfs: tokenURI, metadata: data });
              } catch (err) {
                reject(err);
              }
            });
        })
    );

    const tokensMetadata = await Promise.all(tokenIdInfoPromise);

    return tokensMetadata.map((nftInfo, index) => ({
      etherscan: `https://etherscan.io/nft/${this.contractAddress}/${tokenIds[index]}`,
      ...nftInfo,
    }));
  }
}

/**
 * @dev Bitcoin to USD price feed contract instance.
 */
class Bitcon_USD_PriceFeed extends Web3Initializer {
  constructor() {
    super();

    const abi = require("../assets/priceFeed.abi.json");
    const address = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c";
    this.contractInstance = new this.web3.eth.Contract(abi, address);
  }

  /**
   * @dev fetches the BTC/USD price
   * @return number
   */
  async get_BTC_USD_price() {
    let price = 0;
    let decimals = this.contractInstance.methods.decimals().call(); // fetch decimals
    const priceFeed = this.contractInstance.methods.latestRoundData().call(); // fetch current price
    [decimals, { answer: price }] = await Promise.all([decimals, priceFeed]);
    return price / 10 ** decimals; // convert into human readable
  }
}

/**
 * @dev Ethereum to USD price feed contract instance.
 */
class Ethereum_USD_PriceFeed extends Web3Initializer {
  constructor() {
    super();

    const abi = require("../assets/priceFeed.abi.json");
    const address = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    this.contractInstance = new this.web3.eth.Contract(abi, address);
  }

  /**
   * @dev fetches the ETH/USD price
   * @return number
   */
  async get_ETH_USD_price() {
    let price = 0;
    let decimals = this.contractInstance.methods.decimals().call(); // fetch decimals
    const priceFeed = this.contractInstance.methods.latestRoundData().call(); // fetch current price
    [decimals, { answer: price }] = await Promise.all([decimals, priceFeed]);
    return price / 10 ** decimals; // convert into human readable
  }
}

/**
 * @dev Litecoin to USD price feed contract instance.
 */
class Litecoin_USD_PriceFeed extends Web3Initializer {
  constructor() {
    super();

    const abi = require("../assets/priceFeed.abi.json");
    const address = "0x6AF09DF7563C363B5763b9102712EbeD3b9e859B";
    this.contractInstance = new this.web3.eth.Contract(abi, address);
  }

  /**
   * @dev fetches the LTC/USD price
   * @return number
   */
  async get_LTC_USD_price() {
    let price = 0;
    let decimals = this.contractInstance.methods.decimals().call(); // fetch decimals
    const priceFeed = this.contractInstance.methods.latestRoundData().call(); // fetch current price
    [decimals, { answer: price }] = await Promise.all([decimals, priceFeed]);
    return price / 10 ** decimals; // convert into human readable
  }
}

/**
 * @dev KADENA to USD price feed contract instance.
 * yahoo finance is used instead of contract
 */
class Kadena_USD_PriceFeed{
  constructor() {
    
  }
  /**
   * @dev fetches the LTC/USD price
   * @return number
   */
  async get_KDA_USD_price() {
  
    const { price } = await yfinance.quote({
      symbol: 'KDA-USD',
      modules: [ 'price', 'summaryDetail' ]
      // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, function (err, quotes) {

    });

    let result = price['regularMarketPrice'];

    return result;
  }
}

module.exports = {
  MinetopiaNFT,
  Bitcon_USD_PriceFeed,
  Ethereum_USD_PriceFeed,
  Litecoin_USD_PriceFeed,
  Kadena_USD_PriceFeed
};
