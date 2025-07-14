/**
 * Basic Puppeteer Test
 * Simple test to verify Puppeteer setup is working
 */

import puppeteer from 'puppeteer';
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';

import { PUPPETEER_CONFIG } from '../puppeteer.config';

import type { Browser, Page } from 'puppeteer';

describe('Basic Puppeteer Test', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch(PUPPETEER_CONFIG.BROWSER_OPTIONS);
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport(PUPPETEER_CONFIG.VIEWPORTS.DESKTOP);
  });

  afterEach(async () => {
    await page.close();
  });

  test('should launch browser and create page', async () => {
    expect(browser).toBeDefined();
    expect(page).toBeDefined();
  });

  test('should navigate to application homepage', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    const title = await page.title();
    const url = page.url();
    
    console.log(`Page title: "${title}"`);
    console.log(`Page URL: ${url}`);
    
    expect(url).toBe(PUPPETEER_CONFIG.BASE_URL + '/');
    expect(title).toBeTruthy();
  });

  test('should find page content', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Check if page has any content
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasContent = bodyText.length > 0;
    
    console.log(`Page content length: ${bodyText.length} characters`);
    console.log(`First 200 characters: "${bodyText.substring(0, 200)}..."`);
    
    expect(hasContent).toBe(true);
  });

  test('should handle basic interaction', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Try to find clickable elements
    const clickableElements = await page.$$eval('button, a, [role="button"]', elements => 
      elements.length
    );
    
    console.log(`Found ${clickableElements} clickable elements`);
    
    // Should have at least some interactive elements
    expect(clickableElements).toBeGreaterThan(0);
  });

  test('should be responsive', async () => {
    const viewports = [
      { name: 'Mobile', ...PUPPETEER_CONFIG.VIEWPORTS.MOBILE },
      { name: 'Desktop', ...PUPPETEER_CONFIG.VIEWPORTS.DESKTOP }
    ];

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      const bodyVisible = await page.isVisible('body');
      console.log(`${viewport.name} (${viewport.width}x${viewport.height}): Body visible = ${bodyVisible}`);
      
      expect(bodyVisible).toBe(true);
    }
  });
});