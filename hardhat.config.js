require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.15",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/uVPdQ3wT_m7Bghz3UsPRNriv-sn3IuaJ',
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
