# Blockchain Academic Credential Verification System

A clean and modern decentralized credential verification project that stores academic credentials in SQLite for 2 days before moving them to an Ethereum blockchain. Once stored on-chain, credentials are packaged with QR codes for fast verification.

---

## 🚀 Key Features

- **Credential Submission** through a web form
- **Temporary SQLite storage** for pending credentials
- **Automated blockchain transfer** after a holding period
- **QR code generation** for on-chain credentials
- **Credential verification** via ID, QR code, or blockchain lookup
- **Scheduler service** for automated processing

---

## 🧰 Technology Stack

- Backend: `Node.js`, `Express.js`
- Database: `SQLite3`
- Blockchain: `Ethereum` via `Hardhat`
- Smart contract: `Solidity`
- QR codes: `qrcode`
- Frontend: `HTML`, `CSS`, `JavaScript`

---

## ✅ Prerequisites

- Node.js `v18+` (recommended)
- `npm` or `yarn`
- `git`

---

## 🛠️ Installation

```bash
git clone https://github.com/Rajarikam117/blockchain-academic-credential-verification-system.git
cd blockchain-academic-credential-verification-system
npm install
```

Copy the environment template and update the variables:

```bash
cp .env.example .env
```

Example `.env` values:

```env
PORT=3000
DB_PATH=./credentials.db
BLOCKCHAIN_NETWORK=http://localhost:8545
CONTRACT_ADDRESS=
PRIVATE_KEY=
QR_CODE_STORAGE=./qrcodes
API_URL=http://localhost:3000
```

---

## ⚙️ Setup

### 1. Start Hardhat local network

```bash
npm run node
```

Keep this terminal running while using the app.

### 2. Deploy the smart contract

```bash
npm run compile
npm run deploy
```

This compiles the contract, deploys it locally, and updates the contract address.

### 3. Add a private key

Copy one of the Hardhat account private keys (without `0x`) into `.env`:

```env
PRIVATE_KEY=your_private_key_here
```

### 4. Run the server

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 5. Start the scheduler (recommended)

```bash
npm run scheduler
```

It processes pending credentials automatically every hour.

---

## 🌐 API Endpoints

- `POST /api/credentials` — submit a new credential
- `GET /api/credentials` — list all credentials
- `GET /api/credentials/:credentialId` — get credential details
- `GET /api/credentials/:credentialId/qrcode` — download credential QR code
- `GET /api/verify/:credentialId` — verify credential status
- `GET /api/health` — health check

### Example request

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

---

## 🔍 How It Works

1. Credentials are submitted and stored in SQLite.
2. Data remains pending for 2 days.
3. The scheduler moves eligible credentials on-chain.
4. On-chain credentials receive a transaction hash and QR code.
5. The credential can then be verified through the API.

---

## 📁 Project Structure

```text
blockchain-academic-credential-verification-system/
├── contracts/             # Solidity smart contract
│   └── CredentialStorage.sol
├── scripts/               # Deployment scripts
│   └── deploy.js
├── public/                # Frontend assets
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── database.js            # SQLite helpers
├── blockchain.js          # Blockchain integration
├── qrcode-service.js      # QR code generation
├── scheduler.js           # Hourly processing service
├── server.js              # Express API server
├── hardhat.config.js      # Hardhat setup
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

---

## 🧪 Testing the wait period

To test faster, shorten the delay in `database.js` and make the scheduler run more often.

In `database.js`:
```js
AND datetime(createdAt) <= datetime('now', '-2 minutes')
```

In `scheduler.js`:
```js
cron.schedule('*/2 * * * *', async () => {
```

---

## 🛡️ Troubleshooting

- Hardhat node not running? Start `npm run node`
- Contract address missing? Re-run deployment and update `.env`
- Blockchain connection fails? Confirm `BLOCKCHAIN_NETWORK=http://localhost:8545`
- Scheduler not processing? Start `npm run scheduler`
- QR code missing? Verify `QR_CODE_STORAGE` exists and is writable

---

## 🔐 Security Notes

- Never commit private keys.
- Use a secure network for production.
- Add authentication and authorization before production use.
- Validate all inputs.

---

## 🚧 Future Enhancements

- Authentication and authorization
- Multi-network blockchain support
- Email notifications for on-chain credentials
- Batch processing
- Export verified credentials as PDF
- IPFS storage for documents
- Mobile QR code verification app

---

## 📄 License

MIT License
