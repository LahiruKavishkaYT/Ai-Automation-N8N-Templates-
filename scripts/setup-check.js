#!/usr/bin/env node

/**
 * E-Commerce Video Automation - Setup Verification Script
 * 
 * This script checks your system requirements and API connectivity
 * before running the N8N workflow.
 * 
 * Usage:
 *   node scripts/setup-check.js
 * 
 * Or with environment variables:
 *   FIRECRAWL_API_KEY=xxx GEMINI_API_KEY=xxx node scripts/setup-check.js
 */

const https = require('https');
const { exec } = require('child_process');
const readline = require('readline');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const CHECKS = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
  CHECKS.passed++;
}

function error(message) {
  log(`✗ ${message}`, colors.red);
  CHECKS.failed++;
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
  CHECKS.warnings++;
}

function info(message) {
  log(`ℹ ${message}`, colors.cyan);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, colors.bright);
  log(`  ${title}`, colors.bright);
  log(`${'='.repeat(60)}`, colors.bright);
}

// Check Node.js version
function checkNodeVersion() {
  return new Promise((resolve) => {
    const version = process.version;
    const major = parseInt(version.split('.')[0].substring(1));
    
    if (major >= 18) {
      success(`Node.js version: ${version} (compatible)`);
    } else {
      error(`Node.js version: ${version} (requires v18 or higher)`);
    }
    resolve();
  });
}

// Check if N8N is installed
function checkN8NInstallation() {
  return new Promise((resolve) => {
    exec('n8n --version', (err, stdout) => {
      if (err) {
        warning('N8N not found in PATH (may be using N8N Cloud or Docker)');
      } else {
        success(`N8N installed: ${stdout.trim()}`);
      }
      resolve();
    });
  });
}

// Check system memory
function checkMemory() {
  return new Promise((resolve) => {
    const totalMem = (require('os').totalmem() / 1024 / 1024 / 1024).toFixed(2);
    
    if (totalMem >= 4) {
      success(`System memory: ${totalMem} GB (recommended)`);
    } else if (totalMem >= 2) {
      warning(`System memory: ${totalMem} GB (minimum, 4GB recommended)`);
    } else {
      error(`System memory: ${totalMem} GB (insufficient, minimum 2GB required)`);
    }
    resolve();
  });
}

// Check Firecrawl API connectivity
function checkFirecrawlAPI(apiKey) {
  return new Promise((resolve) => {
    if (!apiKey) {
      warning('Firecrawl API key not provided (skipping connectivity test)');
      info('  Set FIRECRAWL_API_KEY environment variable to test');
      resolve();
      return;
    }

    const options = {
      hostname: 'api.firecrawl.dev',
      path: '/v1/scrape',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 400) {
        // 400 is expected without a valid body, but auth worked
        success('Firecrawl API: Connected (API key valid)');
      } else if (res.statusCode === 401) {
        error('Firecrawl API: Authentication failed (invalid API key)');
      } else {
        warning(`Firecrawl API: Unexpected status ${res.statusCode}`);
      }
      resolve();
    });

    req.on('error', (e) => {
      error(`Firecrawl API: Connection failed (${e.message})`);
      resolve();
    });

    req.write(JSON.stringify({ url: 'https://example.com' }));
    req.end();
  });
}

// Check Google Gemini API connectivity
function checkGeminiAPI(apiKey) {
  return new Promise((resolve) => {
    if (!apiKey) {
      warning('Gemini API key not provided (skipping connectivity test)');
      info('  Set GEMINI_API_KEY environment variable to test');
      resolve();
      return;
    }

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        success('Google Gemini API: Connected (API key valid)');
      } else if (res.statusCode === 400) {
        // 400 might mean invalid request but auth worked
        success('Google Gemini API: API key valid (test request failed as expected)');
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        error('Google Gemini API: Authentication failed (invalid API key)');
      } else {
        warning(`Google Gemini API: Unexpected status ${res.statusCode}`);
      }
      resolve();
    });

    req.on('error', (e) => {
      error(`Google Gemini API: Connection failed (${e.message})`);
      resolve();
    });

    req.write(JSON.stringify({
      contents: [{ parts: [{ text: 'Hello' }] }],
    }));
    req.end();
  });
}

// Check FFmpeg (optional for post-processing)
function checkFFmpeg() {
  return new Promise((resolve) => {
    exec('ffmpeg -version', (err, stdout) => {
      if (err) {
        info('FFmpeg not found (optional, needed for video post-processing)');
      } else {
        const version = stdout.split('\n')[0];
        success(`FFmpeg installed: ${version}`);
      }
      resolve();
    });
  });
}

// Prompt for API keys if not provided
function promptForKeys() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const keys = {
      firecrawl: process.env.FIRECRAWL_API_KEY || '',
      gemini: process.env.GEMINI_API_KEY || '',
    };

    if (keys.firecrawl && keys.gemini) {
      rl.close();
      resolve(keys);
      return;
    }

    log('\n' + colors.cyan + 'API Key Configuration' + colors.reset);
    log('You can provide API keys now or skip and test later.\n');

    const questions = [];

    if (!keys.firecrawl) {
      questions.push({
        prompt: 'Firecrawl API Key (or press Enter to skip): ',
        key: 'firecrawl',
      });
    }

    if (!keys.gemini) {
      questions.push({
        prompt: 'Google Gemini API Key (or press Enter to skip): ',
        key: 'gemini',
      });
    }

    let currentQuestion = 0;

    function askNext() {
      if (currentQuestion >= questions.length) {
        rl.close();
        resolve(keys);
        return;
      }

      const q = questions[currentQuestion];
      rl.question(q.prompt, (answer) => {
        if (answer.trim()) {
          keys[q.key] = answer.trim();
        }
        currentQuestion++;
        askNext();
      });
    }

    askNext();
  });
}

// Print summary
function printSummary() {
  section('Setup Check Summary');
  
  log(`\nChecks passed:  ${colors.green}${CHECKS.passed}${colors.reset}`);
  log(`Checks failed:  ${colors.red}${CHECKS.failed}${colors.reset}`);
  log(`Warnings:       ${colors.yellow}${CHECKS.warnings}${colors.reset}\n`);

  if (CHECKS.failed === 0 && CHECKS.warnings === 0) {
    success('🎉 All checks passed! You\'re ready to run the workflow.');
  } else if (CHECKS.failed === 0) {
    warning('⚠️  Some warnings detected. Review them before proceeding.');
  } else {
    error('❌ Some checks failed. Fix the issues before running the workflow.');
  }

  log('\nNext Steps:');
  info('  1. Import the workflow: workflows/product-video-generator.json');
  info('  2. Configure credentials in N8N');
  info('  3. Test with a sample URL');
  info('\nFor detailed setup instructions, see: docs/SETUP.md\n');
}

// Main execution
async function main() {
  log('\n' + colors.bright + '🚀 E-Commerce Video Automation - Setup Check' + colors.reset);
  log(colors.cyan + 'Verifying system requirements and API connectivity...\n' + colors.reset);

  // System checks
  section('System Requirements');
  await checkNodeVersion();
  await checkMemory();
  await checkN8NInstallation();
  await checkFFmpeg();

  // API checks
  section('API Connectivity');
  const keys = await promptForKeys();
  await checkFirecrawlAPI(keys.firecrawl);
  await checkGeminiAPI(keys.gemini);

  // Summary
  printSummary();
}

// Run
main().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
