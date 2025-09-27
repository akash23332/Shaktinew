const { config: loadEnv } = require('dotenv');
loadEnv();

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
  networks: {
    // Polygon Mumbai testnet
    mumbai: {
      url: process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 0, // 5 gwei
    },
    // Polygon Amoy testnet (preferred Polygon testnet)
    amoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 25000000000, // 25 gwei
      chainId: 80002,
      timeout: 600000
    },
    // Polygon mainnet (optional)
    polygon: {
      url: process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-rpc.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
