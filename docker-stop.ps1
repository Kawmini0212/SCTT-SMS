# Docker Stop Script
# This script stops all Docker containers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Stopping Student Management System..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

docker-compose down

Write-Host ""
Write-Host "✓ All containers stopped" -ForegroundColor Green
Write-Host ""
Write-Host "To remove all data (including database):" -ForegroundColor Yellow
Write-Host "  docker-compose down -v" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
