import logging
import base64
from playwright.async_api import async_playwright, Page, BrowserContext
from services.security_guardrails import SecurityGuardrails

logger = logging.getLogger(__name__)

class BrowserManager:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
        self.security = SecurityGuardrails()

    async def start_browser(self):
        logger.info("Starting Browser Manager...")
        self.playwright = await async_playwright().start()
        # Launch headless for now, or new_head=False to see it if local
        self.browser = await self.playwright.chromium.launch(headless=False, args=["--start-maximized"]) 
        self.context = await self.browser.new_context(no_viewport=True)
        self.page = await self.context.new_page()
        logger.info("Browser started.")

    async def do_action(self, action, selector, value=None):
        """
        Executes a browser action based on the tool call.
        """
        logger.info(f"Executing action: {action} on {selector} (value={value})")
        
        # Security check
        if action == "click":
            if self.security.is_action_prohibited(selector, value or ""):
                return "Action blocked by security guardrails"
        
        try:
            if action == "goto":
                await self.navigate(value)
                return f"Navigated to {value}"
                
            elif action == "click":
                await self.click(selector)
                return f"Clicked {selector}"
                
            elif action == "type":
                await self.type_text(selector, value)
                return f"Typed '{value}' into {selector}"
                
            elif action == "scroll":
                await self.scroll(selector) # selector implies direction here? Or just generic scroll
                return f"Scrolled {selector}"

            elif action == "hover":
                await self.page.hover(selector)
                return f"Hovered over {selector}"

            else:
                return f"Unknown action: {action}"
                
        except Exception as e:
            logger.error(f"Action failed: {e}")
            return f"Error executing {action}: {str(e)}"

    async def navigate(self, url):
        if not url.startswith("http"):
            url = "https://" + url
        await self.page.goto(url)
        await self.page.wait_for_load_state("domcontentloaded")

    async def click(self, selector):
        # Determine if selector is text or css
        if "text=" not in selector and not selector.startswith("#") and not selector.startswith("."):
            # Try text matching first if generic string
            try:
                await self.page.click(f"text={selector}", timeout=2000)
                return
            except:
                pass
        
        await self.page.click(selector)

    async def type_text(self, selector, text):
        await self.page.fill(selector, text)

    async def scroll(self, direction="down"):
        if "up" in direction.lower():
            await self.page.evaluate("window.scrollBy(0, -500)")
        else:
            await self.page.evaluate("window.scrollBy(0, 500)")

    async def get_screenshot_base64(self):
        if not self.page:
            return None
        # Playwright screenshot returns PNG by default, quality param only works with JPEG
        screenshot_bytes = await self.page.screenshot(type='jpeg', quality=50)
        return base64.b64encode(screenshot_bytes).decode('utf-8')

    async def close(self):
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
