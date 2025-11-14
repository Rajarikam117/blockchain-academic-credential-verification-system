# Quick Server Restart Guide

## The Problem
The PUT endpoint for editing credentials is not working because the server is running old code.

## Quick Fix

### Option 1: Manual Restart (Recommended)

1. **Find the terminal where the server is running**
   - Look for a terminal/command prompt window showing server logs
   - It should show: "Server running on port 3000"

2. **Stop the server:**
   - Click on that terminal window
   - Press `Ctrl + C` (or `Ctrl + Break`)
   - Wait for it to stop

3. **Start the server again:**
   ```bash
   npm start
   ```
   
   Or if Node.js isn't in PATH:
   ```bash
   .\start-server.ps1
   ```

4. **Verify it started:**
   You should see:
   ```
   Server running on port 3000
   Database initialized
   API available at http://localhost:3000/api
   ```

### Option 2: Use the Restart Script

Run the restart script:
```powershell
.\restart-server.ps1
```

This will:
- Stop all Node.js server processes
- Start the server again

### Option 3: Kill All Node Processes (If needed)

If the server won't stop:

```powershell
# Stop all Node.js processes
Get-Process -Name node | Stop-Process -Force

# Then start again
npm start
```

## After Restart

1. **Refresh your browser** (Ctrl + Shift + R)
2. **Test the edit feature:**
   - Go to "View Credentials"
   - Click "Edit" on a credential
   - Make changes and save

## Verify PUT Endpoint is Working

After restarting, check the server logs when you try to edit. You should see:
```
PUT /api/credentials/...
```

If you still see 404 errors, the server didn't restart properly. Try Option 3 above.

## Why This Happens

Node.js doesn't automatically reload when you change code. After adding new routes (like the PUT endpoint), you must restart the server for the changes to take effect.

