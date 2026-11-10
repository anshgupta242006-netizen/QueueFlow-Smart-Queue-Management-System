@echo off
setlocal enabledelayedexpansion

echo =========================================================
echo   QueueFlow - 1-Click Push to GitHub
echo   Target: anshgupta242006-netizen/QueueFlow-Smart-Queue-Management-System
echo =========================================================
echo.

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/anshgupta242006-netizen/QueueFlow-Smart-Queue-Management-System.git

echo [1/3] Staging all files...
git add .

echo [2/3] Checking git commit...
git commit -m "Upload complete QueueFlow Smart Queue Management System project" 2>nul

echo [3/3] Pushing to GitHub...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =============================================================
    echo   SUCCESS! Project uploaded to:
    echo   https://github.com/anshgupta242006-netizen/QueueFlow-Smart-Queue-Management-System
    echo =============================================================
) else (
    echo.
    echo [NOTE] If a browser window opened, click 'Sign in with browser' to approve GitHub access.
)
pause
