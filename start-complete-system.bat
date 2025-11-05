@echo off
echo 🚀 Starting Classroom Assignment Portal System
echo.

echo 📊 System Information:
echo - Backend API: http://localhost:3001
echo - Frontend: http://localhost:3000
echo - Database: MongoDB Atlas (Cloud)
echo.

echo 🔑 Demo Credentials:
echo - Teacher: teacher@test.com / password123
echo - Student: student@test.com / password123
echo.

echo 🎯 Starting Backend Server...
cd server
start "Backend Server" cmd /k "npm start"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 🎨 Starting Frontend...
cd ..\client
start "Frontend Server" cmd /k "serve -s build -l 3000"

echo ⏳ Waiting for frontend to start...
timeout /t 3 /nobreak > nul

echo.
echo ✅ System Started Successfully!
echo.
echo 🌐 Access the application at: http://localhost:3000
echo 📡 API documentation at: http://localhost:3001/api/test
echo.
echo 📝 Features Available:
echo - User Authentication (Teachers and Students)
echo - Assignment Creation and Management
echo - Student Submission System
echo - Teacher Grading with Feedback
echo - Grade History Tracking
echo - Bulk Grading Operations
echo - Data Analytics and Reporting
echo.
echo Press any key to open the application in your browser...
pause > nul

start http://localhost:3000

echo.
echo 🎉 Classroom Assignment Portal is ready to use!
echo.
pause