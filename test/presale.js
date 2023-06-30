//npx hardhat compile
//npx hardhat test test/HoneyPot.js --network local
const { expect } = require("chai");
const { ethers } = require("hardhat");

/*const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const routerAbi = routerArtifact.abi;
const uniswapFactoryArtifact = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const uniswapFactoryAbi = uniswapFactoryArtifact.abi;
const wethAbi = require("../abi/weth.json");

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const uniswapRouterV2Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const uniswapFactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';*/

const provider = ethers.provider;

/*const router = new ethers.Contract(uniswapRouterV2Address, routerAbi, provider);
const factoryUniswapFactory = new ethers.Contract(uniswapFactoryAddress, uniswapFactoryAbi, provider);
const wethContract = new ethers.Contract(wethAddress, wethAbi, provider);*/

describe("Presale", function () {

  let accounts;
  let myPresaleAddress;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    //задеплоить токен
    tokenContract = await ethers.getContractFactory("MyToken");
    myTokenContract = await tokenContract.deploy();
    await myTokenContract.deployed();
    console.log("Token address:", myTokenContract.address);

    //задеплоить контракт пресейла
    presaleContract = await ethers.getContractFactory("Presale");
    myPresaleContract = await presaleContract.deploy(myTokenContract.address);
    await myPresaleContract.deployed();
    console.log("Presale contract address:", myPresaleContract.address);

    myPresaleAddress = myPresaleContract.address;

    //владелец должен передать некотоое количество токенов на контракт пресейла
    await myTokenContract.connect(accounts[0]).transfer(myPresaleAddress, ethers.utils.parseEther('5000'));

  });

  //на контракте пресейла должно быть переданное количество токенов
  it("The number of tokens transferred should be on the presale contract", async function () {

    presaleContractBalance = await myTokenContract.balanceOf(myPresaleAddress);
    console.log("Presale contract's balance: ", presaleContractBalance);

    const expectedBalance = ethers.utils.parseEther('5000');
    expect(presaleContractBalance.toString()).to.equal(expectedBalance.toString());

  });

  //пользователь может купить токен с контракта пресейла
  //после этого его баланс в токенах увеличивается
  it("User's balance should increase", async function () {

    balanceBefore = await myTokenContract.balanceOf(accounts[1].address);
    await myPresaleContract.connect(accounts[1]).buyOnPresale({value:ethers.utils.parseEther('1')});
    balanceAfter = await myTokenContract.balanceOf(accounts[1].address);

    console.log("After buying on presale user has:", balanceAfter.toString() ,"MTK on balance");
    
    expect(balanceAfter.div(1000000).toNumber()).to.gt(balanceBefore.div(1000000).toNumber());

  });

  //овнер может забрать заработанные эфиры и остаток токенов
  //после этого увеличивается его баланс в эфирах и в токенах увеличивается

  

});