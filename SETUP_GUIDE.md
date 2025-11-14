# Setup Guide

## Quick Setup (Windows)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   Create a `.env` file in the root directory with the following content:
   ```env
   PORT=3000
   DB_PATH=./credentials.db
   BLOCKCHAIN_NETWORK=http://localhost:8545
   CONTRACT_ADDRESS=
   PRIVATE_KEY=
   QR_CODE_STORAGE=./qrcodes
   API_URL=http://localhost:3000
   ```

3. **Compile Smart Contracts**
   ```bash
   npm run compile
   ```
   
   **Note:** If you get a Hardhat lockfile error (HH18), this is a known Windows issue. The project includes a workaround - the `npm run compile` command uses an alternative method that bypasses this issue. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more details.

4. **Start Hardhat Blockchain Node** (Terminal 1)
   ```bash
   npm run node
   ```
   Keep this terminal running. You'll see accounts with private keys - copy one private key for step 6.

5. **Deploy Smart Contract** (Terminal 2)
   ```bash
   npm run deploy
   ```
   Copy the contract address from the output.

6. **Update .env file**
   - Add the contract address to `CONTRACT_ADDRESS`
   - Add a private key (from step 4) to `PRIVATE_KEY` (remove the `0x` prefix if present, or keep it)

7. **Start API Server** (Terminal 3)
   ```bash
   npm start
   ```

8. **Start Scheduler** (Terminal 4 - Optional but Recommended)
   ```bash
   npm run scheduler
   ```
   This service automatically moves credentials from database to blockchain after 2 days.

9. **Access Web Interface**
   Open your browser and navigate to: `http://localhost:3000`

## Testing with Shorter Wait Period

For testing purposes, you can modify the system to use a shorter wait period (e.g., 2 minutes instead of 2 days):

### Option 1: Modify Database Query

Edit `database.js`, line ~45:
```javascript
// Change from:
AND datetime(createdAt) <= datetime('now', '-2 days')

// To:
AND datetime(createdAt) <= datetime('now', '-2 minutes')
```

### Option 2: Modify Scheduler Frequency

Edit `scheduler.js`, line ~95:
```javascript
// Change from:
cron.schedule('0 * * * *', async () => {

// To (runs every 2 minutes):
cron.schedule('*/2 * * * *', async () => {
```

## Troubleshooting

### Issue: "Cannot connect to blockchain network"
**Solution**: Make sure Hardhat node is running (`npm run node`)

### Issue: "Contract artifacts not found"
**Solution**: Run `npm run compile` to compile the smart contracts

### Issue: "Contract address not set"
**Solution**: Deploy the contract using `npm run deploy` and update `.env` file

### Issue: "Account not initialized"
**Solution**: Add a `PRIVATE_KEY` to your `.env` file (from Hardhat node output)

### Issue: Scheduler not processing credentials
**Solution**: 
- Make sure scheduler is running: `npm run scheduler`
- Check that credentials are older than 2 days (or your modified wait period)
- Verify blockchain connection is working

## Production Deployment

For production deployment:

1. Use a real blockchain network (Ethereum mainnet, Polygon, etc.)
2. Update `BLOCKCHAIN_NETWORK` in `.env` to your network RPC URL
3. Use a production database (PostgreSQL, MySQL) instead of SQLite
4. Add authentication and authorization
5. Use environment variables for sensitive data
6. Set up proper error logging and monitoring
7. Use a process manager like PM2 for running services
8. Set up HTTPS for the web interface

## API Usage Examples

### Submit Credential
```bash
curl -X POST http://localhost:3000/api/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "institutionName": "University of Technology",
    "degree": "Bachelor of Science",
    "fieldOfStudy": "Computer Science",
    "graduationDate": "2023-06-15"
  }'
```

### Verify Credential
```bash
curl http://localhost:3000/api/verify/YOUR_CREDENTIAL_ID
```

### Get All Credentials
```bash
curl http://localhost:3000/api/credentials
```

### Get QR Code
```bash
curl http://localhost:3000/api/credentials/YOUR_CREDENTIAL_ID/qrcode
```

## Next Steps

- Read the main [README.md](./README.md) for detailed documentation
- Explore the API endpoints
- Test the credential submission and verification flow
- Customize the system for your needs

