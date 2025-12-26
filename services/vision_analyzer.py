# Vision Analyzer - Uses GPT-4o Vision to understand UI

import base64
import logging
from openai import AsyncOpenAI
from config import config

logger = logging.getLogger(__name__)

class VisionAnalyzer:
    """
    Analyzes screenshots using GPT-4o Vision.
    Identifies UI elements, describes functionality, suggests navigation.
    """
    
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=config.AZURE_OPENAI_API_KEY,
            base_url=f"{config.AZURE_OPENAI_ENDPOINT}/openai/deployments/{config.AZURE_OPENAI_DEPLOYMENT}"
        )
    
    async def analyze_screenshot(self, screenshot_bytes: bytes) -> dict:
        """
        Analyze a screenshot and return structured data about UI elements.
        """
        try:
            # Convert to base64
            screenshot_base64 = base64.b64encode(screenshot_bytes).decode('utf-8')
            
            # Call GPT-4o Vision
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a UI analyzer. Identify all interactive elements (buttons, links, forms) in the screenshot. Return a structured list."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Analyze this UI and list all clickable elements with their purpose."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{screenshot_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=1000
            )
            
            analysis = response.choices[0].message.content
            logger.info(f"Vision analysis: {analysis[:200]}...")
            
            return {
                "analysis": analysis,
                "elements": []  # TODO: Parse structured elements
            }
            
        except Exception as e:
            logger.error(f"Vision analysis failed: {e}")
            return {"analysis": "", "elements": []}
    
    async def tag_elements(self, elements: list, screenshot_bytes: bytes) -> list:
        """
        For each element, get semantic labeling.
        """
        # TODO: Implement element tagging
        return elements
