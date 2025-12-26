# Pydantic models for API requests/responses

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

# Product Models
class ProductCredentials(BaseModel):
    username: str
    password: str

class ProductCreate(BaseModel):
    name: str = Field(..., description="Product name")
    url: str = Field(..., description="Product URL")
    credentials: ProductCredentials
    seller_id: str = Field(..., description="Seller/company ID")
    
class Product(BaseModel):
    id: str
    seller_id: str
    name: str
    url: str
    training_status: str = "pending"  # pending, in_progress, completed, failed
    element_map: Optional[Dict] = None
    demo_script: Optional[List[Dict]] = None
    created_at: datetime
    updated_at: datetime

# Training Models
class TrainingStartRequest(BaseModel):
    product_id: str
    include_docs: bool = False
    doc_urls: Optional[List[str]] = None

class TrainingStatus(BaseModel):
    product_id: str
    status: str
    progress: int = Field(..., ge=0, le=100)
    current_step: str
    error: Optional[str] = None

# Session Models
class SessionCreate(BaseModel):
    product_id: str
    buyer_email: str
    buyer_name: Optional[str] = None
    language: str = "en-IN"  # en-IN, hi-IN
    mode: str = "instant"  # instant or scheduled

class Session(BaseModel):
    id: str
    product_id: str
    buyer_email: str
    buyer_name: Optional[str]
    language: str
    status: str  # provisioning, ready, active, completed, failed
    connection_token: Optional[str] = None
    meet_link: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

# Booking Models
class BookingCreate(BaseModel):
    product_id: str
    buyer_email: str
    buyer_name: str
    language: str = "en-IN"
    preferred_time: datetime
    timezone: str = "Asia/Kolkata"

class Booking(BaseModel):
    id: str
    product_id: str
    buyer_email: str
    buyer_name: str
    language: str
    scheduled_at: datetime
    meet_link: str
    status: str  # scheduled, completed, cancelled
    created_at: datetime
