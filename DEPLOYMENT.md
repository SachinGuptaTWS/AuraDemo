# Azure Container Apps Deployment Configuration

## Prerequisites
1. Azure CLI installed
2. Azure subscription with Container Apps enabled
3. Azure Container Registry (ACR) created

## Deployment Steps

### 1. Build and Push Docker Image
```bash
# Login to Azure
az login

# Create resource group
az group create --name aura-demo-rg --location eastus2

# Create Azure Container Registry
az acr create --resource-group aura-demo-rg --name aurademo --sku Basic

# Login to ACR
az acr login --name aurademo

# Build and push image
docker build -t aurademo.azurecr.io/aura-demo:latest .
docker push aurademo.azurecr.io/aura-demo:latest
```

### 2. Create Container Apps Environment
```bash
az containerapp env create \
  --name aura-demo-env \
  --resource-group aura-demo-rg \
  --location eastus2
```

### 3. Deploy Container App
```bash
az containerapp create \
  --name aura-demo \
  --resource-group aura-demo-rg \
  --environment aura-demo-env \
  --image aurademo.azurecr.io/aura-demo:latest \
  --target-port 8080 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 10 \
  --cpu 2 \
  --memory 4Gi \
  --env-vars \
    AZURE_OPENAI_ENDPOINT=secretref:openai-endpoint \
    AZURE_OPENAI_API_KEY=secretref:openai-key \
    AZURE_OPENAI_API_VERSION=2025-01-01-preview \
    AZURE_OPENAI_DEPLOYMENT=gpt-4.1 \
  --registry-server aurademo.azurecr.io
```

### 4. Configure Secrets
```bash
az containerapp secret set \
  --name aura-demo \
  --resource-group aura-demo-rg \
  --secrets \
    openai-endpoint=<YOUR_ENDPOINT> \
    openai-key=<YOUR_KEY> \
    search-endpoint=<SEARCH_ENDPOINT> \
    search-key=<SEARCH_KEY>
```

### 5. Enable Auto-Scaling (KEDA)
```bash
az containerapp update \
  --name aura-demo \
  --resource-group aura-demo-rg \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 10
```

## Environment Variables

Required:
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_API_VERSION`: API version (e.g., 2025-01-01-preview)
- `AZURE_OPENAI_DEPLOYMENT`: Deployment name (e.g., gpt-4.1)

Optional (for RAG):
- `AZURE_SEARCH_ENDPOINT`: Azure AI Search endpoint
- `AZURE_SEARCH_KEY`: Azure AI Search key
- `AZURE_SEARCH_INDEX`: Index name

## Monitoring
```bash
# View logs
az containerapp logs show \
  --name aura-demo \
  --resource-group aura-demo-rg \
  --follow

# Get app URL
az containerapp show \
  --name aura-demo \
  --resource-group aura-demo-rg \
  --query properties.configuration.ingress.fqdn
```

## Cost Optimization
- Min replicas set to 0 (scales to zero when idle)
- Max replicas set to 10 (adjust based on expected load)
- Auto-scaling based on HTTP concurrency
