@echo off
echo 🚀 Starting Classroom Assignment Portal...
echo.

echo 📊 Checking database connection...
cd server
node setupDatabase.js health
if %errorlevel% neq 0 (
    echo ❌ Database connection failed!
    pause
    exit /b 1
)

echo.
echo 🔧 Building React application...
cd ../client
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 🚀 Starting servers...
cd ..

echo Starting backend server...
start "Backend Server" cmd /k "npm run server"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "Frontend Server" cmd /k "serve -s client/build -l 3000"

echo.
echo ✅ Project started successfully!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5003
echo.
echo 🔑 Demo Login Credentials:
echo    Teacher: teacher@test.com / password123
echo    Student: student@test.com / password123
echo.
pause