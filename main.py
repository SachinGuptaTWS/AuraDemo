import asyncio
import os
from config import config
from orchestrator import Orchestrator

async def main():
    print(f"Starting AuraDemo in '{config.APP_ENV}' mode...")
    
    orchestrator = Orchestrator()
    try:
        await orchestrator.start()
    except KeyboardInterrupt:
        print("\nStopping...")
        await orchestrator.stop()

if __name__ == "__main__":
    asyncio.run(main())
