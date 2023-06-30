//npx hardhat run --network goerli scripts/deploy-token-with-presale.js
const { ethers } = require("hardhat");

async function main() {
    const tokenContract = await ethers.getContractFactory("MyTokenWithPresale");
    console.log("Deploying MyTokenWithPresale...");
    myTokenContract = await tokenContract.deploy();
    await myTokenContract.deployed();
    console.log("MyERC20Upgradeble deployed to:", myTokenContract.address);
}

main();