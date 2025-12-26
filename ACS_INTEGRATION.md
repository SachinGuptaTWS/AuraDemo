# Azure Communication Services Integration Guide

## Overview
Azure Communication Services (ACS) provides WebRTC infrastructure for video/audio streaming.

## Setup

### 1. Create ACS Resource
```bash
az communication create \
  --name aura-demo-acs \
  --resource-group aura-demo-rg \
  --location global
```

### 2. Get Connection String
```bash
az communication list-key \
  --name aura-demo-acs \
  --resource-group aura-demo-rg
```

### 3. Install SDK
```bash
pip install azure-communication-rooms
pip install azure-communication-identity
```

## Implementation

### Backend (Python)
```python
from azure.communication.rooms import RoomsClient
from azure.communication.identity import CommunicationIdentityClient

# Initialize clients
identity_client = CommunicationIdentityClient.from_connection_string(conn_str)
rooms_client = RoomsClient.from_connection_string(conn_str)

# Create user identity
user = identity_client.create_user()
token = identity_client.get_token(user, scopes=["voip"])

# Create room
room = rooms_client.create_room(
    valid_from=datetime.utcnow(),
    valid_until=datetime.utcnow() + timedelta(hours=1)
)

# Return to frontend
return {
    "room_id": room.id,
    "token": token.token,
    "user_id": user.properties['id']
}
```

### Frontend (React/JavaScript)
```javascript
import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const callClient = new CallClient();
const tokenCredential = new AzureCommunicationTokenCredential(token);
const callAgent = await callClient.createCallAgent(tokenCredential);

// Join room
const call = callAgent.join({ roomId: roomId });

// Share screen (from backend container)
const screenShareStream = await navigator.mediaDevices.getDisplayMedia();
await call.startScreenSharing(screenShareStream);
```

## Environment Variables
Add to `.env.dev`:
```
ACS_CONNECTION_STRING=endpoint=https://...;accesskey=...
```

## Cost Optimization
- Rooms are billed per participant-minute
- Use TURN relay only when needed
- Set room expiration to 1 hour max
