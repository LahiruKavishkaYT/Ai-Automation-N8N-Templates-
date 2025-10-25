# 🎨 Customization Guide

Learn how to adapt the AI E-Commerce Video Automation workflow for your specific needs.

---

## 📋 Table of Contents

1. [Modifying Firecrawl Extraction](#modifying-firecrawl-extraction)
2. [Customizing Veo 3.1 Video Generation](#customizing-veo-31-video-generation)
3. [Workflow Modifications](#workflow-modifications)
4. [Scaling the Workflow](#scaling-the-workflow)
5. [Output Options](#output-options)

---

## 🔍 Modifying Firecrawl Extraction

### Understanding Extraction Prompts

Firecrawl uses AI to understand page structure. Your prompt guides what data to extract.

---

### Default Prompt (Fashion/Apparel)

```json
{
  "prompt": "Extract all product images from this collection page. Return a JSON array with 'productName' and 'imageUrl' for each item."
}
```

**Works best for:**
- Shopify stores
- WooCommerce with standard themes
- Clean product grids

---

### Custom Prompts by Industry

#### 1. Furniture/Home Goods

```json
{
  "prompt": "Find all furniture products on this page. For each item, extract: product name (from headings), main product image URL (lifestyle shot preferred over white background), product category (sofa, chair, table, etc.), and price if visible. Return as JSON array with keys: productName, imageUrl, category, price."
}
```

**Why this works:**
- Prioritizes lifestyle shots over clinical product images
- Captures category for better video prompts
- Includes pricing for filtering

**N8N Implementation:**

1. Click on **Firecrawl** node
2. Find the **"Prompt"** field
3. Replace with the above text
4. Save

---

#### 2. Electronics/Gadgets

```json
{
  "prompt": "Extract electronic products from this page. Look for product cards or listings. For each product, get: device name, primary product image (showing the front/main view), brand name, and model number if present. Exclude icons, logos, and payment method images. Return JSON array: {productName, imageUrl, brand, model}."
}
```

**Key Features:**
- Filters out non-product images (payment icons, social media)
- Captures brand for video branding
- Model numbers help with accurate descriptions

---

#### 3. Beauty/Cosmetics

```json
{
  "prompt": "Find all beauty products on this collection page. Extract: product name, main product image (prefer packaging shot over swatches), shade/variant name if applicable, and product type (lipstick, foundation, serum, etc.). Ignore color swatch thumbnails. Return as JSON: {productName, imageUrl, variant, productType}."
}
```

**Optimization:**
- Avoids color swatches (too small for video)
- Captures variants for accurate naming
- Product type helps customize video style

---

#### 4. Sports Equipment

```json
{
  "prompt": "Extract sports equipment from this page. For each product, get: equipment name, primary image showing the product in use or on white background, sport category (running, cycling, gym, etc.), and any size/weight specifications visible. Return JSON: {productName, imageUrl, sportCategory, specs}."
}
```

---

#### 5. Food & Beverage

```json
{
  "prompt": "Find all food or beverage products on this page. Extract: product name, appetizing product image (prefer styled shots over plain package), product category (snacks, drinks, frozen, etc.), dietary labels (vegan, gluten-free, organic), and serving size if shown. Return JSON: {productName, imageUrl, category, dietaryLabels, servingSize}."
}
```

---

### Handling Different E-Commerce Platforms

#### Shopify Collections

```json
{
  "url": "https://store.myshopify.com/collections/all?page=1",
  "prompt": "Extract all products from this Shopify collection. Look for product-grid items with class 'product-item'. Get the product title from h3 or h2 tags, and the srcset URL for images (use the 1024w variant). Return JSON array.",
  "extractorOptions": {
    "mode": "llm-extraction",
    "extractionSchema": {
      "type": "object",
      "properties": {
        "products": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "productName": {"type": "string"},
              "imageUrl": {"type": "string"},
              "price": {"type": "string"},
              "productUrl": {"type": "string"}
            }
          }
        }
      }
    }
  }
}
```

---

#### WooCommerce

```json
{
  "url": "https://store.com/shop/",
  "prompt": "Extract WooCommerce products. Find elements with class 'product' or 'woocommerce-loop-product'. Get product name from '.woocommerce-loop-product__title', image from 'img.wp-post-image' (use data-large-image if available), and price from '.price'. Return JSON array.",
  "waitFor": 2000
}
```

---

#### Magento

```json
{
  "url": "https://store.com/catalog/category/view/",
  "prompt": "Extract products from Magento catalog. Look for product items with class 'product-item-info'. Get name from '.product-item-name', image from '.product-image-photo' (use largest available size), SKU if visible, and price from '.price'. Return JSON.",
  "formats": ["markdown", "html"]
}
```

---

#### Custom/Headless Stores

```json
{
  "url": "https://custom-store.com/api/products",
  "prompt": "This is a JSON API response with product data. Extract all products from the 'data' or 'products' array. Map to our format: {productName, imageUrl, productId, price}. If images are nested in an 'images' array, use the first item or the one marked as 'primary'.",
  "formats": ["markdown"]
}
```

---

### Advanced Extraction: Multiple Data Points

**Scenario:** You want to extract extra data for better video personalization.

```json
{
  "prompt": "Extract detailed product information: product name, main image URL (highest resolution), short description (1-2 sentences), key features (bullet points), price, sale status (on sale or regular), and color variants. Return JSON with all fields.",
  "extractorOptions": {
    "mode": "llm-extraction",
    "extractionSchema": {
      "type": "object",
      "properties": {
        "products": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "productName": {"type": "string"},
              "imageUrl": {"type": "string", "format": "uri"},
              "description": {"type": "string", "maxLength": 200},
              "features": {"type": "array", "items": {"type": "string"}},
              "price": {"type": "number"},
              "onSale": {"type": "boolean"},
              "colors": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["productName", "imageUrl"]
          }
        }
      }
    }
  }
}
```

**Using Extra Data in Video Prompts:**

```javascript
// Function node to build dynamic prompt
const product = $input.item.json;

const prompt = `A cinematic 360-degree rotation of ${product.productName} on a ${product.onSale ? 'red gradient' : 'white'} background. ${product.description}. Highlight features: ${product.features.join(', ')}. Professional e-commerce style, studio lighting, no audio.`;

return {
  json: {
    productName: product.productName,
    imageUrl: product.imageUrl,
    videoPrompt: prompt
  }
};
```

---

### Fixing Common Extraction Issues

#### Issue: Extraction Returns HTML Instead of Clean Data

**Solution:** Add post-processing

```javascript
// Function node after Firecrawl
const items = $input.all();

const cleaned = items.map(item => {
  let productName = item.json.productName;
  
  // Remove HTML tags
  productName = productName.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  productName = productName.replace(/&amp;/g, '&')
                           .replace(/&lt;/g, '<')
                           .replace(/&gt;/g, '>')
                           .replace(/&quot;/g, '"');
  
  // Trim whitespace
  productName = productName.trim();
  
  return {
    json: {
      productName: productName,
      imageUrl: item.json.imageUrl
    }
  };
});

return cleaned;
```

---

## 🎥 Customizing Veo 3.1 Video Generation

### Prompt Engineering Basics

**Anatomy of a Good Veo 3.1 Prompt:**

```
[Camera Movement] + [Subject] + [Background] + [Lighting] + [Style] + [Technical Specs]
```

---

### Default Prompt (Fashion)

```javascript
{
  "prompt": "A smooth 360-degree clockwise rotation of ${productName} on a pure white seamless background, professional fashion photography style, soft studio lighting with subtle shadows, 4K quality, no audio. The camera orbits around the product at eye level, maintaining focus throughout. Ensure first and last frames are identical for seamless looping."
}
```

---

### Prompts by Product Type

#### 1. Apparel/Fashion (Current Default)

```javascript
const prompt = `A cinematic 360-degree rotation of ${productName} displayed on a minimalist mannequin against a gradient background transitioning from white to light gray. Studio lighting with rim lighting to highlight texture and details. The camera smoothly orbits clockwise at a steady pace. Elegant fashion presentation, 4K resolution, silent video. Perfect loop.`;
```

**Result:**
- Professional fashion presentation
- Texture visibility (fabric details)
- Elegant, high-end feel

---

#### 2. Electronics/Gadgets

```javascript
const prompt = `An orbital camera movement around ${productName} on a modern dark gray surface with subtle reflections. The product rotates slowly on a turntable while the camera maintains a 45-degree angle. Dramatic side lighting with blue accent lights. Futuristic tech showcase style, 4K quality, no audio. Seamless loop from start to finish.`;
```

**Key Elements:**
- Dark background (contrasts with tech)
- Reflections (premium feel)
- Blue accent (tech aesthetic)

---

#### 3. Furniture/Home Goods

```javascript
const prompt = `A slow push-in and orbit combination around ${productName} placed in a bright, airy room with natural window light. Warm, inviting ambiance with soft shadows. The camera starts wide and gradually moves closer while rotating 180 degrees. Lifestyle e-commerce style, realistic home setting, 4K quality, silent. Smooth transition for looping.`;
```

**Why This Works:**
- Lifestyle context (buyers envision in their home)
- Natural lighting (realistic)
- Push-in creates engagement

---

#### 4. Beauty/Cosmetics

```javascript
const prompt = `A luxurious close-up rotation of ${productName} on a marble pedestal with a soft pink gradient background. Glamorous lighting with sparkle highlights. The camera orbits slowly at a slight downward angle, emphasizing the product packaging's elegance. Beauty editorial style, bokeh background blur, 4K quality, no audio. Perfect seamless loop.`;
```

**Features:**
- Luxury materials (marble)
- Beauty-specific colors (pink, gold)
- Close-up detail

---

#### 5. Sports Equipment

```javascript
const prompt = `A dynamic 360-degree rotation of ${productName} against an energetic abstract background with motion blur effects. Bold, high-contrast lighting with dramatic shadows. The camera circles rapidly with a slight upward tilt, conveying power and performance. Athletic and energetic vibe, 4K quality, silent video. Seamless loop.`;
```

**Characteristics:**
- Dynamic movement (matches athletic theme)
- High contrast (bold)
- Upward tilt (aspirational)

---

#### 6. Food & Beverage

```javascript
const prompt = `A mouth-watering 360-degree rotation of ${productName} on a rustic wooden table with soft natural daylight. Steam or condensation visible to enhance freshness. The camera moves slowly around the product with a slight overhead angle. Appetizing food photography style, warm color grading, 4K quality, no audio. Seamless loop.`;
```

**Appeal:**
- Food-specific details (steam, condensation)
- Warm colors (appetizing)
- Natural context (relatable)

---

### Adjusting Video Parameters

#### Duration Options

```javascript
// N8N HTTP Request node for Veo 3.1 API

// 4-second video (faster, cheaper)
{
  "generationConfig": {
    "duration": "4s"
  }
}

// 8-second video (balanced, default)
{
  "generationConfig": {
    "duration": "8s"
  }
}

// 12-second video (more detail, pricier)
{
  "generationConfig": {
    "duration": "12s"
  }
}
```

**Use Cases:**
- **4s:** TikTok, Instagram Reels, quick previews
- **8s:** Standard e-commerce, YouTube Shorts
- **12s:** Detailed product tours, luxury items

---

#### Aspect Ratios

```javascript
// 16:9 (Landscape - YouTube, desktop)
{
  "aspectRatio": "16:9"
}

// 9:16 (Vertical - TikTok, Instagram Stories)
{
  "aspectRatio": "9:16"
}

// 1:1 (Square - Instagram Feed, Facebook)
{
  "aspectRatio": "1:1"
}

// 4:5 (Portrait - Instagram Feed optimized)
{
  "aspectRatio": "4:5"
}
```

**Implementation:**

Add a **"Set"** node before Veo 3.1:

```json
{
  "values": {
    "aspectRatio": "={{$json.platform === 'tiktok' ? '9:16' : '16:9'}}"
  }
}
```

---

#### Motion Intensity

```javascript
// Subtle motion (minimal, elegant)
const prompt = `... with subtle, gentle camera movement and slow product rotation...`;

// Medium motion (standard)
const prompt = `... with smooth, steady camera orbiting at moderate speed...`;

// High motion (dynamic, energetic)
const prompt = `... with dynamic, fast-paced camera movements and rapid rotation...`;
```

---

#### Camera Angles

```javascript
// Eye-level (neutral)
const prompt = `The camera orbits at eye level, maintaining a straight-on view...`;

// High angle (overview)
const prompt = `The camera looks down at a 30-degree angle from above...`;

// Low angle (hero shot)
const prompt = `The camera angles upward from below, creating an aspirational hero perspective...`;

// Dutch angle (creative)
const prompt = `The camera tilts 15 degrees for a dynamic, editorial composition...`;
```

---

### Multi-Variant Video Generation

**Scenario:** Generate 3 videos per product (different styles)

**Step 1:** Add a loop for variants

```javascript
// Function node to create variants
const product = $input.item.json;

const variants = [
  {
    style: 'minimal',
    prompt: `Minimalist ${product.productName} on pure white, slow rotation`,
    aspectRatio: '16:9'
  },
  {
    style: 'lifestyle',
    prompt: `${product.productName} in modern home setting, push-in camera`,
    aspectRatio: '4:5'
  },
  {
    style: 'dynamic',
    prompt: `Dynamic ${product.productName} with motion blur, fast rotation`,
    aspectRatio: '9:16'
  }
];

return variants.map(v => ({
  json: {
    productName: product.productName,
    imageUrl: product.imageUrl,
    videoPrompt: v.prompt,
    aspectRatio: v.aspectRatio,
    fileName: `${product.productName}-${v.style}.mp4`
  }
}));
```

---

## ⚙️ Workflow Modifications

### 1. Add Email Notifications on Completion

**Use Case:** Notify yourself when batch processing finishes

**Add:** **"Send Email"** node at the end

```json
{
  "fromEmail": "automation@yourdomain.com",
  "toEmail": "you@yourdomain.com",
  "subject": "Video Generation Complete - {{$json.productCount}} products",
  "text": "Your product videos are ready!\n\nProcessed: {{$json.productCount}} products\nTotal cost: ${{$json.totalCost}}\n\nView in Google Drive: {{$json.driveFolder}}",
  "html": "<h2>Video Generation Complete</h2><p>Processed <strong>{{$json.productCount}}</strong> products.</p><p><a href='{{$json.driveFolder}}'>View in Google Drive</a></p>"
}
```

---

### 2. Integrate with Shopify/WooCommerce APIs

**Use Case:** Auto-update product pages with video URLs

**Add:** HTTP Request node after Google Drive upload

```javascript
// Shopify API: Update product metafield with video URL
{
  "method": "PUT",
  "url": "https://your-store.myshopify.com/admin/api/2024-01/products/{{$json.productId}}/metafields.json",
  "headers": {
    "X-Shopify-Access-Token": "{{$credentials.shopifyToken}}",
    "Content-Type": "application/json"
  },
  "body": {
    "metafield": {
      "namespace": "videos",
      "key": "product_video",
      "value": "{{$json.driveVideoUrl}}",
      "type": "url"
    }
  }
}
```

---

### 3. Add Watermarks to Videos

**Use Case:** Brand protection

**Add:** **"Execute Command"** node with FFmpeg

```bash
# Add watermark overlay
ffmpeg -i input.mp4 -i watermark.png \
  -filter_complex "overlay=W-w-10:H-h-10" \
  -codec:a copy output.mp4
```

**N8N Implementation:**

1. Upload watermark PNG to N8N static assets
2. Use **"Execute Command"** node:

```json
{
  "command": "ffmpeg -i {{$binary.video.filePath}} -i /path/to/watermark.png -filter_complex 'overlay=W-w-10:H-h-10' -codec:a copy /tmp/output.mp4"
}
```

3. Read output file back into binary data

---

### 4. Generate Multiple Video Variations

**Use Case:** A/B testing different styles

```javascript
// Function node to duplicate with different prompts
const product = $input.item.json;

const variations = [
  { name: 'white-bg', prompt: 'White background, minimal' },
  { name: 'lifestyle', prompt: 'Modern home setting' },
  { name: 'gradient', prompt: 'Gradient background, colorful' }
];

return variations.map(v => ({
  json: {
    productName: product.productName,
    imageUrl: product.imageUrl,
    videoPrompt: `${v.prompt} ${product.productName}`,
    fileName: `${product.productName}-${v.name}.mp4`
  }
}));
```

---

### 5. Implement Error Notifications

**Use Case:** Get alerted when something fails

**Add:** **"Slack"** or **"Discord"** node on error path

1. In each critical node, enable **"Continue On Fail"**
2. Add an **"IF"** node to check for errors:

```javascript
{{$json.error !== undefined}}
```

3. Connect to Slack/Discord node:

```json
{
  "channel": "#automation-alerts",
  "text": "⚠️ Video generation failed for {{$json.productName}}\n\nError: {{$json.error}}\n\nWorkflow: {{$workflow.name}}\nExecution ID: {{$execution.id}}"
}
```

---

## 📈 Scaling the Workflow

### 1. Parallel Processing Setup

**Current:** Sequential processing (one product at a time)

**Improved:** Parallel batches

```javascript
// Replace "Loop Over Items" with "Split In Batches"
{
  "batchSize": 5,  // Process 5 simultaneously
  "options": {
    "reset": false
  }
}
```

**Then add "Wait" node:**

```json
{
  "amount": 5,
  "unit": "seconds",
  "onlyIfPreviousNodeDone": true
}
```

**Result:** 5x faster processing (respect rate limits)

---

### 2. Queue Management for Large Catalogs

**Use Case:** Processing 1000+ products without overwhelming APIs

**Strategy:** Use N8N's queue mode

**Step 1:** Split workflow into 2 parts:

**Workflow 1: Scraper & Queue**
```
Form Trigger → Firecrawl → Loop (add to queue) → Queue Node
```

**Workflow 2: Video Generator (Triggered by Queue)**
```
Queue Trigger → Download Image → Veo 3.1 → Google Drive
```

**Implementation:**

1. Use **"RabbitMQ"** or **"Redis"** for queue
2. Or use N8N's built-in queue via **"Webhook"** nodes with database tracking

---

### 3. Database Integration for Tracking

**Use Case:** Track which products have been processed to avoid duplicates

**Add:** **"PostgreSQL"** or **"MySQL"** nodes

**Schema:**

```sql
CREATE TABLE processed_videos (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255),
  product_url VARCHAR(500),
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50)
);
```

**Before Processing:**

```sql
SELECT * FROM processed_videos WHERE product_url = $1;
```

**After Upload:**

```sql
INSERT INTO processed_videos (product_name, product_url, image_url, video_url, status)
VALUES ($1, $2, $3, $4, 'completed');
```

---

## 📤 Output Options

### 1. Different Storage Solutions

#### Amazon S3

```javascript
// HTTP Request node to S3
{
  "method": "PUT",
  "url": "https://your-bucket.s3.amazonaws.com/{{$json.productName}}.mp4",
  "headers": {
    "Authorization": "AWS4-HMAC-SHA256 ...",
    "Content-Type": "video/mp4"
  },
  "bodyContentType": "raw",
  "body": "={{$binary.video}}"
}
```

---

#### Cloudflare R2

```javascript
// Similar to S3 but with R2 endpoint
{
  "method": "PUT",
  "url": "https://your-account.r2.cloudflarestorage.com/bucket/{{$json.fileName}}",
  "headers": {
    "Authorization": "Bearer {{$credentials.r2Token}}",
    "Content-Type": "video/mp4"
  },
  "bodyContentType": "raw",
  "body": "={{$binary.video}}"
}
```

---

### 2. Direct Upload to Social Media

#### Instagram API (via Facebook Graph API)

```javascript
// Step 1: Create media container
{
  "method": "POST",
  "url": "https://graph.facebook.com/v18.0/{{$json.instagramAccountId}}/media",
  "qs": {
    "video_url": "{{$json.videoUrl}}",
    "caption": "Check out our {{$json.productName}}! #product #ecommerce",
    "access_token": "{{$credentials.facebookToken}}"
  }
}

// Step 2: Publish
{
  "method": "POST",
  "url": "https://graph.facebook.com/v18.0/{{$json.instagramAccountId}}/media_publish",
  "qs": {
    "creation_id": "{{$json.creationId}}",
    "access_token": "{{$credentials.facebookToken}}"
  }
}
```

---

#### TikTok API

```javascript
{
  "method": "POST",
  "url": "https://open.tiktokapis.com/v2/post/publish/video/init/",
  "headers": {
    "Authorization": "Bearer {{$credentials.tiktokToken}}",
    "Content-Type": "application/json"
  },
  "body": {
    "post_info": {
      "title": "{{$json.productName}}",
      "privacy_level": "PUBLIC",
      "disable_duet": false,
      "disable_comment": false,
      "disable_stitch": false,
      "video_cover_timestamp_ms": 1000
    },
    "source_info": {
      "source": "FILE_UPLOAD",
      "video_url": "{{$json.videoUrl}}"
    }
  }
}
```

---

### 3. Video Compression Settings

**Use Case:** Reduce file size for faster uploads

**Add:** **"Execute Command"** node with FFmpeg

```bash
# High quality, smaller file (H.265)
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium output.mp4

# Web-optimized (H.264)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset fast -movflags +faststart output.mp4

# Ultra-compressed for mobile
ffmpeg -i input.mp4 -c:v libx264 -crf 30 -vf "scale=1280:720" output.mp4
```

**File Size Comparison:**

| Setting | 8s Video Size | Quality | Use Case |
|---------|---------------|---------|----------|
| Original (Veo 3.1) | 50-60 MB | ⭐⭐⭐⭐⭐ | Download/archive |
| High (CRF 23) | 20-25 MB | ⭐⭐⭐⭐⭐ | Website embeds |
| Medium (CRF 28) | 10-15 MB | ⭐⭐⭐⭐ | Social media |
| Low (CRF 30 + scale) | 5-8 MB | ⭐⭐⭐ | Mobile apps |

---

## 🎓 Copy-Paste Ready Examples

### Complete Custom Workflow: Multi-Platform Video Generator

```json
{
  "name": "Multi-Platform Product Video Generator",
  "nodes": [
    {
      "name": "Form Trigger",
      "type": "n8n-nodes-base.formTrigger",
      "parameters": {
        "formTitle": "Generate Product Videos",
        "formFields": {
          "values": [
            {"fieldLabel": "Product URL", "fieldType": "text", "requiredField": true},
            {"fieldLabel": "Platforms", "fieldType": "multiselect", "fieldOptions": {
              "values": [
                {"option": "Instagram (1:1)"},
                {"option": "TikTok (9:16)"},
                {"option": "YouTube (16:9)"}
              ]
            }}
          ]
        }
      }
    },
    {
      "name": "Firecrawl",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.firecrawl.dev/v1/scrape",
        "method": "POST",
        "body": {
          "url": "={{$json.formData.productUrl}}",
          "formats": ["markdown"],
          "onlyMainContent": true
        }
      }
    },
    {
      "name": "Create Platform Variants",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "const product = $input.item.json;\nconst platforms = $node['Form Trigger'].json.formData.platforms;\n\nconst aspectRatios = {\n  'Instagram (1:1)': {ratio: '1:1', style: 'square'},\n  'TikTok (9:16)': {ratio: '9:16', style: 'vertical'},\n  'YouTube (16:9)': {ratio: '16:9', style: 'landscape'}\n};\n\nreturn platforms.map(p => ({\n  json: {\n    productName: product.productName,\n    imageUrl: product.imageUrl,\n    platform: p,\n    aspectRatio: aspectRatios[p].ratio,\n    style: aspectRatios[p].style\n  }\n}));"
      }
    }
  ]
}
```

---

## 📚 Additional Resources

- [Firecrawl Prompt Guide](https://docs.firecrawl.dev/extraction)
- [Veo 3.1 Prompt Best Practices](https://ai.google.dev/gemini-api/docs/veo)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [N8N Function Node Examples](https://docs.n8n.io/code-examples/)

---

<div align="center">
  <p><strong>Need inspiration? 🎨</strong></p>
  <p><a href="../README.md">Main README</a> | <a href="./SETUP.md">Setup</a> | <a href="./TROUBLESHOOTING.md">Troubleshooting</a></p>
</div>
