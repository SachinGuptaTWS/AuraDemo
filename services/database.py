# Database abstraction layer
# Currently using in-memory dict, will be replaced with Cosmos DB

from typing import Dict, Optional, List
from datetime import datetime
import asyncio

class Database:
    """
    Database abstraction layer.
    TODO: Replace with actual Cosmos DB implementation.
    """
    
    def __init__(self):
        # In-memory storage (for development)
        self.products: Dict[str, dict] = {}
        self.sessions: Dict[str, dict] = {}
        self.bookings: Dict[str, dict] = {}
        self.training_progress: Dict[str, dict] = {}
    
    # Product operations
    async def create_product(self, product_data: dict):
        self.products[product_data["id"]] = product_data
        return product_data
    
    async def get_product(self, product_id: str) -> Optional[dict]:
        return self.products.get(product_id)
    
    async def update_product(self, product_id: str, updates: dict):
        if product_id in self.products:
            self.products[product_id].update(updates)
            return self.products[product_id]
        return None
    
    async def list_products(self, seller_id: Optional[str] = None) -> List[dict]:
        products = list(self.products.values())
        if seller_id:
            products = [p for p in products if p["seller_id"] == seller_id]
        return products
    
    # Session operations
    async def create_session(self, session_data: dict):
        self.sessions[session_data["id"]] = session_data
        return session_data
    
    async def get_session(self, session_id: str) -> Optional[dict]:
        return self.sessions.get(session_id)
    
    async def update_session(self, session_id: str, updates: dict):
        if session_id in self.sessions:
            self.sessions[session_id].update(updates)
            return self.sessions[session_id]
        return None
    
    # Booking operations
    async def create_booking(self, booking_data: dict):
        self.bookings[booking_data["id"]] = booking_data
        return booking_data
    
    async def get_booking(self, booking_id: str) -> Optional[dict]:
        return self.bookings.get(booking_id)
    
    async def update_booking(self, booking_id: str, updates: dict):
        if booking_id in self.bookings:
            self.bookings[booking_id].update(updates)
            return self.bookings[booking_id]
        return None
    
    # Training progress
    async def set_training_progress(self, product_id: str, progress_data: dict):
        self.training_progress[product_id] = progress_data
    
    async def get_training_progress(self, product_id: str) -> dict:
        return self.training_progress.get(product_id, {
            "progress": 0,
            "current_step": "Not started"
        })

# Global database instance
db = Database()
