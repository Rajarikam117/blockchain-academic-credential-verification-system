# Blockchain Academic Credential Verification System

A decentralized academic credential verification system that stores credentials in a database for 2 days before automatically moving them to the blockchain. Once on the blockchain, the system generates QR codes for easy verification.

## Features

- 📝 **Credential Submission**: Submit academic credentials through a web interface
- 💾 **Temporary Database Storage**: Credentials are stored in SQLite database for 2 days
- ⛓️ **Blockchain Integration**: Automatic transfer to blockchain after 2-day period
- 🔍 **Credential Verification**: Verify credentials using credential ID or QR code
- 📱 **QR Code Generation**: Automatic QR code generation for blockchain-verified credentials
- 🎨 **Modern Web Interface**: Beautiful, responsive web UI for all operations
- ⏰ **Automated Scheduler**: Background service that processes pending credentials hourly

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Blockchain**: Ethereum (Hardhat local network)
- **Smart Contracts**: Solidity
- **QR Codes**: qrcode library
- **Frontend**: HTML, CSS, JavaScript

## Prerequisites

- Node.js (v18 or higher recommended for native fetch support, or v14+ with node-fetch)
- npm or yarn
- Git

## Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd blockchain-academic-credential-verification-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` file** with your configuration:
   ```env
   PORT=3000
   DB_PATH=./credentials.db
   BLOCKCHAIN_NETWORK=http://localhost:8545
   CONTRACT_ADDRESS=
   PRIVATE_KEY=
   QR_CODE_STORAGE=./qrcodes
   API_URL=http://localhost:3000
   ```

## Setup Instructions

### Step 1: Start Hardhat Local Blockchain

Open a new terminal and start a local Hardhat node:

```bash
npm run node
```

This will start a local Ethereum blockchain on `http://localhost:8545`. Keep this terminal running.

### Step 2: Deploy Smart Contract

Open another terminal and deploy the smart contract:

```bash
npm run compile
npm run deploy
```

This will:
- Compile the Solidity contract
- Deploy it to the local blockchain
- Save the contract address to your `.env` file

**Important**: Copy the contract address from the deployment output and update your `.env` file if it wasn't automatically updated.

### Step 3: Get Private Key for Transactions

From the Hardhat node terminal, you'll see a list of accounts with their private keys. Copy one of the private keys (without the `0x` prefix) and add it to your `.env` file:

```env
PRIVATE_KEY=your_private_key_here
```

### Step 4: Start the API Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### Step 5: Start the Scheduler (Optional but Recommended)

Open another terminal and start the scheduler service:

```bash
npm run scheduler
```

The scheduler runs every hour to check for credentials that have been in the database for 2+ days and automatically moves them to the blockchain.

## Usage

### Web Interface

1. Open your browser and navigate to `http://localhost:3000`
2. **Submit Credential**: Fill in the form with student details and submit
3. **Verify Credential**: Enter a credential ID to verify its authenticity
4. **View Credentials**: See all submitted credentials and their status

### API Endpoints

#### Submit Credential
```bash
POST /api/credentials
Content-Type: application/json

{
  "studentName": "John Doe",
  "institutionName": "University of Technology",
  "degree": "Bachelor of Science",
  "fieldOfStudy": "Computer Science",
  "graduationDate": "2023-06-15"
}
```

#### Verify Credential
```bash
GET /api/verify/:credentialId
```

#### Get Credential Details
```bash
GET /api/credentials/:credentialId
```

#### Get QR Code
```bash
GET /api/credentials/:credentialId/qrcode
```

#### Get All Credentials
```bash
GET /api/credentials
```

#### Health Check
```bash
GET /api/health
```

## How It Works

1. **Credential Submission**: When a credential is submitted, it's stored in the SQLite database with a unique credential ID.

2. **2-Day Waiting Period**: Credentials remain in the database for 2 days. During this time, they can be viewed but are marked as "pending blockchain storage."

3. **Automatic Blockchain Storage**: The scheduler service runs every hour and checks for credentials that are 2+ days old. These credentials are automatically:
   - Stored on the blockchain using the smart contract
   - Assigned a transaction hash
   - Generated with a QR code for verification

4. **Verification**: Once on the blockchain, credentials can be verified by:
   - Credential ID lookup
   - QR code scanning
   - Blockchain transaction hash verification

## Project Structure

```
blockchain-academic-credential-verification-system/
├── contracts/
│   └── CredentialStorage.sol    # Smart contract for credential storage
├── scripts/
│   └── deploy.js                # Deployment script
├── public/
│   ├── index.html              # Frontend HTML
│   ├── styles.css              # Frontend styles
│   └── app.js                  # Frontend JavaScript
├── database.js                 # Database service
├── blockchain.js               # Blockchain service
├── qrcode-service.js           # QR code generation service
├── scheduler.js                # Scheduler for automatic processing
├── server.js                   # Express API server
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## Smart Contract

The `CredentialStorage` smart contract provides:
- `storeCredential()`: Store a credential on the blockchain
- `getCredential()`: Retrieve credential details
- `verifyCredential()`: Verify if a credential exists and is valid

## Testing the 2-Day Wait Period

For testing purposes, you can modify the scheduler to use a shorter wait period:

1. Edit `database.js` and change the query in `getCredentialsPendingBlockchain()`:
   ```javascript
   // Change from '-2 days' to '-2 minutes' for testing
   AND datetime(createdAt) <= datetime('now', '-2 minutes')
   ```

2. Edit `scheduler.js` to run more frequently:
   ```javascript
   // Change from '0 * * * *' (hourly) to '*/2 * * * *' (every 2 minutes)
   cron.schedule('*/2 * * * *', async () => {
   ```

## Troubleshooting

### Contract Not Deployed
- Make sure Hardhat node is running
- Run `npm run compile` and `npm run deploy`
- Check that contract address is in `.env` file

### Blockchain Connection Error
- Verify Hardhat node is running on `http://localhost:8545`
- Check `BLOCKCHAIN_NETWORK` in `.env` file
- Ensure private key is set correctly

### Scheduler Not Working
- Make sure scheduler service is running: `npm run scheduler`
- Check database connection
- Verify blockchain service is initialized

### QR Code Not Generating
- Check that `qrcodes` directory exists and is writable
- Verify `QR_CODE_STORAGE` path in `.env` file

## Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Production Deployment**: Use a secure blockchain network (testnet/mainnet) for production
- **Database Security**: Implement proper database security measures
- **API Security**: Add authentication and authorization for production use
- **Input Validation**: Always validate user inputs

## Future Enhancements

- [ ] Add authentication and authorization
- [ ] Support for multiple blockchain networks
- [ ] Email notifications when credentials are stored on blockchain
- [ ] Batch processing for multiple credentials
- [ ] Export credentials as PDF
- [ ] Mobile app for QR code scanning
- [ ] Integration with IPFS for document storage
- [ ] Multi-signature verification

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the repository.

---

**Note**: This is a demonstration system. For production use, please implement proper security measures, error handling, and testing.

#   b l o c k c h a i n - a c a d e m i c - c r e d e n t i a l - v e r i f i c a t i o n - s y s t e m  
 