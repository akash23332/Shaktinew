const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying SimpleStorage contract...");

  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  console.log("Transaction sent, waiting for confirmation...");
  const simpleStorage = await SimpleStorage.deploy({
    gasLimit: 5000000,
    gasPrice: ethers.utils.parseUnits("50", "gwei")
  });

  await simpleStorage.deployed();

  const address = simpleStorage.address;
  console.log("SimpleStorage deployed to:", address);

  // Save the address to a file for easy reference
  fs.writeFileSync("simple-contract-address.txt", address);

  console.log("Contract address saved to simple-contract-address.txt");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
