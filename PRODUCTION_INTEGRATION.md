# AzureSonik Production Integration Guide

This guide explains how to connect the frontend to a real backend for production use.

## Architecture Overview

```
User Browser (Frontend)
    ↓
Azure Communication Services (ACS) - Voice/Video
    ↓
Backend Server (Python/Node.js)
    ↓
AI Agent (OpenAI/Azure OpenAI)
    ↓
Headless Browser (Playwright/Puppeteer)
```

## Step 1: Backend Setup

### 1.1 Install Backend Dependencies

```bash
cd ../  # Go to AuraDemo root
pip install -r requirements.txt
```

### 1.2 Configure Environment Variables

Update `.env.prod` with your credentials:

```env
# Azure Communication Services
ACS_CONNECTION_STRING=your_acs_connection_string
ACS_ENDPOINT=https://your-acs-resource.communication.azure.com

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# WebSocket
WEBSOCKET_PORT=8765
```

### 1.3 Start Backend Services

```bash
# Terminal 1: Start WebSocket server
python websocket_server.py

# Terminal 2: Start orchestrator
python orchestrator.py
```

## Step 2: Frontend Integration

### 2.1 Install Azure SDK (if not already installed)

```bash
cd frontend-nextjs
npm install @azure/communication-calling @azure/communication-common
```

### 2.2 Update `useAzureSonik.ts` - Connect Function

Replace the mock `connect` function with real implementation:

```typescript
connect: async (token: string) => {
    if (typeof window === 'undefined') return;

    try {
        set({ status: 'PROVISIONING', error: null });

        // 1. Initialize Azure Communication Services
        const { CallClient } = await import('@azure/communication-calling');
        const { AzureCommunicationTokenCredential } = await import('@azure/communication-common');

        const callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential(token);
        const callAgent = await callClient.createCallAgent(tokenCredential);

        set({ status: 'HANDSHAKE' });

        // 2. Join the call (get call ID from backend)
        const response = await fetch('/api/start-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const { callId, groupId } = await response.json();

        const call = callAgent.join({ groupId });

        // 3. Handle remote video streams
        call.on('remoteParticipantsUpdated', (e) => {
            e.added.forEach((participant) => {
                participant.on('videoStreamsUpdated', (e) => {
                    e.added.forEach((stream) => {
                        const renderer = new VideoStreamRenderer(stream);
                        renderer.createView().then((view) => {
                            set({ videoStream: view.target });
                        });
                    });
                });
            });
        });

        set({ status: 'CONNECTED' });
    } catch (error) {
        console.error('Connection failed:', error);
        set({ status: 'ERROR_VIEW', error: String(error) });
    }
},
```

### 2.3 Create API Route for Token Generation

Create `frontend-nextjs/app/api/token/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
    // Call your backend to get ACS token
    const response = await fetch(`${process.env.BACKEND_URL}/api/token`);
    const { token } = await response.json();
    
    return NextResponse.json({ token });
}
```

### 2.4 Update `page.tsx` to Fetch Real Token

```typescript
const handleEntry = useCallback(async () => {
    // Fetch token from your backend
    const response = await fetch('/api/token');
    const { token } = await response.json();
    
    actions.connect(token);
}, [actions]);
```

## Step 3: WebSocket Integration for Agent Thoughts

### 3.1 Add WebSocket Hook

Create `frontend-nextjs/hooks/useAgentWebSocket.ts`:

```typescript
import { useEffect, useRef } from 'react';
import { useAgentStore } from './useAzureSonik';

export function useAgentWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const { actions } = useAgentStore();

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8765');
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'agent_thinking') {
                // Update control dock text
                actions.setThoughtProcess(data.message);
            } else if (data.type === 'navigation_start') {
                // Trigger latency mask
                actions.showLatencyMask(data.url);
            }
        };

        return () => ws.close();
    }, []);
}
```

### 3.2 Use in `page.tsx`

```typescript
export default function Home() {
    useAgentWebSocket(); // Add this
    // ... rest of component
}
```

## Step 4: Backend API Endpoints

Your backend should expose these endpoints:

### 4.1 `/api/token` - Generate ACS Token

```python
from azure.communication.identity import CommunicationIdentityClient

@app.route('/api/token', methods=['GET'])
def get_token():
    client = CommunicationIdentityClient.from_connection_string(
        os.getenv('ACS_CONNECTION_STRING')
    )
    user = client.create_user()
    token = client.get_token(user, scopes=["voip"])
    
    return jsonify({
        'token': token.token,
        'expiresOn': token.expires_on.isoformat()
    })
```

### 4.2 `/api/start-session` - Initialize Agent Session

```python
@app.route('/api/start-session', methods=['POST'])
def start_session():
    # Create group call
    group_id = str(uuid.uuid4())
    
    # Start headless browser
    browser_session = start_browser_agent(group_id)
    
    return jsonify({
        'groupId': group_id,
        'sessionId': browser_session.id
    })
```

## Step 5: Environment Configuration

### 5.1 Frontend `.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8765
```

### 5.2 Update `next.config.js`

```javascript
module.exports = {
    env: {
        BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    },
};
```

## Step 6: Testing the Full Stack

### 6.1 Start All Services

```bash
# Terminal 1: Backend WebSocket
python websocket_server.py

# Terminal 2: Backend API
python orchestrator.py

# Terminal 3: Frontend
cd frontend-nextjs && npm run dev
```

### 6.2 Test Flow

1. Open browser to `http://localhost:3001`
2. Click "Start Demo"
3. Grant microphone permission
4. Wait for boot sequence
5. Should see agent's screen share appear
6. Speak to interact with agent

## Deployment Checklist

- [ ] Set up Azure Communication Services resource
- [ ] Configure Azure OpenAI endpoint
- [ ] Deploy backend to Azure App Service / AWS
- [ ] Deploy frontend to Vercel / Netlify
- [ ] Set up environment variables in production
- [ ] Configure CORS for cross-origin requests
- [ ] Set up SSL certificates
- [ ] Test end-to-end flow

## Troubleshooting

### No Video Stream
- Check ACS token is valid
- Verify group call ID matches
- Check browser console for WebRTC errors

### WebSocket Connection Failed
- Ensure backend WebSocket server is running
- Check firewall/network settings
- Verify WebSocket URL is correct

### Audio Not Working
- Confirm microphone permissions granted
- Check browser audio settings
- Verify ACS audio configuration
