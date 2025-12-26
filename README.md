# Azure-Sonik Agent

An autonomous AI Sales Agent built with Azure OpenAI Realtime API that conducts live product demonstrations through browser automation.

## Features

- 🎯 **Instant Demos**: Zero-wait product demonstrations
- 🗣️ **Voice Interaction**: Full-duplex audio conversation with <400ms latency
- 🖱️ **Live Browser Control**: Real-time navigation, clicking, and form filling
- 👁️ **Vision-Aware**: AI can see and reference what's on screen
- 🧠 **Knowledge Integration**: RAG-powered answers from your documentation
- 🌐 **Web Interface**: Beautiful, responsive frontend for users

## Architecture

```
User Browser (WebRTC) ←→ WebSocket Server ←→ Orchestrator
                                                    ↓
                                    ┌───────────────┼───────────────┐
                                    ↓               ↓               ↓
                            Azure OpenAI    Browser Manager   RAG Service
                            (Realtime API)   (Playwright)   (AI Search)
```

## Quick Start

### Local Development

1. **Install Dependencies**
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

2. **Configure Environment**
Create `.env.dev`:
```env
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4.1
```

3. **Run the Application**
```bash
# Backend
python websocket_server.py

# Open frontend/index.html in browser
```

### Docker Deployment

```bash
docker-compose up --build
```

### Azure Container Apps

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guide.

## Project Structure

```
AuraDemo/
├── services/
│   ├── realtime_client.py    # Azure OpenAI connection
│   ├── browser_manager.py    # Playwright automation
│   ├── rag_service.py         # Azure AI Search
│   ├── audio_handler.py       # Audio I/O
│   └── video_stream.py        # Video streaming
├── tools/
│   └── definitions.py         # Tool schemas
├── frontend/
│   └── index.html             # Web UI
├── orchestrator.py            # Main coordinator
├── websocket_server.py        # WebSocket server
├── config.py                  # Configuration
└── main.py                    # CLI entry point
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | Yes |
| `AZURE_OPENAI_API_KEY` | API key | Yes |
| `AZURE_OPENAI_API_VERSION` | API version | Yes |
| `AZURE_OPENAI_DEPLOYMENT` | Deployment name | Yes |
| `AZURE_SEARCH_ENDPOINT` | AI Search endpoint | No |
| `AZURE_SEARCH_KEY` | AI Search key | No |
| `APP_ENV` | Environment (dev/stage/prod) | No |

## Usage

### Web Interface
1. Open `frontend/index.html`
2. Click "Start Live Demo"
3. Speak to the AI agent
4. Watch it navigate and demonstrate features

### CLI Mode
```bash
python main.py
```

## Development

### Adding New Browser Actions
Edit `tools/definitions.py` to add new actions to the schema.

### Customizing AI Behavior
Modify the system prompt in `realtime_client.py`:
```python
"instructions": "You are a senior solutions engineer..."
```

### Adding Knowledge Base
Use `rag_service.py` to ingest documents:
```python
await rag_service.ingest_document(
    title="Product Guide",
    content="...",
    source="docs/guide.pdf"
)
```

## Troubleshooting

### Connection Issues
- Verify Azure OpenAI endpoint and deployment name
- Check API version compatibility
- Ensure Realtime API is enabled in your region

### Browser Automation Fails
- Check Playwright installation: `playwright install chromium`
- Verify selectors in browser_manager.py
- Enable headless=False for debugging

### Audio Not Working
- Check microphone permissions
- Verify PyAudio installation
- Test with different sample rates

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
