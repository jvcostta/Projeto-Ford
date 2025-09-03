@echo off
echo 🚗 Ford User Management Platform - Setup
echo =========================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env >nul 2>&1 || echo Warning: .env.example not found, using default .env
)

echo 🔧 Building and starting services...

REM Build and start all services
docker-compose up --build -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Services started successfully!
    echo.
    echo 🌐 Application URLs:
    echo    Frontend: http://localhost:4200
    echo    Backend API: http://localhost:8080
    echo    Swagger UI: http://localhost:8080/swagger-ui.html
    echo.
    echo 👤 Test Credentials:
    echo    Admin: admin@ford.com / Admin@123
    echo    User: user@ford.com / User@123
    echo.
    echo 🔍 To view logs: docker-compose logs -f
    echo 🛑 To stop: docker-compose down
) else (
    echo ❌ Some services failed to start. Check logs with: docker-compose logs
    pause
    exit /b 1
)

pause
