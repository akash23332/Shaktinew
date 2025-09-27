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
