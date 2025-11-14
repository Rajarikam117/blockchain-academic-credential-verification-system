# PowerShell script to restart the server

Write-Host "Stopping existing server processes..." -ForegroundColor Yellow

# Find and stop Node.js processes running server.js
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        $proc = Get-Process -Id $_.Id -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Stopping process $($_.Id)..." -ForegroundColor Cyan
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Ignore errors
    }
}

Start-Sleep -Seconds 2

Write-Host "Starting server..." -ForegroundColor Green

# Add Node.js to PATH
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    $env:PATH = "$nodePath;$env:PATH"
}

# Start the server
Set-Location $PSScriptRoot
npm start

