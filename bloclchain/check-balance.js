import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error('PRIVATE_KEY not found in .env');
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey);
console.log('Wallet Address:', wallet.address);

const provider = new ethers.providers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
provider.getBalance(wallet.address).then(balance => {
  console.log('Balance:', ethers.utils.formatEther(balance), 'MATIC');
});
