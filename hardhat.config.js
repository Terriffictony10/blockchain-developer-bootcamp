require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {},
    hardhat: {
      mining: {
        auto: true// Mining interval between 3 to 6 seconds
      }
    }
  },
};
