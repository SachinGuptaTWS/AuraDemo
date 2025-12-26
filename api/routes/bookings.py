# Booking endpoints - Schedule demos

from fastapi import APIRouter, HTTPException
from api.models.schemas import BookingCreate, Booking
from services.calendar_service import CalendarService
from services.database import db
import uuid
from datetime import datetime

router = APIRouter()
calendar_service = CalendarService()

@router.post("/create", response_model=Booking)
async def create_booking(request: BookingCreate):
    """
    Schedule a demo for later.
    Creates Google Meet link and sends calendar invite.
    """
    # Validate product
    product = await db.get_product(request.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create Google Meet link
    meet_link = await calendar_service.create_meet_link(
        buyer_email=request.buyer_email,
        buyer_name=request.buyer_name,
        product_name=product["name"],
        scheduled_time=request.preferred_time,
        timezone=request.timezone
    )
    
    # Create booking
    booking_id = f"book_{uuid.uuid4().hex[:12]}"
    
    booking_data = {
        "id": booking_id,
        "product_id": request.product_id,
        "buyer_email": request.buyer_email,
        "buyer_name": request.buyer_name,
        "language": request.language,
        "scheduled_at": request.preferred_time,
        "meet_link": meet_link,
        "status": "scheduled",
        "created_at": datetime.utcnow()
    }
    
    await db.create_booking(booking_data)
    
    # Send email invitation
    await calendar_service.send_invite(
        buyer_email=request.buyer_email,
        buyer_name=request.buyer_name,
        product_name=product["name"],
        meet_link=meet_link,
        scheduled_time=request.preferred_time
    )
    
    return Booking(**booking_data)

@router.get("/{booking_id}")
async def get_booking(booking_id: str):
    """Get booking details."""
    booking = await db.get_booking(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return Booking(**booking)

@router.post("/{booking_id}/cancel")
async def cancel_booking(booking_id: str):
    """Cancel a scheduled booking."""
    booking = await db.get_booking(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Update status
    await db.update_booking(booking_id, {
        "status": "cancelled"
    })
    
    # TODO: Send cancellation email
    
    return {"message": "Booking cancelled successfully"}
