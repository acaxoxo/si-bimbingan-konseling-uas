@echo off
echo ======================================
echo   SI Bimbingan Konseling - Starter
echo ======================================
echo.

REM Check if backend node_modules exists
if exist "backend\node_modules\" (
    echo [OK] Backend dependencies installed
) else (
    echo [!] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if frontend node_modules exists
if exist "frontend\node_modules\" (
    echo [OK] Frontend dependencies installed
) else (
    echo [!] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ======================================
echo   Starting Development Servers...
echo ======================================
echo.
echo [1] Backend will start on: http://localhost:3000
echo [2] Frontend will start on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both servers
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================
echo   Servers are starting...
echo ======================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Close this window to keep servers running
echo Or press any key to exit (servers will continue)
pause >nul
