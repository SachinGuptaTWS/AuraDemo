# FastAPI Control Plane for AuraDemo
# Manages product training, session provisioning, and bookings

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import training, sessions, bookings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AuraDemo Control Plane",
    description="API for managing AI sales demos",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(training.router, prefix="/v1/training", tags=["Training"])
app.include_router(sessions.router, prefix="/v1/sessions", tags=["Sessions"])
app.include_router(bookings.router, prefix="/v1/bookings", tags=["Bookings"])

@app.get("/")
async def root():
    return {
        "service": "AuraDemo Control Plane",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
