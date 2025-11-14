# Fix: Node.js Not Recognized

## Problem
When running `npm start`, you get the error:
```
'"node"' is not recognized as an internal or external command
```

## Solution

### Option 1: Use the Start Scripts (Easiest)
Use one of the provided start scripts that automatically adds Node.js to PATH:

**PowerShell:**
```powershell
.\start-server.ps1
```

**Command Prompt (CMD):**
```cmd
start-server.bat
```

### Option 2: Add Node.js to PATH Manually (Permanent Fix)

1. **Find Node.js Installation:**
   - Usually installed at: `C:\Program Files\nodejs\`
   - Or: `C:\Program Files (x86)\nodejs\`

2. **Add to System PATH:**
   - Press `Win + X` and select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\nodejs`
   - Click "OK" on all dialogs

3. **Restart Terminal:**
   - Close all terminal/PowerShell windows
   - Open a new terminal
   - Run `node --version` to verify

### Option 3: Use Full Path (Temporary)

You can use the full path to node.exe:
```powershell
& "C:\Program Files\nodejs\node.exe" server.js
```

### Option 4: Add to PATH for Current Session Only

**PowerShell:**
```powershell
$env:PATH += ";C:\Program Files\nodejs"
npm start
```

**Command Prompt:**
```cmd
set PATH=%PATH%;C:\Program Files\nodejs
npm start
```

## Verify Installation

After fixing, verify Node.js is accessible:
```bash
node --version
npm --version
```

Both commands should show version numbers.

## Recommended Solution

**Use the start scripts** (`start-server.ps1` or `start-server.bat`) - they automatically handle the PATH issue and start the server.

## If Node.js is Not Installed

If Node.js is not installed at all:

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Download the LTS version
   - Run the installer

2. **During Installation:**
   - Make sure "Add to PATH" is checked
   - Complete the installation

3. **Verify Installation:**
   - Open a new terminal
   - Run: `node --version`
   - Run: `npm --version`

## Troubleshooting

### Node.js is installed but not in PATH
- Use Option 2 to add it permanently
- Or use the start scripts (Option 1)

### Node.js is in a different location
- Find where node.exe is located
- Add that directory to PATH instead

### Still having issues?
- Restart your computer after adding to PATH
- Make sure you're using Administrator privileges if needed
- Check that the Node.js installation is complete

