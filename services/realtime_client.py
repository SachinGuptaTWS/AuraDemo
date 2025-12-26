import asyncio
import aiohttp
import json
import logging
from config import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RealtimeClient:
    def __init__(self):
        self.endpoint = config.AZURE_OPENAI_ENDPOINT
        self.api_key = config.AZURE_OPENAI_API_KEY
        self.deployment = config.AZURE_OPENAI_DEPLOYMENT
        self.api_version = config.AZURE_OPENAI_API_VERSION
        self.ws = None
        self.on_tool_call_callback = None
    
    def set_on_tool_call(self, callback):
        self.on_tool_call_callback = callback
        
    async def connect(self):
        # Construct WebSocket URL
        # Format: wss://{endpoint}/openai/realtime?api-version={version}&deployment={deployment}
        # Note: endpoint usually starts with https://, need to replace with wss:// or just use host
        
        host = self.endpoint.replace("https://", "").replace("http://", "").rstrip("/")
        url = f"wss://{host}/openai/realtime?api-version={self.api_version}&deployment={self.deployment}"
        
        headers = {
            "api-key": self.api_key,
            "OpenAI-Beta": "realtime=v1"
        }
        
        logger.info(f"Connecting to {url}...")
        print(f"DEBUG: Connecting to URL: {url}")
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.ws_connect(url, headers=headers) as ws:
                    self.ws = ws
                    logger.info("Connected to Azure OpenAI Realtime API!")
                    
                    # Send initial configuration or greeting
                    await self.send_initial_message()
                    
                    # Listen for messages
                    async for msg in ws:
                        if msg.type == aiohttp.WSMsgType.TEXT:
                            data = json.loads(msg.data)
                            await self.handle_message(data)
                        elif msg.type == aiohttp.WSMsgType.ERROR:
                            logger.error("WebSocket connection closed with error %s", ws.exception())
            except Exception as e:
                logger.error(f"Connection failed: {e}")

    async def send_initial_message(self):
        from tools.definitions import tools
        # Session update with tools
        session_update = {
            "type": "session.update",
            "session": {
                "tools": tools,
                "tool_choice": "auto",
            }
        }
        await self.ws.send_json(session_update)
        
        # Trigger a simple response
        event = {
            "type": "response.create",
            "response": {
                "modalities": ["text", "audio"],
                "instructions": "You are Aura, an AI sales agent. You can control the browser. Say hello and ask what I would like to see."
            }
        }
        await self.ws.send_json(event)

    async def send_tool_output(self, call_id, output):
        logger.info(f"Sending tool output for {call_id}: {output}")
        event = {
            "type": "conversation.item.create",
            "item": {
                "type": "function_call_output",
                "call_id": call_id,
                "output": output
            }
        }
        await self.ws.send_json(event)
        
        # Trigger response after tool output
        await self.ws.send_json({"type": "response.create"})

    async def send_image(self, image_base64):
        """
        Send a screenshot to OpenAI for vision analysis.
        This enables the AI to "see" the current browser state.
        """
        logger.info("Sending screenshot to OpenAI for vision analysis")
        
        # Create a conversation item with the image
        event = {
            "type": "conversation.item.create",
            "item": {
                "type": "message",
                "role": "user",
                "content": [
                    {
                        "type": "input_image",
                        "image": f"data:image/jpeg;base64,{image_base64}"
                    }
                ]
            }
        }
        await self.ws.send_json(event)
        
        # Optionally trigger a response to get AI's interpretation
        # await self.ws.send_json({"type": "response.create"})

    async def handle_message(self, data):
        event_type = data.get("type")
        
        if event_type == "response.text.delta":
            print(f"AI: {data.get('delta')}", end="", flush=True)
        elif event_type == "response.audio.transcript.delta":
            # For audio transcript (input or output)
            pass
        elif event_type == "response.function_call_arguments.done":
            # Call ID, name, and arguments are in this event roughly or we accumulate from deltas.
            # Actually, per OpenAI Realtime spec, we might watch for item.created (function_call) 
            # and then updates, OR handling response.function_call_arguments.done is practically easier.
            
            call_id = data.get("call_id")
            name = data.get("name")
            args = data.get("arguments")
            
            if self.on_tool_call_callback:
                # Run in background to not block WS loop
                asyncio.create_task(self.on_tool_call_callback(call_id, name, args))

        elif event_type == "response.done":
            print("\n[Response Complete]")
        elif event_type == "error":
            logger.error(f"Error from API: {data}")

    async def close(self):
        if self.ws:
            await self.ws.close()
