// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// `describe` is a Mocha function that allows to organize  tests.
describe("Token contract", function () {
  /* We define a fixture to reuse the same setup in every test. We use
  loadFixture to run this setup once, snapshot that state, and reset Hardhat
  Network to that snapshot in every test.*/
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const hardhatToken = await ethers.deployContract("Token");

    await hardhatToken.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { hardhatToken, owner, addr1, addr2, addr3};
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("1.Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("2.Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("3.Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("4.Should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("5.Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
    
    //newly added test cases 
  describe("Additional Tests involving the Minting operation.", function () {
    it("6. Should allow transferring tokens after minting", async function () {
      //  // The test ensures that tokens can be transferred successfully after minting.
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
    
      // Mint 100 tokens to addr1
      await hardhatToken.connect(owner).mint(addr1.address, 100);
    
      // Transfer 50 tokens from addr1 to addr2
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });
    
    it("7. Should allow transferring tokens between any two accounts", async function () {
      const { hardhatToken, owner, addr1, addr2, addr3 } = await loadFixture(
        deployTokenFixture
      );
    
      // Mint tokens to addr1
      await hardhatToken.connect(owner).mint(addr1.address, 100);
    
      // Check if addr1, addr2, and addr3 are defined with addresses
      if (
        addr1 && addr1.address &&
        addr2 && addr2.address &&
        addr3 && addr3.address
      ) {
        // Transfer 50 tokens from addr1 to addr2
        await expect(
          hardhatToken.connect(addr1).transfer(addr2.address, 50)
        ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    
        // Transfer 25 tokens from addr2 to addr3
        await expect(
          hardhatToken.connect(addr2).transfer(addr3.address, 25)
        ).to.changeTokenBalances(hardhatToken, [addr2, addr3], [-25, 25]);
      } else {
        throw new Error("One or more addresses (addr1, addr2, addr3) are not defined or don't have an address property");
      }
    });
    
    
    it("8. Should mint new tokens and update total supply", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
    
      // Mint 200 tokens to addr1
      await expect(hardhatToken.connect(owner).mint(addr1.address, 200))
        .to.emit(hardhatToken, "Mint")
        .withArgs(addr1.address, 200)
        .and.to.emit(hardhatToken, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", addr1.address, 200); 
      // Check the updated balances and total supply
      const balanceAddr1 = await hardhatToken.balanceOf(addr1.address);
      const totalSupply = await hardhatToken.totalSupply();
    
      expect(balanceAddr1).to.equal(200);
      expect(totalSupply).to.equal(1000200); // Initial supply + 200 minted
    });   
  }); 
  });
});