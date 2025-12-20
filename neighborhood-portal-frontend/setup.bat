@echo off
echo ========================================
echo Neighborhood Portal - Quick Setup
echo ========================================
echo.

echo [1/4] Installing Angular dependencies...
call npm install

echo.
echo [2/4] Installing Angular Material...
call npm install @angular/material @angular/cdk @angular/animations

echo.
echo [3/4] Setting up Backend...
cd backend
call npm install

echo.
echo [4/4] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please update with your database credentials.
) else (
    echo .env file already exists.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update backend/.env with your MySQL credentials
echo 2. Run database schema: mysql -u root -p neighborhood_portal ^< backend/database/schema.sql
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend: npm start
echo.
pause
