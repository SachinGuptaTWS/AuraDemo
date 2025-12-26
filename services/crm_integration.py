import logging
import requests
import os
from datetime import datetime

logger = logging.getLogger(__name__)

class CRMIntegration:
    """
    HubSpot and Salesforce CRM integration.
    Handles lead lookup, call logging, and deal scoring.
    """
    
    def __init__(self):
        self.hubspot_key = os.getenv("HUBSPOT_API_KEY", "")
        self.salesforce_enabled = False  # Implement if needed
        self.enabled = bool(self.hubspot_key)
    
    async def check_lead_exists(self, email: str) -> dict:
        """Check if email exists in CRM"""
        if not self.enabled:
            return {"exists": False}
        
        try:
            url = f"https://api.hubapi.com/contacts/v1/contact/email/{email}/profile"
            headers = {"Authorization": f"Bearer {self.hubspot_key}"}
            
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "exists": True,
                    "contact_id": data.get("vid"),
                    "company": data.get("properties", {}).get("company", {}).get("value"),
                    "lifecycle_stage": data.get("properties", {}).get("lifecyclestage", {}).get("value")
                }
            else:
                return {"exists": False}
                
        except Exception as e:
            logger.error(f"CRM lookup failed: {e}")
            return {"exists": False}
    
    async def log_demo_call(self, email: str, session_data: dict):
        """Log the demo call to CRM"""
        if not self.enabled:
            return
        
        try:
            # Create engagement in HubSpot
            url = "https://api.hubapi.com/engagements/v1/engagements"
            headers = {
                "Authorization": f"Bearer {self.hubspot_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "engagement": {
                    "active": True,
                    "type": "CALL",
                    "timestamp": int(datetime.utcnow().timestamp() * 1000)
                },
                "associations": {
                    "contactIds": [session_data.get("contact_id")]
                },
                "metadata": {
                    "toNumber": "",
                    "fromNumber": "AI Agent",
                    "status": "COMPLETED",
                    "durationMilliseconds": session_data.get("duration", 0) * 1000,
                    "body": f"AI Demo Call - Qualification Score: {session_data.get('qualification_score', 0)}/100"
                }
            }
            
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                logger.info(f"Logged call to HubSpot for {email}")
            else:
                logger.error(f"Failed to log call: {response.text}")
                
        except Exception as e:
            logger.error(f"CRM logging failed: {e}")
    
    async def update_deal_score(self, contact_id: str, score: int):
        """Update qualification score in CRM"""
        if not self.enabled:
            return
        
        try:
            # Update custom property in HubSpot
            url = f"https://api.hubapi.com/contacts/v1/contact/vid/{contact_id}/profile"
            headers = {
                "Authorization": f"Bearer {self.hubspot_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "properties": [
                    {
                        "property": "ai_demo_score",
                        "value": str(score)
                    }
                ]
            }
            
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 204:
                logger.info(f"Updated deal score for contact {contact_id}")
            
        except Exception as e:
            logger.error(f"Failed to update deal score: {e}")
