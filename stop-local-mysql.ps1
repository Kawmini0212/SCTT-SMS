# Stop Local MySQL Service
# Run this as Administrator

Write-Host "Stopping local MySQL service..." -ForegroundColor Yellow
Write-Host ""

try {
    Stop-Service -Name MySQL80 -Force -ErrorAction Stop
    Write-Host "✓ MySQL80 service stopped successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to stop MySQL80 service" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run this script as Administrator:" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell -> Run as Administrator" -ForegroundColor White
    Write-Host "Then run: .\stop-local-mysql.ps1" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to continue"
