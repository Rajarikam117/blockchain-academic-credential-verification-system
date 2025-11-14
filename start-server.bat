@echo off
REM Batch script to start the server with Node.js in PATH

REM Add Node.js to PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

REM Check if node exists
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js not found in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo Or add Node.js to your system PATH manually.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.
echo npm version:
npm --version
echo.
echo Starting server...
echo.

npm start

