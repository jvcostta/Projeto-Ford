#!/bin/bash

# Ford User Management - Setup Script
echo "🚗 Ford User Management Platform - Setup"
echo "========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "Warning: .env.example not found, using default .env"
fi

echo "🔧 Building and starting services..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:4200"
    echo "   Backend API: http://localhost:8080"
    echo "   Swagger UI: http://localhost:8080/swagger-ui.html"
    echo ""
    echo "👤 Test Credentials:"
    echo "   Admin: admin@ford.com / Admin@123"
    echo "   User: user@ford.com / User@123"
    echo ""
    echo "🔍 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
