# PowerShell script to start the Control Plane API

Write-Host "🚀 Starting AuraDemo Control Plane API..." -ForegroundColor Cyan

# Activate virtual environment
& .\.venv\Scripts\Activate.ps1

# Install/update dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Start FastAPI server
Write-Host "🌐 Starting API server on http://localhost:8000" -ForegroundColor Green
Write-Host "📚 API docs available at http://localhost:8000/docs" -ForegroundColor Green

python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
