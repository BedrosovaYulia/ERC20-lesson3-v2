//npx hardhat compile
//npx hardhat test
const { expect } = require("chai");
const { ethers } = require("hardhat");

const provider = ethers.provider;


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

    });

    //на контракте пресейла должно быть переданное количество токенов
    it("The number of tokens transferred should be on the presale contract", async function () {

        //владелец должен передать некотоое количество токенов на контракт пресейла
        await myTokenContract.connect(accounts[0]).transfer(myPresaleAddress, ethers.utils.parseEther('5000'));

        presaleContractBalance = await myTokenContract.balanceOf(myPresaleAddress);
        console.log("Presale contract's balance: ", presaleContractBalance);

        const expectedBalance = ethers.utils.parseEther('5000');
        expect(presaleContractBalance).to.equal(expectedBalance);

    });

    //пользователь может купить токен с контракта пресейла
    //после этого его баланс в токенах увеличивается
    it("User's balance should increase", async function () {

        //владелец должен передать некотоое количество токенов на контракт пресейла
        await myTokenContract.connect(accounts[0]).transfer(myPresaleAddress, ethers.utils.parseEther('5000'));

        balanceBefore = await myTokenContract.balanceOf(accounts[1].address);
        await myPresaleContract.connect(accounts[1]).buyOnPresale({ value: ethers.utils.parseEther('1') });
        balanceAfter = await myTokenContract.balanceOf(accounts[1].address);

        console.log("After buying on presale user has:", balanceAfter.toString(), "MTK on balance");

        expect(balanceAfter).to.gt(balanceBefore);

    });

    //если нет токенов на продажу - ожидаем ошибку no tokens for sale
    it("If no tokens for sale, user should get error", async function () {

        await expect(
            myPresaleContract.connect(accounts[1]).buyOnPresale(
                { value: ethers.utils.parseEther('1') }
            )
        ).to.be.revertedWith("no tokens for sale");

    });

    //овнер может забрать заработанные эфиры и остаток токенов
    //после этого увеличивается его баланс в эфирах и в токенах увеличивается

    it("Owner's balance should increase", async function () {
        
        //владелец должен передать некотоое количество токенов на контракт пресейла
        await myTokenContract.connect(accounts[0]).transfer(myPresaleAddress, ethers.utils.parseEther('5000'));

        balanceBefore = await myTokenContract.balanceOf(accounts[0].address);
        balanceETHBefore = await provider.getBalance(accounts[0].address);
       
        await myPresaleContract.connect(accounts[1]).buyOnPresale({ value: ethers.utils.parseEther('1') });
        await myPresaleContract.connect(accounts[2]).buyOnPresale({ value: ethers.utils.parseEther('1') });
        await myPresaleContract.connect(accounts[3]).buyOnPresale({ value: ethers.utils.parseEther('1') });
        
        await myPresaleContract.connect(accounts[0]).withdrawMoney();
        await myPresaleContract.connect(accounts[0]).withdrawTokens();
        
        balanceAfter = await myTokenContract.balanceOf(accounts[0].address);
        balanceETHAfter = await provider.getBalance(accounts[0].address);

        console.log("After withdrow tokens owner has:", balanceAfter.toString(), "MTK on balance");
        console.log("After withdrow tokens owner has:", balanceETHAfter.toString(), "ETH on balance");

        expect(balanceAfter).to.gt(balanceBefore);
        expect(balanceETHAfter).to.gt(balanceETHBefore);


    });


});