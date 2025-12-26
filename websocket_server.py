import asyncio
import websockets
import json
import logging
from orchestrator import Orchestrator

logger = logging.getLogger(__name__)

class WebSocketServer:
    """
    WebSocket server to handle frontend connections.
    Bridges the web UI with the backend orchestrator.
    """
    
    def __init__(self, host="0.0.0.0", port=8080):
        self.host = host
        self.port = port
        self.active_sessions = {}
    
    async def handle_client(self, websocket):
        session_id = id(websocket)
        logger.info(f"New client connected: {session_id}")
        
        try:
            # Create a new orchestrator instance for this session
            orchestrator = Orchestrator(websocket=websocket)
            self.active_sessions[session_id] = {
                'websocket': websocket,
                'orchestrator': orchestrator
            }
            
            # Start the orchestrator in background
            asyncio.create_task(orchestrator.start())
            
            # Listen for messages from frontend
            async for message in websocket:
                data = json.loads(message)
                
                if data['type'] == 'audio_input':
                    # Forward audio to Realtime API
                    # This would require audio handling in realtime_client
                    pass
                
                elif data['type'] == 'text_input':
                    # Send text message to AI
                    text = data['text']
                    # orchestrator.send_text(text)
                    pass
            
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"Client disconnected: {session_id}")
        finally:
            if session_id in self.active_sessions:
                await self.active_sessions[session_id]['orchestrator'].stop()
                del self.active_sessions[session_id]
    
    async def start(self):
        logger.info(f"Starting WebSocket server on {self.host}:{self.port}")
        async with websockets.serve(self.handle_client, self.host, self.port):
            await asyncio.Future()  # Run forever

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    server = WebSocketServer()
    asyncio.run(server.start())
