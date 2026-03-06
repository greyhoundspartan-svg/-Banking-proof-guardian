
# Spartan ZKP Microservice Deployment

This directory contains the Rust microservice that implements Microsoft's Spartan zero-knowledge proof protocol for the BankGuard ZKP application.

## FIXED: 500 "Unexpected end of JSON input" Error ✅

**The issue was resolved** - the service was trying to parse JSON from GET requests that don't have request bodies. The latest `src/main.rs` properly handles:
- GET requests without JSON parsing
- Separate handlers for different endpoints
- Proper CORS headers
- Clear error responses

## Quick Deploy to Railway

### Step 1: Prepare the Code
1. Copy the entire `deployment/rust-spartan-service` folder to a new GitHub repository
2. Make sure all files are in the root of the repository:
   - `Cargo.toml`
   - `Dockerfile`
   - `src/main.rs`

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select the repository
4. Railway will automatically detect the Dockerfile and deploy
5. Wait for deployment to complete (usually 2-3 minutes)

### Step 3: Get Your Service URL
1. In Railway dashboard, click on your service
2. Go to "Settings" → "Domains"
3. Copy the generated URL (e.g., `https://your-service-name.up.railway.app`)

### Step 4: Test Your Deployment
**Both endpoints should now work without errors:**

1. **Root endpoint**: Visit `https://your-service.up.railway.app/`
2. **Health endpoint**: Visit `https://your-service.up.railway.app/health`

Both should return proper JSON like:
```json
{
  "status": "healthy",
  "service": "spartan-zkp",
  "version": "0.1.0",
  "timestamp": "2024-12-07T14:30:00Z",
  "uptime": "online",
  "endpoints": ["GET /", "GET /health", "POST /zkp", "OPTIONS /zkp"]
}
```

### Step 5: Configure in BankGuard ZKP
1. Open your BankGuard ZKP application
2. Go to the "WASM" tab
3. Enter your Railway service URL in the "Service URL" field (base URL only, no /health)
4. Click "Test Connection" - it should show "Connected" status

## Manual Testing

### Test Root Endpoint
```bash
curl https://your-service.up.railway.app/
```

### Test Health Endpoint
```bash
curl https://your-service.up.railway.app/health
```

### Test Proof Generation
```bash
curl -X POST https://your-service.up.railway.app/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "prove", "witness_data": [50000, 75000], "max_balance": 100000}'
```

### Test Proof Verification
```bash
curl -X POST https://your-service.up.railway.app/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "verify", "proof_data": "{\"test\":\"proof\"}", "public_inputs": ["1"]}'
```

## What Was Fixed

The previous code had a fundamental flaw:
- **Problem**: All request handlers were trying to parse JSON, even GET requests
- **Solution**: Separated GET and POST handlers completely
- **Result**: GET requests (/, /health) work without JSON parsing errors

### Key Changes Made:
1. **Separate handlers** for different HTTP methods
2. **No JSON parsing** on GET requests
3. **Proper CORS** headers on all responses
4. **Clear error messages** and logging
5. **Structured responses** with consistent format

## Troubleshooting

If you're still having issues:

1. **Check Railway Logs**:
   - Go to Railway dashboard → Your service → Deployments
   - Click on latest deployment → View logs
   - Look for any Rust compilation or runtime errors

2. **Verify Endpoints Directly**:
   ```bash
   # Should return 200 OK with JSON
   curl -v https://your-service.up.railway.app/health
   
   # Should return 200 OK with JSON  
   curl -v https://your-service.up.railway.app/
   ```

3. **Check Service Status**:
   - In Railway dashboard, verify service is "Running" (green)
   - Check that port 8080 is being used
   - Verify domain is properly assigned

## Environment Variables

The service uses these environment variables (automatically set by Railway):
- `PORT`: Port to bind to (Railway sets this automatically to 8080)
- `HOST`: Host to bind to (default: 0.0.0.0)
- `RUST_LOG`: Log level (default: info)

## API Endpoints

- `GET /` - Root endpoint (returns health status)
- `GET /health` - Detailed health check  
- `POST /zkp` - ZKP operations (prove/verify)
- `OPTIONS /zkp` - CORS preflight

## Next Steps

After successful deployment:
1. **Both `/` and `/health` endpoints should return proper JSON without 500 errors**
2. Configure the service URL in your BankGuard ZKP app (base URL only)
3. Test proof generation and verification
4. Optionally add API key authentication for production use

## Note on Implementation

This is currently a **working template** with simulated Spartan operations. For production use, you would need to integrate the actual Microsoft Spartan library for real zero-knowledge proofs.
