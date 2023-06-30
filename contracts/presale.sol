// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Presale is Ownable {
    
    uint256 public immutable presaleCost = 0.05 ether; //cost1 for 1 * 10 ** decimals()
    ERC20 public token;
    
    constructor(ERC20 _token) {
        token = _token;
    }

    function buyOnPresale() public payable {   
        uint256 amount = (msg.value * 10**18) / presaleCost;
        require(amount > 1, "Too little value!");
        token.transfer(msg.sender, amount);
    }

    function withdrawMoney() public onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    function withdrawTokens() public onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

}