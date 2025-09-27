const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying EvidenceStorage contract...");

  const EvidenceStorage = await ethers.getContractFactory("EvidenceStorage");
  const evidenceStorage = await EvidenceStorage.deploy();

  await evidenceStorage.deployed();

  const address = evidenceStorage.address;
  console.log("EvidenceStorage deployed to:", address);

  // Save the address to a file for easy reference
  fs.writeFileSync("contract-address.txt", address);

  console.log("Contract address saved to contract-address.txt");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
