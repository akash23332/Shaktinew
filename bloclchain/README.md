# EvidenceStorage Contract Deployment

This directory contains the Hardhat setup for deploying the EvidenceStorage smart contract to Polygon blockchain.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in a `.env` file:
   ```
   POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
   PRIVATE_KEY=your_private_key_here
   ```

   - Get a Polygon Mumbai RPC URL from [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
   - Use your wallet's private key (never share this!)

## Deployment

Deploy to Polygon Mumbai testnet:

```bash
npx hardhat run scripts/deploy.js --network polygon
```

After deployment, the contract address will be displayed and saved to `contract-address.txt`.

## Update Server Configuration

After getting the contract address, add it to your `ShaktiX/First app/.env` file:

```
CONTRACT_ADDRESS=0xYourContractAddressHere
```

Restart your server to use blockchain storage.
