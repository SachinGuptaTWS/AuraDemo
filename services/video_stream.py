import logging
import asyncio

logger = logging.getLogger(__name__)

class VideoStream:
    def __init__(self):
        self.is_streaming = False

    async def start(self):
        logger.info("Starting Video Stream (Stub)...")
        self.is_streaming = True
        asyncio.create_task(self._stream_loop())

    async def stop(self):
        logger.info("Stopping Video Stream...")
        self.is_streaming = False

    async def _stream_loop(self):
        logger.info("Video Stream Loop Active (Stub)")
        while self.is_streaming:
            # In a real app, this would pick up frames from BrowserManager
            # and send them to the WebRTC peer.
            await asyncio.sleep(1)
            # logger.debug("Sent frame...")
