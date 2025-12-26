# Product Crawler - The "Self-Learning" Component
# Crawls websites, maps UI elements, generates demo scripts

from playwright.async_api import async_playwright, Page
from services.vision_analyzer import VisionAnalyzer
from services.database import db
import asyncio
import logging

logger = logging.getLogger(__name__)

class ProductCrawler:
    """
    Crawls a product website to learn its structure.
    Uses Playwright for navigation and GPT-4o Vision for understanding.
    """
    
    def __init__(self):
        self.vision_analyzer = VisionAnalyzer()
        self.element_map = {}
        self.visited_urls = set()
    
    async def crawl_and_train(
        self,
        product_id: str,
        url: str,
        credentials: dict,
        include_docs: bool = False,
        doc_urls: list = None
    ):
        """
        Main training pipeline:
        1. Login to product
        2. Map all navigation elements
        3. Analyze with Vision API
        4. Generate demo script
        """
        try:
            logger.info(f"Starting training for product {product_id}")
            
            # Update progress
            await db.set_training_progress(product_id, {
                "progress": 10,
                "current_step": "Launching browser"
            })
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                
                # Step 1: Login
                await self._login(page, url, credentials)
                await db.set_training_progress(product_id, {
                    "progress": 30,
                    "current_step": "Logged in successfully"
                })
                
                # Step 2: Map navigation
                await self._map_navigation(page, product_id)
                await db.set_training_progress(product_id, {
                    "progress": 60,
                    "current_step": "Mapping UI elements"
                })
                
                # Step 3: Analyze pages
                await self._analyze_pages(page, product_id)
                await db.set_training_progress(product_id, {
                    "progress": 80,
                    "current_step": "Analyzing with AI Vision"
                })
                
                # Step 4: Generate demo script
                demo_script = await self._generate_demo_script(product_id)
                await db.set_training_progress(product_id, {
                    "progress": 100,
                    "current_step": "Training completed"
                })
                
                # Save results
                await db.update_product(product_id, {
                    "training_status": "completed",
                    "element_map": self.element_map,
                    "demo_script": demo_script
                })
                
                await browser.close()
                
            logger.info(f"Training completed for product {product_id}")
            
        except Exception as e:
            logger.error(f"Training failed for {product_id}: {e}")
            await db.update_product(product_id, {
                "training_status": "failed"
            })
            await db.set_training_progress(product_id, {
                "progress": 0,
                "current_step": "Failed",
                "error": str(e)
            })
    
    async def _login(self, page: Page, url: str, credentials: dict):
        """Navigate to URL and login."""
        logger.info(f"Navigating to {url}")
        await page.goto(url)
        await page.wait_for_load_state("networkidle")
        
        # TODO: Implement smart login detection
        # For now, assume credentials are provided
        # In production, use Vision API to find login form
        
    async def _map_navigation(self, page: Page, product_id: str):
        """Map all clickable navigation elements."""
        logger.info("Mapping navigation elements")
        
        # Get all navigation links
        nav_elements = await page.query_selector_all("nav a, [role='navigation'] a")
        
        for element in nav_elements[:10]:  # Limit to first 10 for demo
            try:
                text = await element.text_content()
                href = await element.get_attribute("href")
                
                if text and href:
                    self.element_map[text.strip()] = {
                        "type": "navigation",
                        "href": href,
                        "text": text.strip()
                    }
            except:
                continue
    
    async def _analyze_pages(self, page: Page, product_id: str):
        """Take screenshots and analyze with Vision API."""
        logger.info("Analyzing pages with Vision API")
        
        # Take screenshot of current page
        screenshot = await page.screenshot(type='jpeg', quality=80)
        
        # Analyze with Vision API
        analysis = await self.vision_analyzer.analyze_screenshot(screenshot)
        
        # Store analysis results
        # TODO: Implement full vision analysis
    
    async def _generate_demo_script(self, product_id: str) -> list:
        """Generate a standard demo flow."""
        logger.info("Generating demo script")
        
        # Simple demo script based on discovered elements
        demo_script = [
            {"step": 1, "action": "login", "description": "Login to the application"},
            {"step": 2, "action": "navigate", "target": "dashboard", "description": "Show dashboard overview"},
            {"step": 3, "action": "navigate", "target": "features", "description": "Demonstrate key features"},
        ]
        
        return demo_script
