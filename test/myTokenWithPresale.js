//npx hardhat compile
//npx hardhat test
const { expect } = require("chai");
const { ethers } = require("hardhat");

const provider = ethers.provider;

describe("My Token With Presale", function () {

    let accounts;
    let myTokenAddress;

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        //задеплоить токен
        tokenContract = await ethers.getContractFactory("MyTokenWithPresale");
        myTokenContract = await tokenContract.deploy();
        await myTokenContract.deployed();
        console.log("Token address:", myTokenContract.address);

        myTokenAddress = myTokenContract.address;

    });

    //если пресейл еще не открыт, ожидаем ошибку
    it("If no tokens for sale, user should get error", async function () {

        await expect(
            myTokenContract.connect(accounts[1]).buyOnPresale(
                { value: ethers.utils.parseEther('1') }
            )
        ).to.be.revertedWith("Presale has not started yet or has already ended!");

    });

    //пользователь может купить токен с контракта пресейла
    //после этого его баланс в токенах увеличивается
    it("User's balance should increase", async function () {

        //владелец должен открыть пресейл
        await myTokenContract.connect(accounts[0]).setStage(1);

        balanceBefore = await myTokenContract.balanceOf(accounts[1].address);
        await myTokenContract.connect(accounts[1]).buyOnPresale({ value: ethers.utils.parseEther('1') });
        balanceAfter = await myTokenContract.balanceOf(accounts[1].address);

        console.log("After buying on presale user has:", balanceAfter.toString(), "MTK on balance");

        expect(balanceAfter).to.gt(balanceBefore);

    });

    //овнер может забрать заработанные эфиры
    //после этого увеличивается его баланс в эфирах

    it("Owner's balance should increase", async function () {

        //владелец должен открыть пресейл
        await myTokenContract.connect(accounts[0]).setStage(1);

        balanceETHBefore = await provider.getBalance(accounts[0].address);

        await myTokenContract.connect(accounts[1]).buyOnPresale({ value: ethers.utils.parseEther('1') });
        await myTokenContract.connect(accounts[2]).buyOnPresale({ value: ethers.utils.parseEther('1') });
        await myTokenContract.connect(accounts[3]).buyOnPresale({ value: ethers.utils.parseEther('1') });

        //закрыть пресейл
        await myTokenContract.connect(accounts[0]).setStage(3);

        await myTokenContract.connect(accounts[0]).withdraw();

        balanceETHAfter = await provider.getBalance(accounts[0].address);

        console.log("After withdrow tokens owner has:", balanceETHAfter.toString(), "ETH on balance");

        expect(balanceETHAfter).to.gt(balanceETHBefore);

    });


});