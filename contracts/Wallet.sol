// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./lib/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/IWallet.sol";

//TODO: upgradableにする
contract Wallet is IWallet, Ownable, Pausable, ReentrancyGuard {
    address[] public tokenList;
    mapping(address => bool) public isTokenListed;

    constructor() {}

    /**
     * @notice add token to the list
     */
    function registerToken(address token) external {
        require(token != address(0), "token address is invalid");
        if (!isTokenListed[token]) {
            isTokenListed[token] = true;
            tokenList.push(token);
        }
    }

    /**
     * @notice tokens held by Treasury.
     */
    function getBalance(address tokenAddress) public view returns (uint256) {
        if (tokenAddress == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(tokenAddress).balanceOf(address(this));
        }
    }

    /**
     * @notice withdraw all tokens or ETH
     */
    function withdrawAll() external onlyOwner {
        //全てのトークンをownerに転送する
        for (uint256 i = 0; i < tokenList.length; i++) {
            address token = tokenList[i];
            this.withdraw(token);
        }
    }

    /**
     * @notice withdraw token or ETH
     */
    function withdraw(address token) external onlyOwner {
        uint256 balance = getBalance(token);
        if (balance > 0) {
            if (token == address(0)) {
                Address.sendValue(payable(owner()), balance);
            } else {
                IERC20(token).transfer(owner(), balance);
            }
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
