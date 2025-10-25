# 🐛 Troubleshooting Guide

Common issues and solutions for the AI E-Commerce Video Automation workflow.

---

## 📋 Table of Contents

1. [Firecrawl Scraping Issues](#firecrawl-scraping-issues)
2. [N8N Workflow Errors](#n8n-workflow-errors)
3. [Google Veo 3.1 API Issues](#google-veo-31-api-issues)
4. [Google Drive Upload Problems](#google-drive-upload-problems)
5. [Performance Issues](#performance-issues)
6. [How to Check Logs](#how-to-check-logs)
7. [Still Having Issues?](#still-having-issues)

---

## 🔍 Firecrawl Scraping Issues

### Issue 1: Empty Product Array Returned

**Symptoms:**
```json
{
  "products": []
}
```

**Root Cause:**
- The extraction prompt doesn't match the website's HTML structure
- The page requires JavaScript to load products
- The URL is behind authentication

**Solutions:**

#### ✅ Solution 1: Verify URL is Accessible

```bash
# Test if the URL is publicly accessible
curl -I "https://your-store.com/collections/products"

# Should return: HTTP/2 200 OK
# ❌ Avoid: HTTP 403, 401, or 503
```

#### ✅ Solution 2: Update Extraction Prompt

**Default prompt:**
```json
{
  "prompt": "Extract all product images from this collection page. Return JSON with 'productName' and 'imageUrl' for each item."
}
```

**Enhanced prompt for Shopify:**
```json
{
  "prompt": "Find all product listings on this page. For each product, extract the product title from h3 or h2 tags and the main product image URL (look for img tags with 'product' in class or data-src attributes). Ignore thumbnails smaller than 200px. Return as JSON array with keys: productName, imageUrl."
}
```

**For WooCommerce:**
```json
{
  "prompt": "Extract product information from WooCommerce product grid. Find elements with class 'product' or 'woocommerce-loop-product'. Get product name from '.woocommerce-loop-product__title' and image from 'img.wp-post-image'. Return JSON array."
}
```

#### ✅ Solution 3: Enable JavaScript Rendering

In the Firecrawl node, add:

```json
{
  "waitFor": 3000,
  "formats": ["markdown", "html"]
}
```

---

### Issue 2: Wrong Images Extracted (Thumbnails/Icons)

**Symptoms:**
- Videos generated from tiny logos or icons
- Low-resolution thumbnails instead of full product images

**Root Cause:**
- Firecrawl picked the first image in the HTML
- CDN serves different image sizes

**Solution:**

#### ✅ Update Extraction Prompt with Size Filters

```json
{
  "prompt": "Extract product images with minimum width of 400px and minimum height of 400px. Exclude logos, icons, and thumbnails. Look for images in srcset attributes with '1024w' or '2048w' suffixes. Return the largest available image URL for each product."
}
```

#### ✅ Post-Process Image URLs

Add a **"Function"** node after Firecrawl:

```javascript
// Filter out small images and select largest variant
const items = $input.all();
const filtered = items.map(item => {
  let imageUrl = item.json.imageUrl;
  
  // Shopify CDN: Get large variant
  if (imageUrl.includes('cdn.shopify.com')) {
    imageUrl = imageUrl.replace(/_\d+x\./, '_2048x.');
  }
  
  // WooCommerce: Get full size
  if (imageUrl.includes('-150x150') || imageUrl.includes('-300x300')) {
    imageUrl = imageUrl.replace(/-\d+x\d+/, '');
  }
  
  return {
    json: {
      productName: item.json.productName,
      imageUrl: imageUrl
    }
  };
});

return filtered;
```

---

### Issue 3: CDN URL Formatting Issues

**Symptoms:**
```
Error downloading image: Invalid URL format
```

**Root Cause:**
- Image URLs are relative (e.g., `/images/product.jpg`)
- Protocol-relative URLs (e.g., `//cdn.example.com/image.jpg`)

**Solution:**

#### ✅ Normalize URLs

Add a **"Function"** node to fix URLs:

```javascript
const items = $input.all();
const baseUrl = "https://example-store.com"; // Replace with actual domain

const normalized = items.map(item => {
  let imageUrl = item.json.imageUrl;
  
  // Fix relative URLs
  if (imageUrl.startsWith('/')) {
    imageUrl = baseUrl + imageUrl;
  }
  
  // Fix protocol-relative URLs
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }
  
  // Remove URL parameters that break downloads
  imageUrl = imageUrl.split('?')[0];
  
  return {
    json: {
      productName: item.json.productName,
      imageUrl: imageUrl
    }
  };
});

return normalized;
```

---

### Issue 4: Firecrawl Timeout Errors

**Symptoms:**
```
Error: Request timeout after 30000ms
```

**Root Cause:**
- Page takes too long to load
- Too many products on one page (1000+)

**Solutions:**

#### ✅ Solution 1: Increase Timeout

In the **"HTTP Request"** node for Firecrawl:

```json
{
  "timeout": 60000
}
```

#### ✅ Solution 2: Use Pagination

Instead of scraping one massive collection, split into pages:

```
https://store.com/collections/products?page=1
https://store.com/collections/products?page=2
```

Modify the workflow to accept a page parameter.

---

## ⚙️ N8N Workflow Errors

### Issue 1: Community Nodes Not Loading

**Symptoms:**
```
Unknown node type: @n8n/n8n-nodes-firecrawl
```

**Root Cause:**
- Community node not installed
- N8N version incompatibility

**Solutions:**

#### ✅ Solution 1: Install Community Node

```bash
# For self-hosted N8N
npm install @n8n/n8n-nodes-firecrawl -g

# Restart N8N
n8n restart
```

#### ✅ Solution 2: Use HTTP Request Node Instead

Replace the Firecrawl community node with:

**Node:** HTTP Request  
**Method:** POST  
**URL:** `https://api.firecrawl.dev/v1/scrape`

**Headers:**
```json
{
  "Authorization": "Bearer {{$credentials.firecrawlApi}}",
  "Content-Type": "application/json"
}

**Body:**
```json
{
  "url": "{{$json.collectionUrl}}",
  "formats": ["markdown", "html"],
  "onlyMainContent": true
}
```

---

### Issue 2: Binary to Base64 Conversion Failures

**Symptoms:**
```
Error: Cannot convert binary data to base64
Node: Convert to Base64
```

**Root Cause:**
- Image download failed (404, 403 errors)
- Binary data is null or empty

**Solutions:**

#### ✅ Solution 1: Add Error Handling

In the **"HTTP Request"** node (image download):

1. Click on the node
2. Go to **"Settings"** tab
3. Enable **"Continue On Fail"**
4. Check **"Always Output Data"**

#### ✅ Solution 2: Validate Image Before Processing

Add a **"Function"** node before Base64 conversion:

```javascript
const items = $input.all();

// Filter out failed downloads
const valid = items.filter(item => {
  return item.binary && item.binary.data && item.binary.data.data;
});

if (valid.length === 0) {
  throw new Error('No valid images to process');
}

return valid;
```

---

### Issue 3: Loop Node Not Iterating Properly

**Symptoms:**
- Only the first product gets processed
- Loop exits immediately

**Root Cause:**
- Input data structure doesn't match loop expectations
- Loop is configured for wrong input path

**Solutions:**

#### ✅ Check Loop Configuration

In the **"Loop Over Items"** node:

```json
{
  "batchSize": 1,
  "options": {
    "expressionValues": {
      "loopArray": "={{$json.products}}"
    }
  }
}
```

Make sure `products` matches your actual data structure.

#### ✅ Debug Loop Input

Add a **"Code"** node before the loop:

```javascript
console.log('Loop input:', JSON.stringify($input.all(), null, 2));
return $input.all();
```

Check execution logs to see the data structure.

---

### Issue 4: Google Drive Upload Fails

**Symptoms:**
```
Error: Invalid credentials
Node: Google Drive
```

**Root Cause:**
- OAuth token expired
- Insufficient permissions
- Folder ID is incorrect

**Solutions:**

#### ✅ Solution 1: Reconnect Google Drive

1. Go to **Settings** → **Credentials**
2. Find your Google Drive credential
3. Click **"Edit"**
4. Click **"Reconnect Account"**
5. Re-authorize with Google
6. Save

#### ✅ Solution 2: Verify Folder Permissions

1. Open the target folder in Google Drive
2. Right-click → **"Share"**
3. Make sure the OAuth account has **"Editor"** access
4. Save changes

#### ✅ Solution 3: Check Folder ID Format

```javascript
// ❌ Wrong (full URL)
parentFolder: "https://drive.google.com/drive/folders/1abc123"

// ✅ Correct (just the ID)
parentFolder: "1abc123"
```

---

## 🎥 Google Veo 3.1 API Issues

### Issue 1: Authentication Failures

**Symptoms:**
```json
{
  "error": {
    "code": 401,
    "message": "Invalid API key"
  }
}
```

**Root Cause:**
- Incorrect API key format
- Using service account key instead of Gemini API key
- API key not activated

**Solutions:**

#### ✅ Solution 1: Verify API Key Format

Gemini API keys should look like:
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

❌ **Not:**
- Service account email: `xxx@xxx.iam.gserviceaccount.com`
- OAuth tokens: `ya29.xxx`

#### ✅ Solution 2: Test API Key Independently

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'

# Should return: JSON response (not 401 error)
```

#### ✅ Solution 3: Regenerate API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Delete old API key
3. Click **"Create API Key"**
4. Select your Google Cloud project
5. Copy the new key
6. Update N8N credentials

---

### Issue 2: Rate Limiting Errors

**Symptoms:**
```json
{
  "error": {
    "code": 429,
    "message": "Resource exhausted: Quota exceeded"
  }
}
```

**Root Cause:**
- Processing too many videos simultaneously
- Exceeded requests per minute (RPM) limit
- Exceeded tokens per minute (TPM) limit

**Solutions:**

#### ✅ Solution 1: Add Wait Nodes

Insert a **"Wait"** node after each Veo 3.1 API call:

```json
{
  "amount": 10,
  "unit": "seconds"
}
```

#### ✅ Solution 2: Reduce Batch Size

In the **"Loop"** node:

```json
{
  "batchSize": 3  // Process 3 at a time instead of 10
}
```

#### ✅ Solution 3: Request Quota Increase

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)
2. Click on **"Requests per minute"**
3. Click **"Edit Quotas"**
4. Request increase (justify with use case)
5. Wait for approval (1-3 business days)

---

### Issue 3: Video Generation Timeout

**Symptoms:**
```
Error: Request timeout after 60000ms
Veo 3.1 is still processing...
```

**Root Cause:**
- Video generation takes 30-90 seconds per video
- HTTP request timeout is too short
- Image is too large (>10MB)

**Solutions:**

#### ✅ Solution 1: Increase Request Timeout

In the **"HTTP Request"** node for Veo 3.1:

```json
{
  "timeout": 120000  // 2 minutes
}
```

#### ✅ Solution 2: Compress Images First

Add an **"Edit Image"** node before Veo 3.1:

```json
{
  "operation": "resize",
  "width": 1920,
  "height": 1080,
  "quality": 85
}
```

#### ✅ Solution 3: Use Polling Instead

Veo 3.1 supports async generation:

**Step 1:** Submit generation request (returns operation ID)

**Step 2:** Poll for completion:

```javascript
// Function node to check status
const operationId = $json.operationId;
const maxAttempts = 20;
const waitSeconds = 10;

for (let i = 0; i < maxAttempts; i++) {
  const response = await $http.request({
    method: 'GET',
    url: `https://generativelanguage.googleapis.com/v1/operations/${operationId}`,
    headers: {
      'x-goog-api-key': '{{$credentials.geminiApi}}'
    }
  });
  
  if (response.done) {
    return { json: response.result };
  }
  
  await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
}

throw new Error('Video generation timeout');
```

---

### Issue 4: Video Includes Unwanted Audio

**Symptoms:**
- Generated videos have background music or sound effects
- Audio is not product-related

**Root Cause:**
- Veo 3.1 sometimes adds audio by default

**Solution:**

#### ✅ Explicitly Disable Audio in Prompt

```javascript
{
  "prompt": "A smooth 360-degree rotation of {{productName}} on a white background, professional product photography style, studio lighting. **SILENT VIDEO - NO AUDIO - MUTE**"
}
```

Or in the API request:

```json
{
  "generationConfig": {
    "includeAudio": false
  }
}
```

---

### Issue 5: Loop Not Smooth

**Symptoms:**
- Video jumps at the end when looping
- First and last frames don't match

**Root Cause:**
- Veo 3.1 doesn't generate perfect loops by default

**Solution:**

#### ✅ Update Prompt for Seamless Looping

```javascript
{
  "prompt": "A seamless looping 360-degree rotation of {{productName}} on a white background. The camera movement must start and end at the exact same angle for perfect looping. Ensure the first and last frames are identical. Professional product photography, studio lighting, no audio."
}
```

#### ✅ Post-Process with FFmpeg (Advanced)

Add an **"Execute Command"** node:

```bash
# Create a seamless loop by blending first and last frames
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]trim=0:7.5,setpts=PTS-STARTPTS[main];
   [0:v]trim=7.5:8,setpts=PTS-STARTPTS[end];
   [0:v]trim=0:0.5,setpts=PTS-STARTPTS[start];
   [end][start]blend=all_expr='A*(1-T/0.5)+B*T/0.5':shortest=1[blended];
   [main][blended]concat=n=2:v=1:a=0" \
  output.mp4
```

---

## 📤 Google Drive Upload Problems

### Issue 1: "File Not Found" Error

**Symptoms:**
```
Error: File not found in binary data
```

**Root Cause:**
- Binary property name mismatch
- File wasn't downloaded properly

**Solution:**

#### ✅ Check Binary Property Name

In the **"Google Drive"** node:

```json
{
  "binaryPropertyName": "data"  // Must match previous node output
}
```

Verify in previous node (Veo 3.1 output):

```javascript
return {
  binary: {
    data: {  // ← This name must match
      data: videoBuffer,
      mimeType: 'video/mp4',
      fileName: 'product-video.mp4'
    }
  }
};
```

---

### Issue 2: Duplicate Files in Drive

**Symptoms:**
- Multiple copies of the same video uploaded
- Workflow execution creates duplicates

**Root Cause:**
- Workflow executed multiple times
- No duplicate detection logic

**Solution:**

#### ✅ Add Duplicate Check

Before the Google Drive node, add a **"Code"** node:

```javascript
const items = $input.all();
const driveNode = $('Google Drive').getNodeParameter('parentFolder');

// Check if file already exists
const existingFiles = await $google.drive.files.list({
  q: `name = '${items[0].json.productName}.mp4' and '${driveNode}' in parents`,
  fields: 'files(id, name)'
});

if (existingFiles.files.length > 0) {
  // File exists, skip upload
  return [];
}

return items;
```

---

## ⚡ Performance Issues

### Issue 1: Workflow Takes Too Long

**Symptoms:**
- Processing 50 products takes 2+ hours
- Workflow hangs on certain steps

**Root Cause:**
- Sequential processing (one at a time)
- No batch optimization
- Large images

**Solutions:**

#### ✅ Solution 1: Enable Parallel Processing

Use the **"Split In Batches"** node:

```json
{
  "batchSize": 5,  // Process 5 at a time
  "options": {
    "reset": false
  }
}
```

#### ✅ Solution 2: Optimize Image Sizes

Add an image compression step:

```javascript
// Function node to resize large images
const items = $input.all();

const optimized = await Promise.all(items.map(async item => {
  const imageBuffer = item.binary.data.data;
  
  // Only compress if > 5MB
  if (imageBuffer.length > 5 * 1024 * 1024) {
    const compressed = await $sharp(imageBuffer)
      .resize(1920, 1080, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    item.binary.data.data = compressed;
  }
  
  return item;
}));

return optimized;
```

---

### Issue 2: Memory Errors with Large Images

**Symptoms:**
```
Error: JavaScript heap out of memory
```

**Root Cause:**
- Processing too many large images simultaneously
- N8N Node.js memory limit reached

**Solutions:**

#### ✅ Solution 1: Increase Node.js Memory

For self-hosted N8N:

```bash
# Linux/Mac
export NODE_OPTIONS="--max-old-space-size=4096"
n8n start

# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
n8n start
```

In Docker:

```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=4096
```

#### ✅ Solution 2: Process Smaller Batches

Reduce batch size to 1-2 items:

```json
{
  "batchSize": 1
}
```

---

### Issue 3: Batch Processing Hanging

**Symptoms:**
- Workflow stops mid-execution
- No error message
- Status shows "running" indefinitely

**Root Cause:**
- Deadlock in loop logic
- API call never returns

**Solutions:**

#### ✅ Solution 1: Add Timeouts to All HTTP Requests

```json
{
  "timeout": 60000,
  "options": {
    "retry": {
      "maxRetries": 2,
      "retryInterval": 5000
    }
  }
}
```

#### ✅ Solution 2: Add Progress Logging

Insert **"Code"** nodes to track progress:

```javascript
console.log(`Processing item ${$itemIndex + 1} of ${$input.all().length}`);
console.log(`Product: ${$json.productName}`);
return $input.all();
```

Check logs to see where it stops.

---

## 📋 How to Check Logs

### N8N Cloud

1. Go to **"Executions"** in the left sidebar
2. Click on the failed execution
3. Expand the red (failed) node
4. View error details in the output panel

### Self-Hosted N8N

#### Console Logs

```bash
# If running with npm
n8n start

# Watch for console output in real-time
# Errors will appear in red
```

#### Log Files

```bash
# Default log location
~/.n8n/logs/n8n.log

# Tail the log in real-time
tail -f ~/.n8n/logs/n8n.log
```

#### Docker Logs

```bash
# View all logs
docker logs n8n

# Follow logs in real-time
docker logs -f n8n

# Last 100 lines
docker logs --tail 100 n8n
```

### Enable Debug Mode

Add to your `.env`:

```bash
N8N_LOG_LEVEL=debug
N8N_LOG_OUTPUT=console,file
```

---

## 🆘 Still Having Issues?

If none of the above solutions work:

### 1. Gather Diagnostic Information

```bash
# N8N version
n8n --version

# Node.js version
node --version

# Operating system
uname -a  # Linux/Mac
systeminfo  # Windows
```

### 2. Export Workflow JSON

1. In N8N, open your workflow
2. Click **"..."** → **"Export"**
3. Save as `workflow-debug.json`

### 3. Create a Minimal Reproducible Example

- Remove sensitive credentials
- Simplify to the failing step
- Include sample input data

### 4. Get Help

- 💬 **Open a GitHub Issue:** [github.com/LahiruKavishkaYT/ecommerce-video-automation/issues](https://github.com/LahiruKavishkaYT/ecommerce-video-automation/issues)
- 🌐 **N8N Community Forum:** [community.n8n.io](https://community.n8n.io)
- 📧 **Email Support:** Via GitHub Issues
- � **GitHub:** [@LahiruKavishkaYT](https://github.com/LahiruKavishkaYT)

---

## 📚 Additional Resources

- [N8N Documentation](https://docs.n8n.io)
- [Firecrawl API Docs](https://docs.firecrawl.dev)
- [Google Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Google Drive API Reference](https://developers.google.com/drive/api/v3/reference)

---

<div align="center">
  <p><strong>Need more help?</strong></p>
  <p>Check out our other docs:</p>
  <p><a href="./SETUP.md">Setup Guide</a> | <a href="./CUSTOMIZATION.md">Customization</a> | <a href="./API-COSTS.md">API Costs</a></p>
</div>
