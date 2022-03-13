const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("ProductMarketplace", function () {
  let deployer, addr1, addr2, product, marketplace;
  let feePercent = 1;
  let URI = "Sample URI";
  beforeEach(async function () {
    const PRODUCT = await ethers.getContractFactory("Product");
    const Marketplace = await ethers.getContractFactory("Marketplace");

    [deployer, addr1, addr2] = await ethers.getSigners();

    product = await PRODUCT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe("Deployment", function () {
    it("Should track name and symbol of the nft collection", async function () {
      expect(await product.name()).to.equal("Product Identification");
      expect(await product.symbol()).to.equal("PRODUCTIDENTIFICATION");
    });

    it("Should track feeAccount and feePercent calculation", async function () {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });
  describe("Minting Products", function () {
    it("Should track each minted Product", async function () {
      await product.connect(addr1).mint(URI);
      expect(await product.tokenCount()).to.equal(1);
      expect(await product.balanceOf(addr1.address)).to.equal(1);
      expect(await product.tokenURI(1)).to.equal(URI);

      //add2 mints as nft
      await product.connect(addr2).mint(URI);
      expect(await product.tokenCount()).to.equal(2);
      expect(await product.balanceOf(addr1.address)).to.equal(1);
      expect(await product.tokenURI(1)).to.equal(URI);
    });
  });

  describe("Making marketplace items", function () {
    beforeEach(async function () {
      await product.connect(addr1).mint(URI);
      await product.connect(addr1).setApprovalForAll(marketplace.address, true);
    });
    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
      await expect(
        marketplace.connect(addr1).makeItem(product.address, 1, toWei(1))
      )
        .to.emit(marketplace, "Offered")
        .withArgs(1, product.address, 1, toWei(1), addr1.address)

        expect(await product.ownerOf(1)).to.equal(marketplace.address);
        expect(await marketplace.itemCount()).to.equal(1)
        const item = await marketplace.items()
        expect(item.itemId).to.equal(1)
        expect(item.nft).to.equal(nft.address)
        expect(item.tokenId).to.equal(1)
        expect(item.price).to.equal(toWei(1))
        expect(item.sold).to.equal(false)
    });
  });
});
