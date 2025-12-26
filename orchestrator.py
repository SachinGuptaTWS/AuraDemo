import json
import asyncio
from services.realtime_client import RealtimeClient
from services.browser_manager import BrowserManager
from services.video_stream import VideoStream

class Orchestrator:
    def __init__(self, websocket=None):
        self.websocket = websocket
        self.realtime_client = RealtimeClient()
        self.browser_manager = BrowserManager()
        self.video_stream = VideoStream()
        
    async def start(self):
        print("Orchestrator starting...")
        
        # Start Browser
        await self.browser_manager.start_browser()
        
        # Start Video Stream (Stub)
        await self.video_stream.start()
        
        # Setup Callbacks
        self.realtime_client.set_on_tool_call(self.handle_tool_call)
        
        # Connect to AI
        await self.realtime_client.connect()
        
        # Start Vision Loop
        asyncio.create_task(self.vision_loop())
        
        # Keep alive
        while True:
            await asyncio.sleep(1)

    async def stop(self):
        await self.video_stream.stop()
        await self.realtime_client.close()
        await self.browser_manager.close()

    async def handle_tool_call(self, call_id, name, args):
        print(f"Tool Call: {name} args={args}")
        
        if name == "browser_action":
            try:
                arguments = json.loads(args)
                action = arguments.get("action")
                selector = arguments.get("selector")
                value = arguments.get("value")
                
                result = await self.browser_manager.do_action(action, selector, value)
            except Exception as e:
                result = f"Error processing arguments: {e}"
        else:
            result = f"Unknown tool: {name}"
            
        await self.realtime_client.send_tool_output(call_id, result)

    async def vision_loop(self):
        print("Vision Loop started.")
        screenshot_count = 0
        
        while True:
            await asyncio.sleep(2)  # Send to OpenAI every 2 seconds (as per PRD)
            try:
                screenshot_base64 = await self.browser_manager.get_screenshot_base64()
                if screenshot_base64:
                    screenshot_count += 1
                    
                    # Send to OpenAI for vision analysis (AI can "see" the page)
                    await self.realtime_client.send_image(screenshot_base64)
                    print(f"👁️  Sent screenshot #{screenshot_count} to OpenAI for vision analysis")
                    
                    # Also send to frontend for user display (every other frame to reduce bandwidth)
                    if screenshot_count % 2 == 0 and self.websocket:
                        await self.websocket.send(json.dumps({
                            'type': 'video_frame',
                            'data': screenshot_base64,
                            'timestamp': asyncio.get_event_loop().time()
                        }))
                        print("📸 Sent video frame to frontend")
                        
            except Exception as e:
                print(f"Vision loop error: {e}")
