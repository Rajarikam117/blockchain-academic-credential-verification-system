@echo off
echo 🚀 Starting Blockchain Academic Credential Verification System
echo ================================================================

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env file with your configuration
)

REM Compile contracts
echo 🔨 Compiling smart contracts...
call npm run compile

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Start Hardhat node: npm run node
echo 2. Deploy contract: npm run deploy
echo 3. Update .env with contract address and private key
echo 4. Start server: npm start
echo 5. Start scheduler: npm run scheduler
pause

