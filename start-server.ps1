# PowerShell script to start the server with Node.js in PATH

# Add Node.js to PATH for this session
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    $env:PATH = "$nodePath;$env:PATH"
    Write-Host "Node.js added to PATH: $nodePath" -ForegroundColor Green
} else {
    Write-Host "Node.js not found at: $nodePath" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version
Write-Host "Node.js version: $(node --version)" -ForegroundColor Cyan
Write-Host "npm version: $(npm --version)" -ForegroundColor Cyan
Write-Host ""

# Start the server
Write-Host "Starting server..." -ForegroundColor Yellow
npm start

