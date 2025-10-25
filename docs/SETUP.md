# 🛠️ Setup Guide

Complete step-by-step instructions for setting up the AI E-Commerce Video Automation workflow.

**Estimated Setup Time:** 20-30 minutes  
**Difficulty:** Intermediate

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [N8N Installation](#n8n-installation)
3. [API Keys Setup](#api-keys-setup)
4. [N8N Credential Configuration](#n8n-credential-configuration)
5. [Importing the Workflow](#importing-the-workflow)
6. [Configuring Google Drive](#configuring-google-drive)
7. [Testing the Workflow](#testing-the-workflow)
8. [Security Best Practices](#security-best-practices)

---

## 1️⃣ System Requirements

### For Self-Hosted N8N

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Node.js** | 18.x | 20.x LTS |
| **RAM** | 2GB | 4GB+ |
| **Storage** | 5GB | 10GB+ |
| **OS** | Linux, macOS, Windows | Ubuntu 22.04 LTS |
| **N8N Version** | 1.0.0+ | Latest stable |

### For N8N Cloud

- ✅ No local installation required
- ✅ Free tier available (5 workflows, 1,000 executions/month)
- ✅ Pro plan recommended for production ($20/month)

**Check Compatibility:**
```bash
node --version  # Should be v18+ or v20+
npm --version   # Should be 9+
```

---

## 2️⃣ N8N Installation

### Option A: N8N Cloud (Fastest) ⚡

**Time:** ~2 minutes

1. Go to [n8n.cloud](https://n8n.cloud)
2. Click **"Start Free"**
3. Sign up with email or Google
4. Verify your email
5. Your workspace will be ready at `https://yourname.app.n8n.cloud`

✅ **Pros:** Instant setup, automatic updates, no maintenance  
❌ **Cons:** Requires internet, limited free tier

---

### Option B: Self-Hosted (Full Control) 🏠

#### Using NPM (Simple)

**Time:** ~5 minutes

```bash
# Install N8N globally
npm install n8n -g

# Start N8N
n8n start

# Access at http://localhost:5678
```

#### Using Docker (Recommended)

**Time:** ~10 minutes

```bash
# Pull the latest N8N image
docker pull n8nio/n8n

# Create a data volume (persist workflows)
docker volume create n8n_data

# Run N8N container
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

# Access at http://localhost:5678
```

#### Using Docker Compose (Production)

**Time:** ~15 minutes

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=change_this_password
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/home/node/.n8n/workflows

volumes:
  n8n_data:
```

Start the service:

```bash
docker-compose up -d
```

---

### Enabling Community Nodes

**⚠️ Important:** Community nodes may be required for certain features.

#### For Self-Hosted:

1. Open N8N at `http://localhost:5678`
2. Go to **Settings** (gear icon) → **Community Nodes**
3. Click **"Install"** and search for required nodes:
   - `n8n-nodes-firecrawl` (if available)
4. Click **"Install"**
5. Restart N8N after installation

#### For N8N Cloud:

1. Community nodes are pre-enabled
2. Some nodes require manual approval from the N8N team
3. Use the built-in **HTTP Request** node as an alternative

---

## 3️⃣ API Keys Setup

### A. Firecrawl API Key

**Time:** ~5 minutes

1. Go to [firecrawl.dev](https://firecrawl.dev)
2. Click **"Get Started"** or **"Sign Up"**
3. Verify your email
4. Navigate to **Dashboard** → **API Keys**
5. Click **"Create New API Key"**
6. Copy the key (format: `fc_xxxxxxxxxxxxxxxxxxxxxxxx`)

**Free Tier:**
- 500 free credits/month
- ~500 page scrapes
- No credit card required

📝 **Save this key** – you'll need it in Step 4.

---

### B. Google Cloud Setup (Veo 3.1 + Drive)

**Time:** ~15 minutes

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a Project"** → **"New Project"**
3. Enter project name: `ecommerce-video-automation`
4. Click **"Create"**
5. Wait for the project to be created (~30 seconds)

#### Step 2: Enable Required APIs

```bash
# Enable Vertex AI API (for Veo 3.1)
https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

# Enable Google Drive API
https://console.cloud.google.com/apis/library/drive.googleapis.com
```

For each API:
1. Click the link above
2. Select your project
3. Click **"Enable"**

#### Step 3: Create Gemini API Key (for Veo 3.1)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Get API Key"**
3. Select your Google Cloud project
4. Click **"Create API Key"**
5. Copy the key (format: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

> **⚠️ Important:** This is the Gemini API key that provides access to Veo 3.1 through Vertex AI.

📝 **Save this key** – you'll need it in Step 4.

#### Step 4: Set Up Billing

> **⚠️ Required:** Veo 3.1 requires an active billing account.

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Click **"Link a Billing Account"**
3. Follow the prompts to add a payment method
4. **Free trial:** $300 in credits for 90 days

**Cost Protection:**
1. Go to **Billing** → **Budgets & Alerts**
2. Click **"Create Budget"**
3. Set budget to $50/month
4. Enable email alerts at 50%, 90%, 100%

---

### C. Google Drive OAuth Setup

**Time:** ~10 minutes

#### Step 1: Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**

#### Step 2: Configure Consent Screen

If prompted to configure:

1. Click **"Configure Consent Screen"**
2. Select **"External"** → **"Create"**
3. Fill in:
   - **App name:** `E-Commerce Video Automation`
   - **User support email:** Your email
   - **Developer contact:** Your email
4. Click **"Save and Continue"**
5. **Scopes:** Click **"Add or Remove Scopes"**
   - Search: `drive.file`
   - Check: `https://www.googleapis.com/auth/drive.file`
6. Click **"Save and Continue"**
7. **Test users:** Add your email address
8. Click **"Save and Continue"**

#### Step 3: Create OAuth Client ID

1. Back in **Credentials**, click **"Create Credentials"** → **"OAuth client ID"**
2. **Application type:** Web application
3. **Name:** `N8N Workflow`
4. **Authorized redirect URIs:**
   ```
   # For self-hosted (update with your URL)
   http://localhost:5678/rest/oauth2-credential/callback
   
   # For N8N Cloud
   https://yourname.app.n8n.cloud/rest/oauth2-credential/callback
   ```
5. Click **"Create"**
6. **Copy these values:**
   - Client ID: `xxxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

📝 **Save both values** – you'll need them in Step 4.

---

## 4️⃣ N8N Credential Configuration

### A. Add Firecrawl Credentials

1. Open N8N
2. Go to **Settings** (gear icon) → **Credentials**
3. Click **"Add Credential"**
4. Search: **"HTTP Header Auth"** (or custom Firecrawl credential if available)
5. Configure:
   ```
   Name: Firecrawl API
   Header Name: Authorization
   Header Value: Bearer fc_your_api_key_here
   ```
6. Click **"Save"**

---

### B. Add Google Vertex AI Credentials

1. In **Credentials**, click **"Add Credential"**
2. Search: **"Google Service Account"** or **"Google Vertex AI"**
3. Configure:
   ```
   Name: Google Vertex AI
   Service Account Email: (auto-populated)
   Private Key: (upload JSON key file)
   ```

**If you need a service account JSON:**

1. Go to [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **"Create Service Account"**
3. Name: `n8n-vertex-ai`
4. Grant role: **"Vertex AI User"**
5. Click **"Done"**
6. Click on the new service account
7. Go to **"Keys"** tab → **"Add Key"** → **"Create new key"**
8. Select **JSON** → **"Create"**
9. Save the downloaded JSON file
10. Upload this file in N8N credentials

**Alternative (Gemini API Key Method):**

Since Veo 3.1 is accessed through Gemini API:

1. Use **"HTTP Request"** node with header authentication
2. Add credential:
   ```
   Type: Header Auth
   Name: Gemini API
   Header: x-goog-api-key
   Value: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

---

### C. Add Google Drive OAuth Credentials

1. In **Credentials**, click **"Add Credential"**
2. Search: **"Google Drive OAuth2"**
3. Configure:
   ```
   Name: Google Drive Upload
   Client ID: your-client-id.apps.googleusercontent.com
   Client Secret: GOCSPX-xxxxxxxxxxxxxxxxxxxxx
   ```
4. Click **"Connect My Account"**
5. Sign in with Google
6. Grant permissions to access Drive
7. You'll be redirected back to N8N
8. Click **"Save"**

---

## 5️⃣ Importing the Workflow

**Time:** ~2 minutes

### Method 1: From Local File

1. Download `product-video-generator.json` from this repository
2. In N8N, click **"Workflows"** in the left sidebar
3. Click **"Import from File"**
4. Select the JSON file
5. The workflow will appear on the canvas

### Method 2: From URL

1. In N8N, click **"Import from URL"**
2. Enter:
   ```
   https://raw.githubusercontent.com/LahiruKavishkaYT/ecommerce-video-automation/main/workflows/product-video-generator.json
   ```
3. Click **"Import"**

### Method 3: Copy-Paste

1. Open `product-video-generator.json` in a text editor
2. Copy all content (Ctrl+A, Ctrl+C)
3. In N8N, create a new workflow
4. Click the **"..."** menu → **"Import from Clipboard"**
5. Paste the JSON (Ctrl+V)
6. Click **"Import"**

---

## 6️⃣ Configuring Google Drive

### Step 1: Create Target Folder

1. Go to [Google Drive](https://drive.google.com)
2. Click **"New"** → **"Folder"**
3. Name it: `Product Videos`
4. Open the folder
5. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                          ^^^^^^^^^^^^^^^^^ (this part)
   ```

### Step 2: Update Workflow

1. In N8N, open the imported workflow
2. Click on the **"Google Drive"** node (upload step)
3. In the node settings:
   ```
   Parent Folder: 1a2b3c4d5e6f7g8h9i0j  (paste your folder ID)
   ```
4. Click **"Save"**

---

## 7️⃣ Testing the Workflow

**Time:** ~5 minutes

### Step 1: Activate the Workflow

1. Click the **"Active"** toggle in the top-right corner
2. The workflow will start listening for requests

### Step 2: Get the Webhook URL

1. Click on the **"Form Trigger"** node (first node)
2. Copy the **Webhook URL**:
   ```
   https://yourname.app.n8n.cloud/webhook/product-video-gen
   ```

### Step 3: Submit a Test URL

**Option A: Using the Form UI**

1. Open the webhook URL in your browser
2. You'll see a form with a text input
3. Enter a test URL:
   ```
   https://www.shopify.com/plus/customers
   ```
4. Click **"Submit"**

**Option B: Using cURL**

```bash
curl -X POST "https://yourname.app.n8n.cloud/webhook/product-video-gen" \
  -H "Content-Type: application/json" \
  -d '{"collectionUrl": "https://www.shopify.com/plus/customers"}'
```

**Option C: Using Postman**

```json
POST https://yourname.app.n8n.cloud/webhook/product-video-gen
Content-Type: application/json

{
  "collectionUrl": "https://www.shopify.com/plus/customers"
}
```

### Step 4: Monitor Execution

1. Go to **"Executions"** in N8N sidebar
2. Watch the workflow progress in real-time
3. Check for any errors (red nodes)
4. Successful completion: All nodes green ✅

### Step 5: Verify Output

1. Check your **"Product Videos"** folder in Google Drive
2. You should see new video files (`.mp4`)
3. Download and play a video to verify quality

**Expected Results:**
- 8-second looping videos
- 1920x1080 resolution (16:9)
- Smooth transitions
- No audio

---

## 8️⃣ Security Best Practices

### API Key Storage

❌ **Never do this:**
```javascript
// Hardcoding API keys in nodes
const apiKey = "fc_abc123...";
```

✅ **Always do this:**
- Store keys in N8N credentials
- Use environment variables for self-hosted
- Enable basic auth on N8N instance

### Environment Variables (Self-Hosted)

Create `.env` file:

```bash
# N8N Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=strong_password_here

# Encryption key (generate with: openssl rand -base64 32)
N8N_ENCRYPTION_KEY=your_encryption_key_here

# Webhook URL (for external access)
WEBHOOK_URL=https://your-domain.com/
```

### Google Drive Permissions

1. Use folder-specific permissions (not full Drive access)
2. Scope: `https://www.googleapis.com/auth/drive.file` (files created by the app only)
3. Avoid using `drive` scope (full access)

### Firewall Configuration (Self-Hosted)

```bash
# Allow only necessary ports
sudo ufw allow 5678/tcp  # N8N web interface
sudo ufw allow 443/tcp   # HTTPS (if using reverse proxy)
sudo ufw enable
```

### HTTPS Setup (Production)

**Using Nginx as Reverse Proxy:**

```nginx
server {
    listen 443 ssl;
    server_name n8n.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/n8n.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/n8n.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Rate Limiting

Add to N8N workflow:

1. Insert **"Wait"** nodes between API calls
2. Configure:
   ```
   Wait Time: 2 seconds
   Resume on: After time interval
   ```

---

## 🎉 Setup Complete!

You should now have:

- ✅ N8N instance running
- ✅ All API credentials configured
- ✅ Workflow imported and active
- ✅ Google Drive folder connected
- ✅ Successful test execution

---

## 🆘 Need Help?

If you encounter issues:

1. 📖 Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. 🐛 Review N8N execution logs
3. 💬 Open a [GitHub Issue](https://github.com/LahiruKavishkaYT/ecommerce-video-automation/issues)
4. 🌐 Ask in [N8N Community](https://community.n8n.io)

---

## 📚 Next Steps

- 🎨 [Customize the workflow](./CUSTOMIZATION.md)
- 💰 [Understand API costs](./API-COSTS.md)
- 🚀 [Deploy to production](./DEPLOYMENT.md)

---

<div align="center">
  <p><strong>Ready to automate? 🚀</strong></p>
  <p>Go back to <a href="../README.md">README</a> for usage instructions.</p>
</div>
