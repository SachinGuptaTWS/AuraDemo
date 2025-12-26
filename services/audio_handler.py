import asyncio
import logging
import pyaudio
import wave
import base64
from io import BytesIO

logger = logging.getLogger(__name__)

class AudioHandler:
    """
    Handles microphone input and speaker output for real-time audio streaming.
    Integrates with Azure OpenAI Realtime API's audio capabilities.
    """
    
    def __init__(self, sample_rate=24000, channels=1, chunk_size=1024):
        self.sample_rate = sample_rate
        self.channels = channels
        self.chunk_size = chunk_size
        self.audio = None
        self.input_stream = None
        self.output_stream = None
        self.is_recording = False
        self.is_playing = False
        
    async def initialize(self):
        """Initialize PyAudio"""
        try:
            self.audio = pyaudio.PyAudio()
            logger.info("Audio handler initialized")
        except Exception as e:
            logger.error(f"Failed to initialize audio: {e}")
    
    async def start_microphone(self, callback):
        """
        Start capturing microphone input.
        
        Args:
            callback: Async function to call with audio chunks
        """
        if self.is_recording:
            return
        
        try:
            self.input_stream = self.audio.open(
                format=pyaudio.paInt16,
                channels=self.channels,
                rate=self.sample_rate,
                input=True,
                frames_per_buffer=self.chunk_size,
                stream_callback=lambda in_data, frame_count, time_info, status: 
                    self._mic_callback(in_data, callback)
            )
            
            self.is_recording = True
            self.input_stream.start_stream()
            logger.info("Microphone started")
            
        except Exception as e:
            logger.error(f"Failed to start microphone: {e}")
    
    def _mic_callback(self, in_data, callback):
        """Internal callback for microphone stream"""
        if self.is_recording:
            # Convert to base64 and send to callback
            audio_base64 = base64.b64encode(in_data).decode('utf-8')
            asyncio.create_task(callback(audio_base64))
        return (None, pyaudio.paContinue)
    
    async def stop_microphone(self):
        """Stop microphone capture"""
        if self.input_stream:
            self.is_recording = False
            self.input_stream.stop_stream()
            self.input_stream.close()
            logger.info("Microphone stopped")
    
    async def play_audio(self, audio_base64: str):
        """
        Play audio through speakers.
        
        Args:
            audio_base64: Base64 encoded audio data
        """
        try:
            audio_bytes = base64.b64decode(audio_base64)
            
            if not self.output_stream:
                self.output_stream = self.audio.open(
                    format=pyaudio.paInt16,
                    channels=self.channels,
                    rate=self.sample_rate,
                    output=True
                )
            
            self.output_stream.write(audio_bytes)
            
        except Exception as e:
            logger.error(f"Failed to play audio: {e}")
    
    async def cleanup(self):
        """Clean up audio resources"""
        await self.stop_microphone()
        
        if self.output_stream:
            self.output_stream.stop_stream()
            self.output_stream.close()
        
        if self.audio:
            self.audio.terminate()
        
        logger.info("Audio handler cleaned up")
