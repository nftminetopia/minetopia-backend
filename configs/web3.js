const Web3 = require("web3");
const INFURA_URL = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`;

/**
 * @dev creates Web3 instance with websocket connection using infura's rpc url
 */
class Web3Initializer {
  constructor() {
    const options = {
      timeout: 30000, // ms

      clientConfig: {
        // Useful to keep a connection alive
        keepalive: true,
        keepaliveInterval: 60000, // ms
      },

      // Enable auto reconnection
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false,
      },
    };

    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(INFURA_URL, options)
    );
  }
}

module.exports = Web3Initializer;
