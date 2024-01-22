# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Available tasks

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js


Files:

hardhat.config.json - file to configures a Hardhat environment for Etherium development, providing an Infura API key and a Sepolia account private key, enabling tasks like checking the balance of an account on the "sepolia" network,

token.sol       - file for created smart contracts with containing logs

Deploy.js - file for deploying a Token`smart contract on Etherium blockchain,

Token.js  - file for automated test cases, also added new test cases 

Lock.js      -  tests the deployment, validations, events, and transfers associated with a time-locked Ethereum contract called "Lock,"

package.json - file defines project with specified dependencies, including Hardhat for Ethereum development, ethers for Ethereum interactions, and scripts for installing a specific package during testing


To deploy a smart contract to the Sepolia testnet using Infura for Ethereum node communication firstly created a MetaMask account, registered for an Infura account, get private key for the deployment and sent Sepolia ethers to the Metamask private account, which used for deployment.

```
