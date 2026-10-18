@echo off
title Tohfa4U Launcher
echo ===================================================
echo             TOHFA4U FULL-STACK LAUNCHER
echo ===================================================
echo [1/2] Launching Python Flask Backend on http://localhost:5000 ...
start "Tohfa4U Python Backend (Port 5000)" cmd /k "python backend/app.py"

timeout /t 2 >nul

echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
start "Tohfa4U Next.js Frontend (Port 3000)" cmd /k "npm run dev"

echo ===================================================
echo  Tohfa4U is now running!
echo  - Frontend: http://localhost:3000
echo  - Backend API: http://localhost:5000/api
echo ===================================================
