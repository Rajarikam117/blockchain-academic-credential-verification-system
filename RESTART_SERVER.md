# Restart Server to Apply Changes

## Issue
The PUT endpoint for editing credentials is not working because the server is running old code.

## Solution: Restart the Server

### Step 1: Stop the Current Server
1. Find the terminal/command prompt where the server is running
2. Press `Ctrl + C` to stop it
3. Or close the terminal window

### Step 2: Start the Server Again
```bash
npm start
```

Or use the start script:
```bash
.\start-server.ps1
```

Or:
```bash
start-server.bat
```

### Step 3: Verify the Server Started
You should see:
```
Server running on port 3000
Database initialized
API available at http://localhost:3000/api
```

### Step 4: Test the Edit Feature
1. Open `http://localhost:3000` in your browser
2. Go to "View Credentials"
3. Click "Edit" on a credential
4. Make changes and save

## Why This Happens
When you add new routes or modify server code, Node.js doesn't automatically reload. You need to restart the server for changes to take effect.

## Alternative: Use Nodemon (Auto-restart)
If you want the server to automatically restart when files change:

```bash
npm run dev
```

This uses `nodemon` which watches for file changes and restarts automatically.

