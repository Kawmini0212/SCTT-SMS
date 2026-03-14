# Docker Quick Start Script
# This script helps you start the entire Student Management System using Docker

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Management System - Docker Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed and running
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not found"
    }
    Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop:" -ForegroundColor Yellow
    Write-Host "1. Run Docker Desktop Installer.exe" -ForegroundColor White
    Write-Host "2. Restart your computer if prompted" -ForegroundColor White
    Write-Host "3. Start Docker Desktop" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Desktop is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop and wait for it to be ready" -ForegroundColor Yellow
    Write-Host "Then run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Student Management System..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop any running containers
Write-Host "Stopping any existing containers..." -ForegroundColor Yellow
docker-compose down 2>&1 | Out-Null

Write-Host "Building and starting all services..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""

# Start services
docker-compose up --build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application stopped" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
