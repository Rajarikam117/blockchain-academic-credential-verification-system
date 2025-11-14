#!/bin/bash

echo "🚀 Starting Blockchain Academic Credential Verification System"
echo "================================================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# Compile contracts
echo "🔨 Compiling smart contracts..."
npm run compile

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Hardhat node: npm run node"
echo "2. Deploy contract: npm run deploy"
echo "3. Update .env with contract address and private key"
echo "4. Start server: npm start"
echo "5. Start scheduler: npm run scheduler"

