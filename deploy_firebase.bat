@echo off
title Deploy SECURE LEO to Firebase Hosting
echo ========================================================
echo   SECURE LEO - Firebase Hosting Deployment
echo   BREAK. LEARN. SECURE.
echo ========================================================
set "PATH=C:\Users\acer\.gemini\antigravity\scratch\node_dist\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0"

echo [1/2] Building production assets...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Error: Build failed!
  pause
  exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Deploying to Firebase Hosting (Project: leo-a8232)...
call npx firebase-tools@13.29.1 deploy --only hosting --project leo-a8232

echo.
echo ========================================================
echo   Deployment Process Completed!
echo ========================================================
pause
