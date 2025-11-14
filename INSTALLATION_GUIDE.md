# Complete Installation Guide

This guide provides step-by-step instructions for installing all required software for the Blockchain Academic Credential Verification System.

---

## Table of Contents

1. [Node.js Installation](#1-nodejs-installation)
2. [npm Verification](#2-npm-verification)
3. [Git Installation (Optional)](#3-git-installation-optional)
4. [Code Editor Installation (Optional)](#4-code-editor-installation-optional)
5. [Project Setup](#5-project-setup)
6. [Verification](#6-verification)

---

## 1. Node.js Installation

Node.js is the runtime environment required to run the application.

### For Windows:

#### Step 1: Download Node.js
1. Open your web browser and go to: **https://nodejs.org/**
2. You'll see two download options:
   - **LTS (Long Term Support)** - Recommended for most users
   - **Current** - Latest features
3. **Click on the LTS version** (recommended: v18.x or v20.x)
4. The installer file (`.msi`) will download automatically

#### Step 2: Run the Installer
1. Locate the downloaded file (usually in your `Downloads` folder)
2. **Double-click** the `.msi` file to start the installer
3. If Windows shows a security warning, click **"Run"** or **"Yes"**

#### Step 3: Follow Installation Wizard
1. Click **"Next"** on the welcome screen
2. **Accept the license agreement** and click **"Next"**
3. Choose installation location (default is fine) and click **"Next"**
4. **Important**: Make sure **"Add to PATH"** is checked (should be by default)
5. Click **"Next"** through the remaining screens
6. Click **"Install"**
7. Enter administrator password if prompted
8. Wait for installation to complete
9. Click **"Finish"**

#### Step 4: Verify Installation
1. Open **PowerShell** or **Command Prompt**
   - Press `Win + X` and select "Windows PowerShell" or "Terminal"
   - Or search for "PowerShell" in the Start menu
2. Type the following command and press Enter:
   ```bash
   node --version
   ```
3. You should see a version number like `v18.17.0` or `v20.10.0`
4. Type this command to check npm:
   ```bash
   npm --version
   ```
5. You should see a version number like `9.8.0` or `10.2.0`

**✅ If you see version numbers, Node.js is installed correctly!**

---

### For macOS:

#### Step 1: Download Node.js
1. Open your web browser and go to: **https://nodejs.org/**
2. Click on the **LTS version** download button
3. The `.pkg` installer will download

#### Step 2: Run the Installer
1. Open the downloaded `.pkg` file
2. Follow the installation wizard:
   - Click **"Continue"**
   - Read the license and click **"Agree"**
   - Click **"Install"**
   - Enter your Mac password when prompted
3. Wait for installation to complete
4. Click **"Close"**

#### Step 3: Verify Installation
1. Open **Terminal** (Applications > Utilities > Terminal)
2. Type:
   ```bash
   node --version
   ```
3. Type:
   ```bash
   npm --version
   ```
4. You should see version numbers for both

**✅ Installation complete!**

---

### For Linux (Ubuntu/Debian):

#### Method 1: Using NodeSource Repository (Recommended)

1. Open Terminal (`Ctrl + Alt + T`)

2. Update package list:
   ```bash
   sudo apt update
   ```

3. Install curl (if not already installed):
   ```bash
   sudo apt install -y curl
   ```

4. Add NodeSource repository:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   ```
   (Replace `20.x` with `18.x` if you prefer Node.js 18)

5. Install Node.js:
   ```bash
   sudo apt install -y nodejs
   ```

6. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Method 2: Using Package Manager

1. Open Terminal

2. Update package list:
   ```bash
   sudo apt update
   ```

3. Install Node.js and npm:
   ```bash
   sudo apt install -y nodejs npm
   ```

4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**✅ Installation complete!**

---

## 2. npm Verification

npm (Node Package Manager) comes bundled with Node.js, so if Node.js is installed correctly, npm should also be available.

### Verify npm Installation:

1. Open your terminal/command prompt
2. Run:
   ```bash
   npm --version
   ```
3. You should see a version number (e.g., `9.8.0`)

### Update npm (Optional):

If you want to ensure you have the latest npm version:

```bash
npm install -g npm@latest
```

**✅ npm is ready to use!**

---

## 3. Git Installation (Optional)

Git is useful for version control and cloning repositories, but it's not strictly required to run the project.

### For Windows:

#### Step 1: Download Git
1. Go to: **https://git-scm.com/download/win**
2. The download will start automatically
3. Wait for the `.exe` file to download

#### Step 2: Run the Installer
1. Double-click the downloaded `.exe` file
2. Click **"Next"** through the setup wizard
3. **Important settings to check:**
   - Select **"Git from the command line and also from 3rd-party software"** (recommended)
   - Choose **"Use bundled OpenSSH"**
   - Select **"Use the OpenSSL library"**
   - Choose **"Checkout Windows-style, commit Unix-style line endings"**
   - Select **"Use MinTTY"** for terminal emulator
   - Enable **"Enable file system caching"**
4. Click **"Install"**
5. Wait for installation to complete
6. Click **"Finish"**

#### Step 3: Verify Installation
1. Open PowerShell or Command Prompt
2. Type:
   ```bash
   git --version
   ```
3. You should see something like: `git version 2.42.0`

**✅ Git is installed!**

---

### For macOS:

#### Method 1: Using Homebrew (Recommended)

1. If you don't have Homebrew, install it first:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Git:
   ```bash
   brew install git
   ```

3. Verify:
   ```bash
   git --version
   ```

#### Method 2: Using Xcode Command Line Tools

1. Open Terminal
2. Run:
   ```bash
   xcode-select --install
   ```
3. Follow the prompts to install
4. Git will be included

#### Method 3: Download Installer

1. Go to: **https://git-scm.com/download/mac**
2. Download the installer
3. Run the installer and follow the prompts

**✅ Git is installed!**

---

### For Linux:

1. Open Terminal

2. For Ubuntu/Debian:
   ```bash
   sudo apt update
   sudo apt install git
   ```

3. For Fedora:
   ```bash
   sudo dnf install git
   ```

4. For CentOS/RHEL:
   ```bash
   sudo yum install git
   ```

5. Verify:
   ```bash
   git --version
   ```

**✅ Git is installed!**

---

## 4. Code Editor Installation (Optional)

A code editor is helpful for viewing and editing project files.

### Visual Studio Code (Recommended)

#### For Windows/macOS/Linux:

1. Go to: **https://code.visualstudio.com/**
2. Click **"Download for Windows/macOS/Linux"**
3. Run the installer
4. Follow the installation wizard
5. Launch VS Code

#### Recommended VS Code Extensions:

After installing VS Code, you can install these helpful extensions:

1. Open VS Code
2. Click the Extensions icon (left sidebar) or press `Ctrl+Shift+X`
3. Search and install:
   - **JavaScript (ES6) code snippets**
   - **Prettier - Code formatter**
   - **Solidity** (for smart contract development)
   - **GitLens** (for Git integration)

**✅ Code editor is ready!**

---

## 5. Project Setup

Now that you have Node.js and npm installed, let's set up the project.

### Step 1: Navigate to Project Directory

1. Open PowerShell (Windows) or Terminal (macOS/Linux)
2. Navigate to the project folder:
   
   **On Windows:**
   ```bash
   cd C:\projects\blockchain-academic-credential-verification-system
   ```
   
   **On macOS/Linux:**
   ```bash
   cd /path/to/blockchain-academic-credential-verification-system
   ```
   
   **Note:** Adjust the path based on where your project is actually located on your system.

### Step 2: Verify You're in the Right Directory

Check that you can see `package.json`:
```bash
dir
```
(Windows) or
```bash
ls
```
(macOS/Linux)

You should see `package.json` in the list.

### Step 3: Install Project Dependencies

This will install all required packages (Hardhat, Express, SQLite3, etc.):

```bash
npm install
```

**This may take 2-5 minutes.** You'll see progress messages as packages are downloaded.

**Expected output:**
- You'll see a list of packages being installed
- At the end, you should see something like: `added 500 packages in 2m`

**⚠️ If you encounter errors:**
- Make sure you have internet connection
- Try running: `npm cache clean --force` then `npm install` again
- On Windows, you might need to run PowerShell as Administrator

### Step 4: Create Environment File

1. Create a file named `.env` in the project root directory

   **On Windows (PowerShell):**
   ```bash
   New-Item -Path .env -ItemType File
   ```

   **On macOS/Linux:**
   ```bash
   touch .env
   ```

   **Or manually:**
   - Create a new file in the project folder
   - Name it exactly `.env` (with the dot at the beginning)

2. Open the `.env` file in a text editor and add:
   ```env
   PORT=3000
   DB_PATH=./credentials.db
   BLOCKCHAIN_NETWORK=http://localhost:8545
   CONTRACT_ADDRESS=
   PRIVATE_KEY=
   QR_CODE_STORAGE=./qrcodes
   API_URL=http://localhost:3000
   ```

3. Save the file

### Step 5: Compile Smart Contracts

```bash
npm run compile
```

**Expected output:**
- You'll see compilation messages
- Should end with: `Compiled X Solidity file(s) successfully`

**✅ Smart contracts compiled!**

### Step 6: Start Hardhat Blockchain Node

**Open a NEW terminal window** (keep this running):

**On Windows:**
```bash
cd C:\projects\blockchain-academic-credential-verification-system
npm run node
```

**On macOS/Linux:**
```bash
cd /path/to/blockchain-academic-credential-verification-system
npm run node
```

**Expected output:**
- You'll see "Started HTTP and WebSocket JSON-RPC server"
- A list of accounts with addresses and private keys will be displayed
- **Keep this terminal open!**

**📝 Important:** Copy one of the private keys from the output (you'll need it in Step 8)

### Step 7: Deploy Smart Contract

**Open ANOTHER NEW terminal window**:

**On Windows:**
```bash
cd C:\projects\blockchain-academic-credential-verification-system
npm run deploy
```

**On macOS/Linux:**
```bash
cd /path/to/blockchain-academic-credential-verification-system
npm run deploy
```

**Expected output:**
- You'll see deployment messages
- At the end, you'll see: `Contract deployed to: 0x...` (an address)
- You'll also see: `💾 Contract address saved to .env file`
- **Note:** The deploy script automatically updates your `.env` file with the contract address!

### Step 8: Update .env File

1. Open the `.env` file you created earlier
2. **Check if CONTRACT_ADDRESS was automatically added** (the deploy script should have done this)
   - If it's already there, you can skip to step 3
   - If not, manually add the contract address:
     ```env
     CONTRACT_ADDRESS=0xYourContractAddressHere
     ```
     (Replace with the actual address from Step 7)

3. Add a private key (this must be done manually):
   ```env
   PRIVATE_KEY=YourPrivateKeyHere
   ```
   (Use one of the private keys from Step 6, you can include or remove the `0x` prefix)

4. Save the file

**Your `.env` file should now look like:**
```env
PORT=3000
DB_PATH=./credentials.db
BLOCKCHAIN_NETWORK=http://localhost:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
QR_CODE_STORAGE=./qrcodes
API_URL=http://localhost:3000
```

### Step 9: Start the API Server

**Open ANOTHER NEW terminal window**:

**On Windows:**
```bash
cd C:\projects\blockchain-academic-credential-verification-system
npm start
```

**On macOS/Linux:**
```bash
cd /path/to/blockchain-academic-credential-verification-system
npm start
```

**Expected output:**
- You'll see: `Server running on http://localhost:3000`
- Or: `API server started on port 3000`

**✅ Server is running!**

### Step 10: Start the Scheduler (Optional but Recommended)

**Open ANOTHER NEW terminal window**:

**On Windows:**
```bash
cd C:\projects\blockchain-academic-credential-verification-system
npm run scheduler
```

**On macOS/Linux:**
```bash
cd /path/to/blockchain-academic-credential-verification-system
npm run scheduler
```

**Expected output:**
- You'll see: `Scheduler started. Checking every hour...`
- This service runs in the background to automatically move credentials to blockchain

**✅ Scheduler is running!**

---

## 6. Verification

### Verify Everything is Working:

1. **Open your web browser**
2. **Navigate to:** `http://localhost:3000`
3. **You should see:**
   - A web interface with forms for submitting credentials
   - Options to verify credentials
   - A list of credentials

### Test the System:

1. **Submit a test credential:**
   - Fill in the form with test data
   - Click "Submit Credential"
   - You should see a success message with a credential ID

2. **Verify a credential:**
   - Enter the credential ID
   - Click "Verify"
   - You should see credential details

### Check All Services:

Make sure you have **4 terminal windows** running:
1. ✅ Hardhat node (`npm run node`)
2. ✅ API Server (`npm start`)
3. ✅ Scheduler (`npm run scheduler`)
4. ✅ (Optional) One for running commands

---

## Troubleshooting

### Node.js Not Found
- **Problem:** `'node' is not recognized as an internal or external command`
- **Solution:** 
  - Restart your terminal/computer after installing Node.js
  - Make sure Node.js was added to PATH during installation
  - Reinstall Node.js if needed

### npm Install Fails
- **Problem:** Errors during `npm install`
- **Solution:**
  ```bash
  npm cache clean --force
  npm install
  ```
  - On Windows, try running PowerShell as Administrator
  - Check your internet connection

### Port Already in Use
- **Problem:** `Error: listen EADDRINUSE: address already in use :::3000`
- **Solution:**
  - Change `PORT=3001` in `.env` file
  - Or close the application using port 3000

### Hardhat Node Not Starting
- **Problem:** Cannot start Hardhat node
- **Solution:**
  - Make sure port 8545 is not in use
  - Check that Hardhat is installed: `npm list hardhat`
  - Try: `npx hardhat node` directly

### Contract Deployment Fails
- **Problem:** Deployment errors
- **Solution:**
  - Make sure Hardhat node is running first
  - Verify `.env` file exists and has correct values
  - Run `npm run compile` before deploying

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Start Hardhat blockchain (Terminal 1)
npm run node

# Deploy contract (Terminal 2)
npm run deploy

# Start API server (Terminal 3)
npm start

# Start scheduler (Terminal 4)
npm run scheduler

# Development mode (auto-reload)
npm run dev

# Test API
npm run test-api
```

---

## Next Steps

After installation is complete:

1. ✅ Read the [README.md](./README.md) for detailed documentation
2. ✅ Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for additional setup tips
3. ✅ Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) if you encounter issues
4. ✅ Start using the system at `http://localhost:3000`

---

## Summary

**Required Software Installed:**
- ✅ Node.js (v18+ recommended)
- ✅ npm (comes with Node.js)
- ⚪ Git (optional)
- ⚪ Code Editor (optional)

**Project Setup Complete:**
- ✅ Dependencies installed
- ✅ Smart contracts compiled
- ✅ Blockchain node running
- ✅ Contract deployed
- ✅ API server running
- ✅ Scheduler running (optional)

**You're ready to use the system!** 🎉

