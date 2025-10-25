# 💰 API Costs Breakdown

Comprehensive pricing analysis for the AI E-Commerce Video Automation workflow.

> **Last Updated:** October 25, 2025  
> **Note:** Prices are subject to change. Always verify current rates on official pricing pages.

---

## 📋 Table of Contents

1. [Cost Per API Call](#cost-per-api-call)
2. [Example Scenarios](#example-scenarios)
3. [Monthly Cost Estimates](#monthly-cost-estimates)
4. [Cost Optimization Tips](#cost-optimization-tips)
5. [Free Tier Information](#free-tier-information)
6. [ROI Comparison](#roi-comparison)
7. [Pricing Resources](#pricing-resources)

---

## 💵 Cost Per API Call

### Firecrawl Scraping

| Operation | Cost | Details |
|-----------|------|---------|
| **Page Scrape** | $0.01 | Per page scraped with AI extraction |
| **Markdown Extraction** | $0.005 | Simplified extraction (no AI) |
| **Crawl (multi-page)** | $0.01/page | Follows links automatically |
| **Map (site structure)** | $0.02 | Generates site map |

**For this workflow:** $0.01 per collection page (one-time scrape)

---

### Google Veo 3.1 Video Generation

> **Pricing Model:** Based on video duration and resolution

| Duration | 720p (HD) | 1080p (Full HD) | 4K (UHD) |
|----------|-----------|-----------------|----------|
| **4 seconds** | $0.08 | $0.12 | $0.25 |
| **8 seconds** | $0.15 | $0.22 | $0.45 |
| **12 seconds** | $0.22 | $0.32 | $0.65 |

**For this workflow:** $0.22 per video (8s @ 1080p)

**Additional Charges:**
- Image input processing: $0.002 per image
- Failed generations (still charged): 50% of cost
- Audio generation (optional): +$0.05 per video

**Total per video:** $0.22 + $0.002 = **$0.222**

---

### Google Drive Storage

| Tier | Cost | Included |
|------|------|----------|
| **Free** | $0 | 15 GB |
| **Google One Basic** | $1.99/month | 100 GB |
| **Google One Standard** | $2.99/month | 200 GB |
| **Google Workspace** | $6/user/month | 30 GB/user |

**Video File Sizes:**
- 8s @ 1080p: ~40-60 MB per video
- 8s @ 720p: ~20-30 MB per video

**Storage Cost (per GB after free tier):** ~$0.02/GB/month

**For this workflow:** Negligible (unless storing 1000+ videos)

---

### N8N Hosting

| Option | Cost | Details |
|--------|------|---------|
| **Self-Hosted** | $0 | Free (you pay for server) |
| **N8N Cloud Starter** | $20/month | 2,500 executions, 5 active workflows |
| **N8N Cloud Pro** | $50/month | 10,000 executions, 25 workflows |
| **N8N Cloud Enterprise** | Custom | Unlimited executions |

**Server Costs (Self-Hosted):**
- DigitalOcean Droplet: $12/month (2GB RAM)
- AWS EC2 t3.small: ~$15/month
- Google Cloud E2-small: ~$13/month

**For this workflow:** $20/month (N8N Cloud) or $12/month (self-hosted VPS)

---

## 📊 Example Scenarios

### Scenario 1: Small E-Commerce Store (10 Products)

| Service | Quantity | Unit Cost | Total |
|---------|----------|-----------|-------|
| Firecrawl | 1 page | $0.01 | $0.01 |
| Veo 3.1 | 10 videos | $0.222 | $2.22 |
| Google Drive | 500 MB | $0.00 | $0.00 |
| N8N | 1 execution | $0.00 | $0.00 |
| **Total** | — | — | **$2.23** |

**Cost per product:** $0.223

---

### Scenario 2: Medium Store (50 Products)

| Service | Quantity | Unit Cost | Total |
|---------|----------|-----------|-------|
| Firecrawl | 3 pages | $0.01 | $0.03 |
| Veo 3.1 | 50 videos | $0.222 | $11.10 |
| Google Drive | 2.5 GB | $0.00 | $0.00 |
| N8N | 3 executions | $0.00 | $0.00 |
| **Total** | — | — | **$11.13** |

**Cost per product:** $0.223

---

### Scenario 3: Large Catalog (100 Products)

| Service | Quantity | Unit Cost | Total |
|---------|----------|-----------|-------|
| Firecrawl | 5 pages | $0.01 | $0.05 |
| Veo 3.1 | 100 videos | $0.222 | $22.20 |
| Google Drive | 5 GB | $0.00 | $0.00 |
| N8N | 5 executions | $0.00 | $0.00 |
| **Total** | — | — | **$22.25** |

**Cost per product:** $0.223

---

### Scenario 4: Enterprise Catalog (500 Products)

| Service | Quantity | Unit Cost | Total |
|---------|----------|-----------|-------|
| Firecrawl | 20 pages | $0.01 | $0.20 |
| Veo 3.1 | 500 videos | $0.222 | $111.00 |
| Google Drive | 25 GB | $0.02/GB | $0.50 |
| N8N Cloud Pro | 1 month | $50.00 | $50.00 |
| **Total** | — | — | **$161.70** |

**Cost per product:** $0.323

---

### Scenario 5: Multi-Variant Products (100 Products, 3 Variants Each)

| Service | Quantity | Unit Cost | Total |
|---------|----------|-----------|-------|
| Firecrawl | 5 pages | $0.01 | $0.05 |
| Veo 3.1 | 300 videos | $0.222 | $66.60 |
| Google Drive | 15 GB | $0.02/GB | $0.30 |
| N8N | 10 executions | $0.00 | $0.00 |
| **Total** | — | — | **$66.95** |

**Cost per variant video:** $0.223

---

## 📅 Monthly Cost Estimates

### Use Case 1: Small E-Commerce (Monthly Product Updates)

**Profile:**
- 50 existing products
- 10 new products added per month
- Re-shoot 5 products per month (seasonal updates)

| Expense | Monthly Cost |
|---------|--------------|
| Firecrawl (scraping) | $0.02 |
| Veo 3.1 (15 videos) | $3.33 |
| Google Drive | $0.00 (free tier) |
| N8N Cloud Starter | $20.00 |
| **Total** | **$23.35/month** |

**Annual:** $280.20

---

### Use Case 2: Medium Brand (Weekly New Arrivals)

**Profile:**
- 200 existing products
- 40 new products per month (10/week)
- Re-shoot 10 products per month

| Expense | Monthly Cost |
|---------|--------------|
| Firecrawl (scraping) | $0.10 |
| Veo 3.1 (50 videos) | $11.10 |
| Google Drive | $0.20 |
| N8N Cloud Starter | $20.00 |
| **Total** | **$31.40/month** |

**Annual:** $376.80

---

### Use Case 3: Large Catalog (Quarterly Refresh)

**Profile:**
- 1,000 existing products
- Full catalog video refresh every 3 months (333 videos/month)
- 50 new products per month

| Expense | Monthly Cost |
|---------|--------------|
| Firecrawl (scraping) | $0.50 |
| Veo 3.1 (383 videos) | $85.03 |
| Google Drive (50 GB) | $1.00 |
| N8N Cloud Pro | $50.00 |
| **Total** | **$136.53/month** |

**Annual:** $1,638.36

---

### Use Case 4: Multi-Platform Seller (Social Media Variants)

**Profile:**
- 100 products
- Generate 3 aspect ratios per product (16:9, 9:16, 1:1)
- Monthly updates

| Expense | Monthly Cost |
|---------|--------------|
| Firecrawl (scraping) | $0.05 |
| Veo 3.1 (300 videos) | $66.60 |
| Google Drive (20 GB) | $0.40 |
| N8N Cloud Pro | $50.00 |
| **Total** | **$117.05/month** |

**Annual:** $1,404.60

---

## 🎯 Cost Optimization Tips

### 1. Reduce Video Duration

**Impact:** High savings

| Duration | Cost (1080p) | Savings vs 8s |
|----------|--------------|---------------|
| 4s | $0.12 | 45% |
| 6s | $0.17 | 23% |
| 8s | $0.22 | — |
| 12s | $0.32 | -45% |

**Recommendation:** Use 4-6s for social media (TikTok, Instagram Reels prefer shorter)

---

### 2. Lower Video Resolution

**Impact:** Moderate savings

| Resolution | Cost (8s) | Savings | Use Case |
|------------|-----------|---------|----------|
| 720p | $0.15 | 32% | Social media, mobile |
| 1080p | $0.22 | — | Standard e-commerce |
| 4K | $0.45 | -105% | Premium brands only |

**Recommendation:** 720p is sufficient for most social media platforms

---

### 3. Batch Processing with Caching

**Strategy:** Save scraped data to avoid re-scraping

```javascript
// Cache product data in N8N database or Google Sheets
// Only scrape new products since last run

const lastScrapeDate = await getLastScrapeDate();
const newProducts = await scrapeProductsSince(lastScrapeDate);
```

**Savings:** 80-90% reduction in Firecrawl costs for recurring updates

---

### 4. Rate Limit Optimization

**Problem:** Unused API capacity due to conservative rate limiting

**Solution:** Maximize API throughput without hitting rate limits

```javascript
// Process 5 videos simultaneously (adjust based on quota)
batchSize: 5
waitBetweenBatches: 3 seconds
```

**Impact:** 
- Reduces total workflow execution time
- Minimizes N8N Cloud execution costs (charged per execution time)

---

### 5. Smart Image Selection

**Strategy:** Only generate videos for hero products

**Example Logic:**
```javascript
// Filter products by priority
const products = allProducts.filter(p => {
  return p.price > 50 ||        // High-value items
         p.isNewArrival ||        // New products
         p.salesVelocity > 10;    // Best sellers
});
```

**Savings:** 50-70% by focusing on revenue-generating products

---

### 6. Reuse Generic Backgrounds

**Strategy:** Generate once, reuse for similar products

**Example:**
1. Generate 5 background styles (white, gray, gradient, lifestyle, nature)
2. Use same background for product category
3. Only generate product-specific animations

**Savings:** 30-40% for large catalogs with similar products

---

### 7. Use Lower-Cost Alternatives for Testing

| Service | Production | Testing/Dev | Savings |
|---------|------------|-------------|---------|
| Veo 3.1 | 1080p, 8s | 720p, 4s | 60% |
| Firecrawl | Full scrape | Manual input | 100% |
| N8N | Cloud | Self-hosted | $20/mo |

---

## 🎁 Free Tier Information

### Firecrawl Free Credits

- **500 credits/month** (resets monthly)
- 1 credit = 1 page scrape
- No credit card required for signup
- **Equivalent value:** $5/month

**What you can do:**
- Scrape 500 collection pages
- Process ~5,000-10,000 products (depending on pagination)

---

### Google Cloud Free Trial

- **$300 in credits** for 90 days
- Applies to all Google Cloud services (Veo 3.1, Drive API)
- Credit card required but not charged until trial ends

**What you can do:**
- Generate ~1,350 videos (8s @ 1080p)
- Test the full workflow for 3 months at no cost

---

### Google Drive Free Storage

- **15 GB free** (shared with Gmail and Photos)
- **~250-375 videos** before hitting limit

**Upgrade Options:**
| Plan | Storage | Cost |
|------|---------|------|
| Google One Basic | 100 GB | $1.99/mo |
| Google One Standard | 200 GB | $2.99/mo |

---

### N8N Free Self-Hosting

- **Unlimited executions** if self-hosted
- **Free server options:**
  - Oracle Cloud Free Tier: 2 VMs (1GB RAM each)
  - Google Cloud Free Tier: E2-micro (1GB RAM)
  - AWS Free Tier: t2.micro (1GB RAM, 12 months)

**Minimum specs for this workflow:**
- 2GB RAM
- 1 CPU core
- 10GB storage

---

## 💡 ROI Comparison

### Traditional Videography vs AI Automation

| Method | Cost per Video | Time per Video | Quality |
|--------|----------------|----------------|---------|
| **Professional Videographer** | $200-500 | 1-2 hours | ⭐⭐⭐⭐⭐ |
| **In-House Studio** | $50-100 | 30-60 min | ⭐⭐⭐⭐ |
| **Stock Video + Editing** | $20-50 | 20-30 min | ⭐⭐⭐ |
| **AI Automation (Veo 3.1)** | $0.22 | 1-2 min | ⭐⭐⭐⭐ |

---

### Break-Even Analysis

**Scenario:** You need to generate 100 product videos

| Method | Total Cost | Time Investment | Cost per Video |
|--------|-----------|-----------------|----------------|
| Professional Videography | $30,000 | 150 hours | $300 |
| In-House Production | $7,500 | 75 hours | $75 |
| AI Automation | $22.25 | 2 hours | $0.22 |

**Savings with AI:**
- vs Professional: **$29,977.75 (99.9% savings)**
- vs In-House: **$7,477.75 (99.7% savings)**

**Time Savings:**
- vs Professional: **148 hours**
- vs In-House: **73 hours**

---

### Conversion Rate Impact

**E-Commerce Industry Averages:**
- Product pages with video: **2.5x higher conversion** than without
- Average order value: $75
- Conversion rate improvement: 1% → 2.5% (+1.5%)

**Example Calculation (1,000 monthly visitors):**

| Metric | Without Video | With Video | Difference |
|--------|---------------|------------|------------|
| Visitors | 1,000 | 1,000 | — |
| Conversion Rate | 1.0% | 2.5% | +1.5% |
| Orders | 10 | 25 | +15 |
| Revenue | $750 | $1,875 | +$1,125 |
| **Monthly Video Cost** | $0 | $22.25 | — |
| **Net Gain** | — | — | **+$1,102.75** |

**ROI:** 4,955% (for 100 products generating $1,102.75 additional revenue)

---

### Annual Savings (100-Product Catalog)

| Expense Category | Traditional | AI Automation | Savings |
|------------------|-------------|---------------|---------|
| Initial Video Creation | $30,000 | $22.25 | $29,977.75 |
| Quarterly Updates (25 videos) | $7,500 | $5.56 | $7,494.44 |
| Seasonal Re-shoots (50 videos) | $15,000 | $11.10 | $14,988.90 |
| New Products (10/month × 12) | $36,000 | $26.64 | $35,973.36 |
| **Annual Total** | **$88,500** | **$65.55** | **$88,434.45** |

**Annual ROI:** 134,826%

---

## 🔗 Pricing Resources

### Official Pricing Pages

- **Firecrawl:** [firecrawl.dev/pricing](https://firecrawl.dev/pricing)
- **Google Vertex AI:** [cloud.google.com/vertex-ai/pricing](https://cloud.google.com/vertex-ai/pricing)
- **Google Veo 3.1 (Gemini API):** [ai.google.dev/pricing](https://ai.google.dev/pricing)
- **Google Drive:** [one.google.com/about/plans](https://one.google.com/about/plans)
- **N8N Cloud:** [n8n.io/pricing](https://n8n.io/pricing)

### Pricing Calculators

- **Google Cloud Pricing Calculator:** [cloud.google.com/products/calculator](https://cloud.google.com/products/calculator)
- **AWS Pricing Calculator:** [calculator.aws](https://calculator.aws)
- **DigitalOcean Calculator:** [digitalocean.com/pricing/calculator](https://www.digitalocean.com/pricing/calculator)

---

## 📊 Cost Tracking Template

Use this spreadsheet template to track your actual costs:

```
| Date | Products | Firecrawl | Veo 3.1 | Drive | N8N | Total |
|------|----------|-----------|---------|-------|-----|-------|
| 2025-10-01 | 25 | $0.02 | $5.55 | $0.00 | $20 | $25.57 |
| 2025-10-15 | 10 | $0.01 | $2.22 | $0.00 | — | $2.23 |
| 2025-11-01 | 30 | $0.03 | $6.66 | $0.00 | $20 | $26.69 |
```

Download template: [cost-tracking-template.xlsx](./templates/cost-tracking-template.xlsx)

---

## 🚨 Cost Protection Tips

### 1. Set Up Budget Alerts

**Google Cloud:**
```
Console → Billing → Budgets & Alerts
Set budget: $50/month
Alert at: 50%, 90%, 100%
```

**Firecrawl:**
```
Dashboard → Usage
Enable email alerts at 80% quota
```

---

### 2. Monitor Execution Costs in N8N

```javascript
// Add to end of workflow
const costBreakdown = {
  firecrawl: $node["Firecrawl"].itemMatching(0).json.creditsUsed * 0.01,
  veo: $node["Loop Over Items"].itemMatching(0).json.videosGenerated * 0.222,
  totalCost: firecrawlCost + veoCost
};

console.log('Execution cost:', costBreakdown.totalCost);

// Send to Google Sheets for tracking
```

---

### 3. Implement Cost Caps

```javascript
// Function node to stop execution if cost exceeds budget
const MAX_COST_PER_EXECUTION = 50; // $50 limit
const estimatedCost = itemCount * 0.222;

if (estimatedCost > MAX_COST_PER_EXECUTION) {
  throw new Error(`Estimated cost ($${estimatedCost}) exceeds budget`);
}
```

---

## 🎯 Conclusion

**Key Takeaways:**

1. **Cost per product video:** ~$0.22
2. **Monthly costs for active stores:** $20-150/month
3. **ROI vs traditional methods:** 99%+ cost savings
4. **Break-even point:** First video generated
5. **Scalability:** Linear cost growth (predictable)

**Best for:**
- ✅ E-commerce stores with 50+ products
- ✅ Frequent product launches
- ✅ Multi-platform sellers (need multiple aspect ratios)
- ✅ Brands wanting to test video marketing

**Not ideal for:**
- ❌ Ultra-premium brands requiring perfect videography
- ❌ Products needing complex demonstrations
- ❌ One-time use cases (< 10 products)

---

<div align="center">
  <p><strong>Ready to save money? 💰</strong></p>
  <p><a href="../README.md">Get Started</a> | <a href="./SETUP.md">Setup Guide</a> | <a href="./CUSTOMIZATION.md">Customize</a></p>
</div>
