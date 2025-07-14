/**
 * Simple Puppeteer Test
 * Basic working test for TravelSync application
 */

import puppeteer from 'puppeteer';
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';

import { PUPPETEER_CONFIG } from '../puppeteer.config';

import type { Browser, Page } from 'puppeteer';

describe('Simple TravelSync Test', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch(PUPPETEER_CONFIG.BROWSER_OPTIONS);
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport(PUPPETEER_CONFIG.VIEWPORTS.DESKTOP);
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test('should load homepage successfully', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Wait a bit for any redirects
    await new Promise(resolve => setTimeout(resolve, 2000));

    const title = await page.title();
    const url = page.url();
    
    console.log(`✅ Page loaded - Title: "${title}"`);
    console.log(`✅ URL: ${url}`);
    
    expect(url).toContain('localhost:3001');
    expect(title).toBeTruthy();
  });

  test('should have basic page structure', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Wait a bit for content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check for basic HTML structure
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasContent = bodyText.length > 50;
    
    console.log(`✅ Page content length: ${bodyText.length} characters`);
    
    expect(hasContent).toBe(true);
  });

  test('should be responsive on different screen sizes', async () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      // Wait for content
      await new Promise(resolve => setTimeout(resolve, 1000));

      const bodyVisible = await page.evaluate(() => {
        const body = document.body;
        return body.offsetWidth > 0 && body.offsetHeight > 0;
      });
      
      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): Body visible = ${bodyVisible}`);
      
      expect(bodyVisible).toBe(true);
    }
  });
});