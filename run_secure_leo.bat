@echo off
title SECURE LEO - Break. Learn. Secure.
echo ========================================================
echo   SECURE LEO - Cybersecurity Web Platform
echo   BREAK. LEARN. SECURE.
echo ========================================================
echo Starting local web server...
set "PATH=C:\Users\acer\.gemini\antigravity\scratch\node_dist\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0"
call npm run preview -- --port 5173 --host
pause
