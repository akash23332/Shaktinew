const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const address = await signer.getAddress();
  const balanceWei = await signer.getBalance();
  const balanceEth = ethers.utils.formatEther(balanceWei);

  console.log("Deployer address:", address);
  console.log("Deployer balance (MATIC):", balanceEth);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
