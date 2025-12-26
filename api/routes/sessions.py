# Session endpoints - Live demo management

from fastapi import APIRouter, HTTPException, BackgroundTasks
from api.models.schemas import SessionCreate, Session
from services.session_manager import SessionManager
from services.database import db
import uuid
from datetime import datetime

router = APIRouter()
session_manager = SessionManager()

@router.post("/start", response_model=Session)
async def create_session(
    request: SessionCreate,
    background_tasks: BackgroundTasks
):
    """
    Start a new demo session.
    This provisions a container and prepares the AI agent.
    """
    # Validate product exists and is trained
    product = await db.get_product(request.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["training_status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail="Product training not completed"
        )
    
    # Create session
    session_id = f"sess_{uuid.uuid4().hex[:12]}"
    
    session_data = {
        "id": session_id,
        "product_id": request.product_id,
        "buyer_email": request.buyer_email,
        "buyer_name": request.buyer_name,
        "language": request.language,
        "status": "provisioning",
        "connection_token": None,
        "meet_link": None,
        "created_at": datetime.utcnow(),
        "started_at": None,
        "ended_at": None
    }
    
    await db.create_session(session_data)
    
    # Provision session in background
    background_tasks.add_task(
        session_manager.provision_session,
        session_id=session_id,
        product=product,
        language=request.language,
        mode=request.mode
    )
    
    return Session(**session_data)

@router.get("/{session_id}/status")
async def get_session_status(session_id: str):
    """
    Get current session status.
    Frontend polls this to know when demo is ready.
    """
    session = await db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "status": session["status"],
        "meet_link": session.get("meet_link"),
        "connection_token": session.get("connection_token")
    }

@router.post("/{session_id}/end")
async def end_session(session_id: str):
    """
    End a demo session and cleanup resources.
    """
    session = await db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Stop the container/orchestrator
    await session_manager.end_session(session_id)
    
    # Update database
    await db.update_session(session_id, {
        "status": "completed",
        "ended_at": datetime.utcnow()
    })
    
    return {"message": "Session ended successfully"}

@router.get("/{session_id}")
async def get_session(session_id: str):
    """Get full session details."""
    session = await db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return Session(**session)
