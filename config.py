import os
import sys
from dotenv import load_dotenv

class Config:
    def __init__(self):
        self.APP_ENV = os.getenv("APP_ENV", "dev")
        self.load_env_file()
        
        self.AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
        self.AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
        self.AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")
        
        if not all([self.AZURE_OPENAI_ENDPOINT, self.AZURE_OPENAI_API_KEY, self.AZURE_OPENAI_DEPLOYMENT]):
            print("ERROR: Missing Azure OpenAI configuration in .env file.")
            sys.exit(1)

    def load_env_file(self):
        env_file = f".env.{self.APP_ENV}"
        if os.path.exists(env_file):
            print(f"Loading config from {env_file}")
            load_dotenv(env_file)
        else:
            print(f"Warning: {env_file} not found. using default environment variables.")

config = Config()
