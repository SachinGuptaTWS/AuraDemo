import logging
import re

logger = logging.getLogger(__name__)

class SecurityGuardrails:
    """
    Security and compliance features:
    - Prohibited actions list
    - PII redaction
    - Dangerous selector blocking
    """
    
    def __init__(self):
        # Prohibited keywords that should never be clicked
        self.prohibited_keywords = [
            "delete account",
            "remove user",
            "cancel subscription",
            "terminate",
            "destroy",
            "drop database",
            "clear all data",
            "factory reset"
        ]
        
        # Prohibited CSS selectors
        self.prohibited_selectors = [
            "[data-action='delete']",
            "[data-danger='true']",
            ".btn-danger.delete",
            "#delete-account-btn"
        ]
        
        # PII patterns to redact
        self.pii_patterns = {
            "credit_card": re.compile(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b'),
            "ssn": re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),
            "email": re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
            "phone": re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b')
        }
    
    def is_action_prohibited(self, selector: str, description: str = "") -> bool:
        """
        Check if an action should be blocked.
        
        Args:
            selector: CSS selector or text description
            description: Optional description of the element
            
        Returns:
            True if action is prohibited
        """
        # Check keywords
        combined_text = f"{selector} {description}".lower()
        for keyword in self.prohibited_keywords:
            if keyword in combined_text:
                logger.warning(f"BLOCKED: Prohibited keyword '{keyword}' detected")
                return True
        
        # Check selectors
        for prohibited in self.prohibited_selectors:
            if prohibited in selector:
                logger.warning(f"BLOCKED: Prohibited selector '{prohibited}' detected")
                return True
        
        return False
    
    def redact_pii(self, text: str) -> str:
        """
        Redact PII from text before AI reads it aloud.
        
        Args:
            text: Text to redact
            
        Returns:
            Redacted text
        """
        redacted = text
        
        # Redact credit cards
        redacted = self.pii_patterns["credit_card"].sub("[CARD NUMBER REDACTED]", redacted)
        
        # Redact SSN
        redacted = self.pii_patterns["ssn"].sub("[SSN REDACTED]", redacted)
        
        # Partially redact emails (keep domain)
        def redact_email(match):
            email = match.group(0)
            parts = email.split('@')
            if len(parts) == 2:
                return f"***@{parts[1]}"
            return "[EMAIL REDACTED]"
        
        redacted = self.pii_patterns["email"].sub(redact_email, redacted)
        
        # Redact phone numbers
        redacted = self.pii_patterns["phone"].sub("[PHONE REDACTED]", redacted)
        
        if redacted != text:
            logger.info("PII redacted from text")
        
        return redacted
    
    def validate_url(self, url: str, allowed_domains: list) -> bool:
        """
        Validate that navigation stays within allowed domains.
        
        Args:
            url: URL to navigate to
            allowed_domains: List of allowed domain patterns
            
        Returns:
            True if URL is allowed
        """
        if not allowed_domains:
            return True  # No restrictions
        
        for domain in allowed_domains:
            if domain in url:
                return True
        
        logger.warning(f"BLOCKED: Navigation to {url} not in allowed domains")
        return False
