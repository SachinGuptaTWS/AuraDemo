import logging
from azure.cosmos import CosmosClient, PartitionKey
from datetime import datetime
import os
import json

logger = logging.getLogger(__name__)

class SessionLogger:
    """
    Azure Cosmos DB integration for session logging and analytics.
    Stores call recordings, transcripts, and qualification scores.
    """
    
    def __init__(self):
        self.endpoint = os.getenv("COSMOS_ENDPOINT", "")
        self.key = os.getenv("COSMOS_KEY", "")
        self.database_name = "aurademo"
        self.container_name = "sessions"
        
        if not self.endpoint or not self.key:
            logger.warning("Cosmos DB not configured. Session logging disabled.")
            self.enabled = False
            return
        
        self.enabled = True
        self.client = CosmosClient(self.endpoint, self.key)
        self.database = self.client.create_database_if_not_exists(self.database_name)
        self.container = self.database.create_container_if_not_exists(
            id=self.container_name,
            partition_key=PartitionKey(path="/session_id")
        )
    
    async def create_session(self, session_id: str, user_data: dict):
        """Create a new session record"""
        if not self.enabled:
            return
        
        try:
            session = {
                "id": session_id,
                "session_id": session_id,
                "user_email": user_data.get("email"),
                "user_name": user_data.get("name"),
                "company": user_data.get("company"),
                "role": user_data.get("role"),
                "started_at": datetime.utcnow().isoformat(),
                "status": "active",
                "transcript": [],
                "actions": [],
                "qualification_score": 0
            }
            
            self.container.create_item(session)
            logger.info(f"Created session: {session_id}")
            
        except Exception as e:
            logger.error(f"Failed to create session: {e}")
    
    async def log_message(self, session_id: str, speaker: str, message: str):
        """Append a message to the transcript"""
        if not self.enabled:
            return
        
        try:
            session = self.container.read_item(session_id, session_id)
            session["transcript"].append({
                "timestamp": datetime.utcnow().isoformat(),
                "speaker": speaker,
                "message": message
            })
            self.container.replace_item(session_id, session)
            
        except Exception as e:
            logger.error(f"Failed to log message: {e}")
    
    async def log_action(self, session_id: str, action: str, details: dict):
        """Log a browser action"""
        if not self.enabled:
            return
        
        try:
            session = self.container.read_item(session_id, session_id)
            session["actions"].append({
                "timestamp": datetime.utcnow().isoformat(),
                "action": action,
                "details": details
            })
            self.container.replace_item(session_id, session)
            
        except Exception as e:
            logger.error(f"Failed to log action: {e}")
    
    async def end_session(self, session_id: str, qualification_score: int):
        """Mark session as ended and set qualification score"""
        if not self.enabled:
            return
        
        try:
            session = self.container.read_item(session_id, session_id)
            session["ended_at"] = datetime.utcnow().isoformat()
            session["status"] = "completed"
            session["qualification_score"] = qualification_score
            self.container.replace_item(session_id, session)
            
            logger.info(f"Session {session_id} ended. Score: {qualification_score}")
            
        except Exception as e:
            logger.error(f"Failed to end session: {e}")
    
    async def get_session(self, session_id: str):
        """Retrieve session data"""
        if not self.enabled:
            return None
        
        try:
            return self.container.read_item(session_id, session_id)
        except Exception as e:
            logger.error(f"Failed to get session: {e}")
            return None
