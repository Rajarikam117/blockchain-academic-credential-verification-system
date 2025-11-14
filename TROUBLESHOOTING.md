# Troubleshooting Guide

## Hardhat Compilation Issues on Windows 32-bit

If you encounter the error:
```
Error HH18: You installed Hardhat with a corrupted lockfile due to the NPM bug #4828
```

### Solution: Use Alternative Compilation Method

This project includes an alternative compilation script that bypasses Hardhat's lockfile check. 

**Use the alternative compile command:**
```bash
npm run compile
```

This uses `compile-contract.js` which compiles the contract directly using `solc` without going through Hardhat's lockfile validation.

### Why This Happens

This is a known issue with NPM bug #4828 that affects Hardhat on some Windows systems, particularly 32-bit architectures. The alternative compilation method works around this by:

1. Using `solc` directly instead of Hardhat's compiler
2. Generating the same artifact format that Hardhat produces
3. Saving artifacts to the same location so the rest of the system works normally

### Deploying the Contract

Even with the compilation workaround, you can still deploy using Hardhat:

1. **Start Hardhat node:**
   ```bash
   npm run node
   ```

2. **Deploy the contract:**
   ```bash
   npm run deploy
   ```

If you still encounter issues with Hardhat node, you can:

**Option 1: Use the compiled artifact directly**
- The contract is already compiled in `artifacts/contracts/CredentialStorage.sol/CredentialStorage.json`
- You can deploy it manually using Web3.js or another tool

**Option 2: Use a different blockchain node**
- Use Ganache or another Ethereum node
- Update `BLOCKCHAIN_NETWORK` in `.env` to point to your node

## Other Common Issues

### Issue: "Cannot connect to blockchain network"

**Solution:**
- Make sure Hardhat node is running: `npm run node`
- Check that `BLOCKCHAIN_NETWORK` in `.env` matches your node URL
- Verify the port (default is 8545)

### Issue: "Contract artifacts not found"

**Solution:**
- Run `npm run compile` to compile the contract
- Check that `artifacts/contracts/CredentialStorage.sol/CredentialStorage.json` exists

### Issue: "Account not initialized"

**Solution:**
- Add a `PRIVATE_KEY` to your `.env` file
- Get a private key from Hardhat node output when you start it
- Make sure the private key doesn't have `0x` prefix (or keep it if it does)

### Issue: Scheduler not processing credentials

**Solution:**
- Make sure scheduler is running: `npm run scheduler`
- Check that credentials are older than 2 days
- Verify blockchain connection is working
- Check scheduler logs for errors

### Issue: QR codes not generating

**Solution:**
- Check that `qrcodes` directory exists and is writable
- Verify `QR_CODE_STORAGE` path in `.env` file
- Check file system permissions

## Testing with Shorter Wait Period

For testing, you can modify the 2-day wait period:

1. **Edit `database.js`** (line ~45):
   ```javascript
   // Change from:
   AND datetime(createdAt) <= datetime('now', '-2 days')
   
   // To (2 minutes for testing):
   AND datetime(createdAt) <= datetime('now', '-2 minutes')
   ```

2. **Edit `scheduler.js`** (line ~95):
   ```javascript
   // Change from hourly to every 2 minutes:
   cron.schedule('*/2 * * * *', async () => {
   ```

## Still Having Issues?

1. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v14 or higher (v18+ recommended)

2. **Clear and reinstall:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install --no-package-lock
   ```

3. **Check system architecture:**
   ```bash
   node -p "process.arch"
   ```
   If you're on 32-bit (ia32), the alternative compilation method should work.

4. **Verify all dependencies are installed:**
   ```bash
   npm install
   ```

## Alternative Setup Without Hardhat

If Hardhat continues to cause issues, you can:

1. **Use Ganache instead of Hardhat node:**
   - Install Ganache: `npm install -g ganache`
   - Start Ganache: `ganache`
   - Update `.env` with Ganache's RPC URL

2. **Use a testnet:**
   - Deploy to Sepolia or another testnet
   - Update `BLOCKCHAIN_NETWORK` in `.env`
   - Use MetaMask or another wallet for deployment

3. **Manual compilation:**
   - Use Remix IDE to compile the contract
   - Copy the ABI and bytecode
   - Deploy using Web3.js or another tool

---

For more help, check the main [README.md](./README.md) or [SETUP_GUIDE.md](./SETUP_GUIDE.md).

